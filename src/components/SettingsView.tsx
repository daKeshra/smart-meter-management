import React from 'react';
import { 
  User,
  Settings,
  Bell,
  CheckCircle
} from 'lucide-react';

const SettingsView = ({ user, setUser }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">User Settings</h2>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <User className="w-6 h-6 text-emerald-400" />
          <h3 className="text-xl font-bold text-white">Profile Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
            <input
              type="text"
              value={user?.first_name || ''}
              onChange={(e) => setUser({...user, first_name: e.target.value})}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
            <input
              type="text"
              value={user?.last_name || ''}
              onChange={(e) => setUser({...user, last_name: e.target.value})}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>
        
        <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          Save Profile
        </button>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6">AI Alert Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Critical Alerts</div>
              <div className="text-sm text-gray-400">Immediate notifications for critical issues</div>
            </div>
            <button className="w-12 h-6 bg-emerald-600 rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Device Auto-Detection</div>
              <div className="text-sm text-gray-400">Notify when new devices are detected</div>
            </div>
            <button className="w-12 h-6 bg-emerald-600 rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">AI Confidence Threshold</div>
              <div className="text-sm text-gray-400">Minimum confidence for alert generation</div>
            </div>
            <select className="px-3 py-1 bg-gray-700 text-white rounded border border-gray-600">
              <option value="0.7">70%</option>
              <option value="0.8">80%</option>
              <option value="0.9" selected>90%</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;