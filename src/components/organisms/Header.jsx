import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { AuthContext } from '@/App';
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onAddClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { path: "/", label: "Today", icon: "Home" },
    { path: "/tasks", label: "Tasks", icon: "CheckSquare" },
    { path: "/notes", label: "Notes", icon: "FileText" },
    { path: "/meetings", label: "Meetings", icon: "Calendar" }
  ];

  const currentPageTitle = () => {
    const currentItem = navigationItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : "Daily Flow";
  };

  const getAddButtonText = () => {
    switch (location.pathname) {
      case "/tasks":
        return "Add Task";
      case "/notes":
        return "Add Note";
      case "/meetings":
        return "Add Meeting";
      default:
        return "Add Item";
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-primary to-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Daily Flow</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Productivity Management</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <ApperIcon name={item.icon} size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

{/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button
              onClick={onAddClick}
              size="sm"
              className="hidden sm:flex items-center space-x-2"
            >
              <ApperIcon name="Plus" size={16} />
              <span>{getAddButtonText()}</span>
            </Button>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              {user && (
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                  <span>Welcome, {user.firstName || user.name || 'User'}</span>
                </div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-1"
              >
                <ApperIcon name="LogOut" size={16} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-primary to-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <ApperIcon name={item.icon} size={18} />
                <span>{item.label}</span>
              </button>
            ))}
            
            <div className="pt-2 mt-3 border-t border-gray-200">
              <Button
                onClick={() => {
                  onAddClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2"
                size="sm"
              >
                <ApperIcon name="Plus" size={16} />
<span>{getAddButtonText()}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 mt-2"
              >
                <ApperIcon name="LogOut" size={16} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;