import React from "react";
import { Link } from "react-router-dom";
import { MdLogout } from "react-icons/md";

const AdminTopNav = ({ user, logout }) => (
  <nav className="bg-white shadow-sm border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-orange-600">
            Firefly Admin
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Welcome, {user?.name}</span>
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <MdLogout />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
);

export default AdminTopNav;
