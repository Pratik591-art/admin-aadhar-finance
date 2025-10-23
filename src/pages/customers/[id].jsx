import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../../firebase';
import DashboardLayout from '../dashboard/_components/DashboardLayout';
import { doc, getDoc } from 'firebase/firestore';
import { 
  User, Mail, Phone, Calendar, MapPin, Briefcase, 
  CreditCard, FileText, ArrowLeft, Edit, Trash2, 
  Home, Globe, Hash, Clock
} from 'lucide-react';

export default function CustomerDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user && id) {
      const fetchCustomer = async () => {
        setLoading(true);
        try {
          const customerDoc = await getDoc(doc(db, 'users', id));
          if (customerDoc.exists()) {
            setCustomer({ id: customerDoc.id, ...customerDoc.data() });
          } else {
            console.error('Customer not found');
            navigate('/customers');
          }
        } catch (error) {
          console.error('Error fetching customer:', error);
          navigate('/customers');
        } finally {
          setLoading(false);
        }
      };
      fetchCustomer();
    }
  }, [user, id, navigate]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString('en-IN', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      return new Date(timestamp).toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    } catch {
      return 'N/A';
    }
  };

  const formatDateOfBirth = (dob) => {
    if (!dob) return 'N/A';
    try {
      const date = new Date(dob);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dob;
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    try {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch {
      return null;
    }
  };

  if (!user || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading customer details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!customer) return null;

  const InfoCard = ({ icon, label, value, fullWidth = false }) => {
    const Icon = icon;
    return (
      <div className={`${fullWidth ? 'col-span-full' : ''}`}>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
          <div className="p-2 bg-white rounded-lg shrink-0">
            <Icon className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-sm font-semibold text-gray-900 wrap-break-word">{value || 'Not provided'}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <button
          onClick={() => navigate('/customers')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Customers</span>
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shrink-0">
              {customer.fullName ? customer.fullName.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {customer.fullName || customer.name || 'N/A'}
              </h1>
              <p className="text-gray-500 text-sm mt-1">Customer ID: {customer.uid || customer.id}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  customer.status === 'inactive' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {customer.status || 'Active'}
                </span>
                {customer.gender && (
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {customer.gender === 'male' ? '👨 Male' : '👩 Female'}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              <Edit className="w-4 h-4" />
              <span className="text-sm font-medium">Edit</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">
              <Trash2 className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard icon={User} label="Full Name" value={customer.fullName || customer.name} />
              <InfoCard icon={Calendar} label="Date of Birth" value={
                customer.dateOfBirth 
                  ? `${formatDateOfBirth(customer.dateOfBirth)}${calculateAge(customer.dateOfBirth) ? ` (${calculateAge(customer.dateOfBirth)} years)` : ''}`
                  : 'N/A'
              } />
              <InfoCard icon={Globe} label="Gender" value={customer.gender ? (customer.gender.charAt(0).toUpperCase() + customer.gender.slice(1)) : 'N/A'} />
              <InfoCard icon={Briefcase} label="Occupation" value={customer.occupation} />
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard icon={Mail} label="Email Address" value={customer.email} />
              <InfoCard icon={Phone} label="Phone Number" value={customer.phoneNumber} />
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Address Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard icon={Home} label="Address" value={customer.address} fullWidth={!customer.city && !customer.state} />
              <InfoCard icon={MapPin} label="City" value={customer.city} />
              <InfoCard icon={Globe} label="State" value={customer.state} />
              <InfoCard icon={Hash} label="Pincode" value={customer.pincode} />
            </div>
          </div>

          {/* Identity Documents */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Identity Documents
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard 
                icon={FileText} 
                label="Aadhar Number" 
                value={customer.aadharNumber || 'Not provided'} 
              />
              <InfoCard 
                icon={CreditCard} 
                label="PAN Number" 
                value={customer.panNumber || 'Not provided'} 
              />
            </div>
            {(!customer.aadharNumber || !customer.panNumber) && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Some identity documents are missing. Please request the customer to complete their profile.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Timeline */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Account Timeline
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg shrink-0">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {formatDate(customer.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {formatDate(customer.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-linear-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl shadow-lg p-6 text-white">
            <h2 className="text-lg font-bold mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-blue-100 text-sm">Total Loans</span>
                <span className="text-2xl font-bold">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-100 text-sm">Active Loans</span>
                <span className="text-2xl font-bold">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-100 text-sm">Total Disbursed</span>
                <span className="text-2xl font-bold">₹0</span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-medium transition-colors border border-white/20">
              View Loan History
            </button>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-medium transition-colors text-left">
                📄 View Documents
              </button>
              <button className="w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-medium transition-colors text-left">
                💬 Send Message
              </button>
              <button className="w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-medium transition-colors text-left">
                📊 View Activity Log
              </button>
              <button className="w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-medium transition-colors text-left">
                🔒 Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
