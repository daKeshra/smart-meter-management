import React from 'react';

const NavItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <div className="relative group">
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
        active 
          ? 'bg-emerald-600 text-white' 
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      } ${collapsed ? 'justify-center' : 'space-x-3'}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!collapsed && <span className="font-medium">{label}</span>}
    </button>
    
    {collapsed && (
      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
        {label}
      </div>
    )}
  </div>
);

export default NavItem;