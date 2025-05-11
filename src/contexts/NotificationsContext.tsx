import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getNotifications, 
  createNotification, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification
} from '../utils/localStorageUtils';
import { Notification, NotificationType } from '../types';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => Notification;
  markAsRead: (id: string) => Notification | undefined;
  markAllAsRead: () => void;
  removeNotification: (id: string) => boolean;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = () => {
    try {
      setLoading(true);
      const notifications = getNotifications();
      setNotifications(notifications);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  // Calculate unread count
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt'>): Notification => {
    try {
      const newNotification = createNotification(notificationData);
      setNotifications(prev => [newNotification, ...prev]);
      return newNotification;
    } catch (err) {
      setError('Failed to add notification');
      throw new Error('Failed to add notification');
    }
  };

  const markAsRead = (id: string): Notification | undefined => {
    try {
      const updatedNotification = markNotificationAsRead(id);
      if (updatedNotification) {
        setNotifications(prev => prev.map(notification => 
          notification.id === id ? updatedNotification : notification
        ));
      }
      return updatedNotification;
    } catch (err) {
      setError('Failed to mark notification as read');
      return undefined;
    }
  };

  const markAllAsRead = (): void => {
    try {
      markAllNotificationsAsRead();
      setNotifications(prev => prev.map(notification => ({
        ...notification,
        isRead: true
      })));
    } catch (err) {
      setError('Failed to mark all notifications as read');
    }
  };

  const removeNotification = (id: string): boolean => {
    try {
      const success = deleteNotification(id);
      if (success) {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
      }
      return success;
    } catch (err) {
      setError('Failed to delete notification');
      return false;
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification
  };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

export const useNotifications = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};