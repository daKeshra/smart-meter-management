import React from 'react';
import { 
  Activity,
  AlertTriangle,
  Power,
  RefreshCw,
  TrendingUp,
  Users,
  Gauge,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import MetricCard from './MetricCard';

const DashboardView = ({ 
  energyData, 
  loading, 
  selectedDCO, 
  setSelectedDCO, 
  fetchDashboardData, 
  DisCos, 
  alerts, 
  devices, 
  meters, 
  customers 
}) => {
  const selectedDCOData = selectedDCO === 'all' 
    ? { name: 'All DisCos' } 
    : DisCos.find(dco => dco.id === selectedDCO);
  
  const dcoMeters = selectedDCO === 'all' 
    ? meters 
    : meters.filter(meter => meter.dcoId === selectedDCO);
  
  const dcoCustomers = selectedDCO === 'all'
    ? customers
    : customers.filter(customer => 
        dcoMeters.some(meter => meter.id === customer.meterId)
      );
  
  const dcoDevices = selectedDCO === 'all'
    ? devices
    : devices.filter(device => 
        dcoCustomers.some(customer => customer.id === device.customerId)
      );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Energy Dashboard</h2>
          <p className="text-gray-400 mt-1">Monitoring {selectedDCOData?.name || 'All DisCos'}</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedDCO}
            onChange={(e) => setSelectedDCO(e.target.value)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none"
          >
            <option value="all">View All DisCos</option>
            {DisCos.map(dco => (
              <option key={dco.id} value={dco.id}>{dco.name}</option>
            ))}
          </select>
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Consumption"
          value={energyData.currentConsumption}
          subtitle={energyData.lastUpdate}
          icon={Activity}
          trend={true}
        />
        <MetricCard
          title="Average Voltage"
          value={`${energyData.voltage} V`}
          subtitle="Stable"
          icon={Zap}
        />
        <MetricCard
          title="Connected Devices"
          value={energyData.totalDevices}
          subtitle="Active devices"
          icon={Power}
        />
        <MetricCard
          title="Active Alerts"
          value={energyData.activeAlerts}
          subtitle="Require attention"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Meters"
          value={dcoMeters.length}
          subtitle="Active meters"
          icon={Gauge}
        />
        <MetricCard
          title="Total Customers"
          value={dcoCustomers.length}
          subtitle="Connected customers"
          icon={Users}
        />
        <MetricCard
          title="Avg Power Factor"
          value={(dcoMeters.reduce((sum, meter) => sum + meter.powerFactor, 0) / (dcoMeters.length || 1)).toFixed(2)}
          subtitle="System efficiency"
          icon={TrendingUp}
        />
      </div>
  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Recent Device Activity</h3>
          <div className="space-y-3">
            {dcoDevices.slice(0, 5).map(device => (
              <div key={device.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${device.status === 'online' ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                  <div>
                    <div className="text-white font-medium">{device.name}</div>
                    <div className="text-sm text-gray-400">{device.customerName}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{device.powerConsumption}W</div>
                  <div className="text-sm text-gray-400">{device.lastSeen}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Critical Alerts</h3>
          <div className="space-y-3">
            {alerts.filter(alert => 
              (selectedDCO === 'all' || alert.dcoId === selectedDCO) && 
              alert.priority === 'critical'
            ).slice(0, 3).map(alert => (
              <div key={alert.id} className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-white font-medium">{alert.title}</div>
                    <div className="text-sm text-gray-300 mt-1">{alert.customerName} - {alert.deviceName}</div>
                    <div className="text-xs text-red-400 mt-1">AI Confidence: {(alert.aiConfidence * 100).toFixed(0)}%</div>
                  </div>
                </div>
              </div>
            ))}
            {alerts.filter(alert => 
              (selectedDCO === 'all' || alert.dcoId === selectedDCO) && 
              alert.priority === 'critical'
            ).length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <p>No critical alerts at this time</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;