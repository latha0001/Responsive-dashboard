import React, { useRef, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationsContext';
import { getTimeAgo } from '../../utils/dateUtils';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside of dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Get notification type specific styling
  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'Job Created':
        return 'bg-blue-50 border-blue-200';
      case 'Job Updated':
        return 'bg-yellow-50 border-yellow-200';
      case 'Job Completed':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'Job Created':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'Job Updated':
        return <Bell className="h-5 w-5 text-yellow-500" />;
      case 'Job Completed':
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
    >
      <div className="p-2">
        <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
          <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-primary-600 hover:text-primary-800"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto py-1">
          {notifications.length === 0 ? (
            <div className="py-3 px-2 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-2 border rounded-md ${getNotificationStyle(notification.type)} ${
                    notification.isRead ? 'opacity-60' : 'opacity-100'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-2">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {notification.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {getTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-gray-400 hover:text-gray-500"
                          aria-label="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-500"
                        aria-label="Remove notification"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;