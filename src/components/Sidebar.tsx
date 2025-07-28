import { 
  Zap, 
  Settings, 
  Bell, 
  Monitor, 
  // FileText, 
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

const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  sidebarCollapsed, 
  setSidebarCollapsed, 
  user, 
  showUserMenu, 
  setShowUserMenu 
}) => {
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
          onClick={() => setActiveTab('dashboard')}
          collapsed={sidebarCollapsed}
        />
        <NavItem 
          icon={Building2} 
          label="DisCos" 
          active={activeTab === 'DisCos'} 
          onClick={() => setActiveTab('DisCos')}
          collapsed={sidebarCollapsed}
        />
        <NavItem 
          icon={Gauge} 
          label="Meters" 
          active={activeTab === 'meters'} 
          onClick={() => setActiveTab('meters')}
          collapsed={sidebarCollapsed}
        />
        <NavItem 
          icon={BarChart3} 
          label="Analytics" 
          active={activeTab === 'analytics'} 
          onClick={() => setActiveTab('analytics')}
          collapsed={sidebarCollapsed}
        />
        <NavItem 
          icon={Users} 
          label="Customers" 
          active={activeTab === 'customers'} 
          onClick={() => setActiveTab('customers')}
          collapsed={sidebarCollapsed}
        />
        <NavItem 
          icon={Power} 
          label="Devices" 
          active={activeTab === 'devices'} 
          onClick={() => setActiveTab('devices')}
          collapsed={sidebarCollapsed}
        />
        <NavItem 
          icon={Bell} 
          label="Alerts" 
          active={activeTab === 'alerts'} 
          onClick={() => setActiveTab('alerts')}
          collapsed={sidebarCollapsed}
        />
        <NavItem 
          icon={Settings} 
          label="Settings" 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')}
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
                <User className="w-4 h-4 text-white" />
              </div>
              {!sidebarCollapsed && user && (
                <div className="text-left">
                  <div className="text-sm font-medium text-white">{user.first_name} {user.last_name}</div>
                  <div className="text-xs text-gray-400">{user.email}</div>
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
                  setActiveTab('settings');
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors rounded-t-lg"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-white">Settings</span>
              </button>
              <button
                onClick={() => console.log("Logout")}
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