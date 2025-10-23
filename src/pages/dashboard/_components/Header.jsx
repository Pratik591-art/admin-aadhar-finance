import { Bell, Search, Menu } from 'lucide-react';
import { auth } from '../../../firebase';

export default function Header({ onMenuClick }) {
  const userName = auth.currentUser?.displayName || 'Admin';
  const firstName = userName.split(' ')[0];

  return (
    <header className="border-b border-gray-100 sticky top-0 z-30 backdrop-blur-lg bg-white/80">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section - Menu & Welcome */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            {/* Welcome Message */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Welcome back, {firstName} 👋
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5 hidden sm:block">
                Here's what's happening with your loans today.
              </p>
            </div>
          </div>

          {/* Right Section - Search & Notifications */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Bar - Hidden on mobile */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 lg:w-64 transition-all"
              />
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Search Button - Mobile only */}
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors group">
              <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
