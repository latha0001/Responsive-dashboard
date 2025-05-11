import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ship, LayoutDashboard, PenTool as Tools, Wrench, Calendar, LifeBuoy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserFeatures } from '../../utils/roleUtils';

interface SidebarProps {
  mobile?: boolean;
  onCloseSidebar?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobile = false, onCloseSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();
  const features = getUserFeatures(user?.role);

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', feature: 'dashboard' },
    { name: 'Ships', icon: Ship, href: '/ships', feature: 'ships' },
    { name: 'Maintenance Jobs', icon: Tools, href: '/jobs', feature: 'jobs' },
    { name: 'Calendar', icon: Calendar, href: '/calendar', feature: 'calendar' }
  ];
  
  // Filter navigation items based on user permissions
  const allowedNavigation = navigation.filter(item => 
    features.includes(item.feature as any)
  );

  return (
    <div className="w-64 bg-primary-600 text-white flex flex-col h-full">
      <div className="h-16 flex items-center px-4">
        <div className="flex items-center space-x-2">
          <LifeBuoy className="h-6 w-6 text-white" />
          <span className="text-xl font-bold">ENTNT Marine</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {allowedNavigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={mobile ? onCloseSidebar : undefined}
                className={`${
                  isActive
                    ? 'bg-primary-700 text-white'
                    : 'text-white hover:bg-primary-500'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
              >
                <item.icon
                  className={`${
                    isActive ? 'text-white' : 'text-primary-300 group-hover:text-white'
                  } mr-3 flex-shrink-0 h-6 w-6 transition-colors`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-primary-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Wrench className="h-5 w-5 text-primary-300" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">ENTNT</p>
            <p className="text-xs font-medium text-primary-300">Ship Maintenance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;