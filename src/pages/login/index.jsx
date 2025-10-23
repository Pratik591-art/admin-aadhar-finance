import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react';
import logo from '../../assets/logod.png';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setAuthError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Check super-admin collection for authorization. We will look for a document with uid or email.
      // First try by uid
      const adminDocRef = doc(db, 'super-admin', user.uid);
      const adminSnap = await getDoc(adminDocRef);

      if (adminSnap.exists()) {
        // authorized
        navigate('/dashboard');
        return;
      }

      // fallback: search by email field in super-admin collection
      const q = query(collection(db, 'super-admin'), where('email', '==', user.email));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        navigate('/dashboard');
        return;
      }

      // not authorized
      await auth.signOut();
      setAuthError('User is not authorized as super-admin');
    } catch (err) {
      console.error(err);
      setAuthError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        {/* Left Side - Branding */}
        <div className="bg-linear-to-br from-transparent via-transparent to-blue-500/50 p-12 md:w-2/5 flex flex-col justify-center">
          <div className="mb-8">
            <div className="h-20 flex items-center mb-6">
              <img src={logo} alt="Logo" className="h-16" />
            </div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-blue-900">Secure access to your dashboard</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold">Secure Login</h3>
                <p className="text-blue-900 text-sm">Protected with encryption</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold">Admin Access</h3>
                <p className="text-blue-900 text-sm">Full control panel access</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-12 md:w-3/5">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Please login to your admin account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Email is invalid' } })}
                  placeholder="admin@example.com"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 transition ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 transition ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 shadow-lg"
            >
              Login to Dashboard
            </button>
          </form>

          {authError && (
            <div className="mt-4 text-center">
              <p className="text-red-500 text-sm">{authError}</p>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Protected by enterprise-level security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
