// @ts-nocheck
import React from 'react';
import { 
  Bell,
  BellRing,
  AlertTriangle,
  Activity,
  Search,
  Flame,
  AlertCircle,
  CheckCircle,
  User,
  Building2,
  Clock,
  Shield
} from 'lucide-react';
import MetricCard from './MetricCard';

const AlertsView = ({ 
  selectedDCO, 
  setSelectedDCO, 
  DisCos, 
  searchTerm, 
  setSearchTerm, 
  alertFilter, 
  setAlertFilter, 
  alerts, 
  getPriorityColor 
}) => {
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.deviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = alertFilter === 'all' || alert.priority === alertFilter;
    const matchesDCO = alert.dcoId === selectedDCO;
    return matchesSearch && matchesFilter && matchesDCO;
  });

  const criticalAlerts = filteredAlerts.filter(alert => alert.priority === 'critical').length;
  const activeAlerts = filteredAlerts.filter(alert => alert.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">AI-Powered Alert System</h2>
          <p className="text-gray-400 mt-1">Real-time monitoring and intelligent analysis</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedDCO}
            onChange={(e) => setSelectedDCO(e.target.value)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none"
          >
            {DisCos.map(dco => (
              <option key={dco.id} value={dco.id}>{dco.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Alerts"
          value={filteredAlerts.length}
          subtitle="All time"
          icon={Bell}
        />
        <MetricCard
          title="Active Alerts"
          value={activeAlerts}
          subtitle="Requiring attention"
          icon={BellRing}
          color="yellow"
        />
        <MetricCard
          title="Critical Alerts"
          value={criticalAlerts}
          subtitle="Immediate action needed"
          icon={AlertTriangle}
          color="red"
        />
        <MetricCard
          title="AI Accuracy"
          value="94%"
          subtitle="Average confidence"
          icon={Activity}
          color="blue"
        />
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <select
            value={alertFilter}
            onChange={(e) => setAlertFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-400">No alerts found matching your criteria.</p>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <div key={alert.id} className={`p-4 rounded-lg border ${
                alert.priority === 'critical' ? 'bg-red-900/20 border-red-700' : 
                alert.priority === 'high' ? 'bg-orange-900/20 border-orange-700' :
                alert.priority === 'medium' ? 'bg-yellow-900/20 border-yellow-700' :
                'bg-gray-700 border-gray-600'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-full ${
                        alert.priority === 'critical' ? 'bg-red-600' :
                        alert.priority === 'high' ? 'bg-orange-600' :
                        alert.priority === 'medium' ? 'bg-yellow-600' :
                        'bg-blue-600'
                      }`}>
                        {alert.priority === 'critical' ? <Flame className="w-4 h-4 text-white" /> :
                         alert.type === 'info' ? <CheckCircle className="w-4 h-4 text-white" /> :
                         <AlertTriangle className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{alert.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                          <span>Customer: {alert.customerName}</span>
                          <span>Device: {alert.deviceName}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                            {alert.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-900/50 p-3 rounded-lg mb-3">
                      <p className="text-gray-300 text-sm">{alert.message}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">AI Confidence:</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-emerald-500 h-2 rounded-full" 
                              style={{width: `${alert.aiConfidence * 100}%`}}
                            ></div>
                          </div>
                          <span className="text-white">{(alert.aiConfidence * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400">Recommended Action:</span>
                        <p className="text-white mt-1">{alert.recommendedAction}</p>
                      </div>
                    </div>
                    
                    {alert.powerActionTaken && (
                      <div className="mt-3 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Shield className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-300 font-medium">AI Power Control Action</span>
                        </div>
                        <div className="text-sm text-gray-300">
                          <div>Action: <span className="text-white font-medium">{alert.powerAction?.toUpperCase()}</span></div>
                          {alert.powerLimit && (
                            <div>Power Limit: <span className="text-white font-medium">{alert.powerLimit}W</span></div>
                          )}
                          <div>Executed: <span className="text-white font-medium">
                            {new Date(alert.powerActionTime).toLocaleString()}
                          </span></div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">
                        {new Date(alert.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center space-x-1 ${alert.sentToCustomer ? 'text-emerald-400' : 'text-gray-400'}`}>
                        <User className="w-4 h-4" />
                        <span>Customer {alert.sentToCustomer ? '✓' : '✗'}</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${alert.sentToDCO ? 'text-emerald-400' : 'text-gray-400'}`}>
                        <Building2 className="w-4 h-4" />
                        <span>DCO {alert.sentToDCO ? '✓' : '✗'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsView;