import React from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { formatRole } from '../../utils/roleUtils';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationsContext';
import NotificationDropdown from '../Notifications/NotificationDropdown';

interface HeaderProps {
  pageTitle: string;
  userRole: string;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ pageTitle, userRole, onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = React.useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={onMenuClick}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900 ml-2 md:ml-0">{pageTitle}</h1>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="relative">
              <button
                type="button"
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 relative"
                onClick={toggleNotifications}
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-accent-500 text-white text-xs flex items-center justify-center transform -translate-y-1/4 translate-x-1/4">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <NotificationDropdown onClose={() => setShowNotifications(false)} />
              )}
            </div>
            
            <div className="ml-3 relative flex items-center">
              <div className="flex items-center">
                <div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.email}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatRole(userRole)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-3 p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <span className="sr-only">Log out</span>
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;