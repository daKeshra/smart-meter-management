// @ts-nocheck
 import { 
  Zap, 
  Settings, 
  Bell, 
  Monitor, 
  Users,
  Power,
  BarChart3,
  Menu,
  X,
  User,
  ChevronDown,
  LogOut,
  Gauge,
  Building2
} from 'lucide-react';
import NavItem from './NavItem';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Sidebar = ({ 
  sidebarCollapsed, 
  setSidebarCollapsed, 
  user: propUser, 
  showUserMenu, 
  setShowUserMenu 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(propUser || null);
  const [loadingUser, setLoadingUser] = useState(!propUser);

  // Fetch current user if not provided as prop
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (propUser) {
        setUser(propUser);
        setLoadingUser(false);
        return;
      }

      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) {
          setLoadingUser(false);
          return;
        }

        const response = await axios.get('http://localhost:8000/api/v1/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        // If token is invalid, clear it
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('authToken');
        }
      } finally {
        setLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, [propUser]);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/') return 'dashboard';
    if (path.startsWith('/dashboard/discos') || path.startsWith('/dashboard/DisCos')) return 'discos';
    if (path.startsWith('/dashboard/meters')) return 'meters';
    if (path.startsWith('/dashboard/analytics')) return 'analytics';
    if (path.startsWith('/dashboard/customers')) return 'customers';
    if (path.startsWith('/dashboard/devices')) return 'devices';
    if (path.startsWith('/dashboard/alerts')) return 'alerts';
    if (path.startsWith('/dashboard/settings')) return 'settings';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Update active tab when location changes
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  const handleNavigation = (path) => {
    navigate(path);
    setActiveTab(getActiveTab());
  };
  
  const handleLogout = async () => {
    try {
      // Clear tokens
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      
      // Reset user state
      setUser(null);
      
      // Navigate to login
      navigate('/login');
      
      // Close user menu
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Get user display info
  const getUserDisplayInfo = () => {
    if (!user) return { name: 'Loading...', email: '' };
    
    // Handle different possible user object structures
    const firstName = user.first_name || user.firstName || '';
    const lastName = user.last_name || user.lastName || '';
    const email = user.email || '';
    const username = user.username || '';
    
    // Create display name
    let displayName = '';
    if (firstName || lastName) {
      displayName = `${firstName} ${lastName}`.trim();
    } else if (username) {
      displayName = username;
    } else if (email) {
      displayName = email.split('@')[0]; 
    } else {
      displayName = 'User';
    }
    
    return {
      name: displayName,
      email: email,
      initials: getInitials(displayName)
    };
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const userInfo = getUserDisplayInfo();

  return (
    <div className={`fixed left-0 top-0 bg-gray-900 h-screen flex flex-col z-10 transition-all duration-300 ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-6 border-b border-gray-800 relative">
        <div className={`flex items-center transition-all duration-300 ${
          sidebarCollapsed ? 'justify-center' : 'space-x-3'
        }`}>
          <Zap className="w-8 h-8 text-emerald-400 flex-shrink-0" />
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold text-white">Smart Meter Management</h1>
          )}
        </div>
        
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-6 w-6 h-6 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
        >
          {sidebarCollapsed ? (
            <Menu className="w-3 h-3 text-gray-400" />
          ) : (
            <X className="w-3 h-3 text-gray-400" />
          )}
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <NavItem 
          icon={Monitor} 
          label="Dashboard" 
          active={activeTab === 'dashboard'}
          onClick={() => handleNavigation('/dashboard')}
          collapsed={sidebarCollapsed}
        />
        <NavItem 
          icon={Building2} 
          label="DisCos" 
          active={activeTab === 'discos'} 
          onClick={() => handleNavigation('/dashboard/DisCos')}
          collapsed={sidebarCollapsed}
        />
        <NavItem 
          icon={Gauge} 
          label="Meters" 
          active={activeTab === 'meters'} 
          onClick={() => handleNavigation('/dashboard/meters')}
          collapsed={sidebarCollapsed}
        />
        <NavItem 
          icon={BarChart3} 
          label="Analytics" 
          active={activeTab === 'analytics'} 
          onClick={() => handleNavigation('/dashboard/analytics')}
          collapsed={sidebarCollapsed}
        />
        <NavItem 
          icon={Users} 
          label="Customers" 
          active={activeTab === 'customers'} 
          onClick={() => handleNavigation('/dashboard/customers')}
          collapsed={sidebarCollapsed}
        />
        <NavItem 
          icon={Power} 
          label="Devices" 
          active={activeTab === 'devices'} 
          onClick={() => handleNavigation('/dashboard/devices')}
          collapsed={sidebarCollapsed}
        />
        <NavItem 
          icon={Bell} 
          label="Alerts" 
          active={activeTab === 'alerts'} 
          onClick={() => handleNavigation('/dashboard/alerts')}
          collapsed={sidebarCollapsed}
        />
        <NavItem 
          icon={Settings} 
          label="Settings" 
          active={activeTab === 'settings'} 
          onClick={() => handleNavigation('/dashboard/settings')}
          collapsed={sidebarCollapsed}
        />
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <div className="relative user-menu">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`w-full flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors ${
              sidebarCollapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <div className={`flex items-center transition-all duration-300 ${
              sidebarCollapsed ? 'justify-center' : 'space-x-3'
            }`}>
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                {loadingUser ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : userInfo.initials ? (
                  <span className="text-white text-sm font-medium">{userInfo.initials}</span>
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              {!sidebarCollapsed && !loadingUser && (
                <div className="text-left">
                  <div className="text-sm font-medium text-white">{userInfo.name}</div>
                  {userInfo.email && (
                    <div className="text-xs text-gray-400">{userInfo.email}</div>
                  )}
                </div>
              )}
              {!sidebarCollapsed && loadingUser && (
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-400">Loading...</div>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            )}
          </button>
          
          {showUserMenu && !sidebarCollapsed && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
              <button
                onClick={() => {
                  handleNavigation('/dashboard/settings');
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors rounded-t-lg"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-white">Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors rounded-b-lg text-red-400 hover:text-red-300"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;