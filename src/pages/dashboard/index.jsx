import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import DashboardLayout from './_components/DashboardLayout';
import { TrendingUp, TrendingDown, FileText, CheckCircle, Clock, XCircle, Eye, CheckSquare, X, IndianRupee } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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

  // Sample data for analytics cards
  const stats = [
    { 
      label: 'Total Loan Applications', 
      value: '1,250', 
      trend: '+12%', 
      isPositive: true, 
      icon: FileText,
      color: 'blue' 
    },
    { 
      label: 'Approved Loans', 
      value: '845', 
      trend: '+8%', 
      isPositive: true, 
      icon: CheckCircle,
      color: 'green' 
    },
    { 
      label: 'Pending Loans', 
      value: '270', 
      trend: '-3%', 
      isPositive: false, 
      icon: Clock,
      color: 'yellow' 
    },
    { 
      label: 'Rejected Loans', 
      value: '135', 
      trend: '+2%', 
      isPositive: false, 
      icon: XCircle,
      color: 'red' 
    },
  ];

  // Bar chart data - Monthly loan trends
  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Loan Applications',
        data: [65, 78, 90, 81, 96, 105, 118, 130, 125, 140],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Donut chart data - Loan types distribution
  const doughnutChartData = {
    labels: ['Personal', 'Business', 'Vehicle', 'Home', 'Education'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
    },
  };

  // Sample recent applications data
  const recentApplications = [
    { 
      id: 1, 
      applicant: 'Ramesh Kumar', 
      loanType: 'Personal', 
      amount: '₹50,000', 
      status: 'Approved', 
      date: '17 Oct 2025' 
    },
    { 
      id: 2, 
      applicant: 'Priya Shah', 
      loanType: 'Business', 
      amount: '₹2,00,000', 
      status: 'Pending', 
      date: '17 Oct 2025' 
    },
    { 
      id: 3, 
      applicant: 'Amit Patel', 
      loanType: 'Vehicle', 
      amount: '₹3,50,000', 
      status: 'Approved', 
      date: '16 Oct 2025' 
    },
    { 
      id: 4, 
      applicant: 'Sneha Reddy', 
      loanType: 'Home', 
      amount: '₹15,00,000', 
      status: 'Pending', 
      date: '16 Oct 2025' 
    },
    { 
      id: 5, 
      applicant: 'Vikram Singh', 
      loanType: 'Personal', 
      amount: '₹75,000', 
      status: 'Rejected', 
      date: '15 Oct 2025' 
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      Approved: 'bg-green-100 text-green-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Rejected: 'bg-red-100 text-red-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600',
    };
    return colors[color] || 'bg-gray-100 text-gray-600';
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 hover:shadow-md hover:border-gray-200 transition-all duration-300 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">{stat.label}</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{stat.value}</h3>
                  <div className="flex items-center gap-1.5">
                    {stat.isPositive ? (
                      <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                    )}
                    <span className={`text-xs sm:text-sm font-semibold ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend}
                    </span>
                    <span className="text-gray-500 text-xs hidden sm:inline">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 sm:p-3.5 rounded-xl ${getColorClasses(stat.color)} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Disbursed Card */}
      <div className="bg-linear-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <IndianRupee className="w-5 h-5 text-blue-100" />
              <p className="text-blue-100 text-sm font-medium">Total Disbursed Amount</p>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">₹5.2 Crore</h2>
            <p className="text-blue-100 text-sm">Across all approved loans this year</p>
          </div>
          <div className="hidden sm:flex bg-white/10 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-white/20">
            <FileText className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Monthly Loan Trends</h3>
          <div className="h-64 sm:h-80">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Loan Type Distribution</h3>
          <div className="h-64 sm:h-80">
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Recent Loan Applications</h3>
          <p className="text-sm text-gray-500 mt-1">Latest applications requiring attention</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Loan Type
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                  Date
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {recentApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="font-semibold text-sm text-gray-900">{app.applicant}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{app.loanType}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="font-bold text-sm text-gray-900">{app.amount}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                    {app.date}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      {app.status === 'Pending' && (
                        <>
                          <button className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                            <CheckSquare className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
