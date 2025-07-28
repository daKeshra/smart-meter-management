import React from 'react';
import { 
  Monitor,
  Activity,
  Wifi,
  Power,
  Search,
  WifiOff,
  Settings,
  Eye,
  Edit,
  Zap,
  Activity as CurrentIcon,
  Thermometer
} from 'lucide-react';
import MetricCard from './MetricCard';

const DevicesView = ({ 
  selectedDCO, 
  setSelectedDCO, 
  DisCos, 
  searchTerm, 
  setSearchTerm, 
  deviceFilter, 
  setDeviceFilter, 
  meters, 
  customers, 
  devices, 
  getStatusColor, 
  getStatusIcon 
}) => {
  const dcoCustomers = customers.filter(customer => 
    meters.filter(meter => meter.dcoId === selectedDCO).some(meter => meter.id === customer.meterId)
  );
  const dcoDevices = devices.filter(device => 
    dcoCustomers.some(customer => customer.id === device.customerId)
  );

  const filteredDevices = dcoDevices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = deviceFilter === 'all' || device.status === deviceFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Device Management</h2>
          <p className="text-gray-400 mt-1">Auto-detected and monitored devices</p>
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Devices"
          value={filteredDevices.length}
          subtitle="All registered devices"
          icon={Monitor}
        />
        <MetricCard
          title="Auto-Detected"
          value={filteredDevices.filter(d => d.autoDetected).length}
          subtitle="AI identified"
          icon={Activity}
          color="blue"
        />
        <MetricCard
          title="Online Devices"
          value={filteredDevices.filter(d => d.status === 'online').length}
          subtitle="Currently active"
          icon={Wifi}
        />
        <MetricCard
          title="Total Power"
          value={`${(filteredDevices.reduce((sum, d) => sum + d.powerConsumption, 0) / 1000).toFixed(1)} kW`}
          subtitle="Combined consumption"
          icon={Power}
        />
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <select
            value={deviceFilter}
            onChange={(e) => setDeviceFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredDevices.map(device => (
            <div key={device.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{device.name}</h3>
                    {device.autoDetected && (
                      <span className="px-2 py-1 bg-blue-600 text-blue-100 rounded-full text-xs font-medium">
                        AUTO-DETECTED
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(device.status)}`}>
                      {getStatusIcon(device.status)}
                      <span>{device.status}</span>
                    </span>
                    <span className="px-2 py-1 bg-purple-600 text-purple-100 rounded-full text-xs">
                      {device.type}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-300 mb-2">
                    <div>
                      <span className="text-gray-400">Customer:</span> {device.customerName}
                    </div>
                    <div>
                      <span className="text-gray-400">Power:</span> {device.powerConsumption}W
                    </div>
                    <div>
                      <span className="text-gray-400">Temperature:</span> {device.temperature}°C
                    </div>
                    <div>
                      <span className="text-gray-400">Last Seen:</span> {device.lastSeen}
                    </div>
                  </div>
                  {device.autoDetected && (
                    <div className="text-xs text-blue-400 mt-2">
                      <span className="text-gray-400">Auto-detected:</span> {new Date(device.detectedAt).toLocaleString()} | 
                      <span className="text-gray-400"> Signature:</span> {device.deviceSignature}
                    </div>
                  )}
                  {device.status === 'online' && (
                    <div className="flex space-x-6 text-sm mt-2">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-300">{device.voltage}V</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CurrentIcon className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-300">{device.current}A</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Thermometer className="w-4 h-4 text-red-400" />
                        <span className="text-gray-300">{device.temperature}°C</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DevicesView;