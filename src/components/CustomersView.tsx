import React from 'react';
import { 
  Users,
  Activity,
  Power,
  FileText,
  Search,
  User,
  Eye,
  Shield,
  Thermometer,
  Zap,
  Activity as CurrentIcon
} from 'lucide-react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import MetricCard from './MetricCard';

const CustomersView = ({ 
  selectedDCO, 
  setSelectedDCO, 
  DisCos, 
  searchTerm, 
  setSearchTerm, 
  meters, 
  customers, 
  devices, 
  selectedCustomer, 
  setSelectedCustomer, 
  chartTimeRange, 
  setChartTimeRange, 
  powerChartData, 
  setPowerControlDevice, 
  setShowPowerControlModal 
}) => {
  const dcoCustomers = customers.filter(customer => 
    meters.filter(meter => meter.dcoId === selectedDCO).some(meter => meter.id === customer.meterId)
  );

  const filteredCustomers = dcoCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.accountNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const CustomerDetailModal = ({ customer, onClose }) => {
    if (!customer) return null;

    const customerDevices = devices.filter(device => device.customerId === customer.id);
    const customerChartData = powerChartData[chartTimeRange] || [];
    
    // Generate customer-specific data
    const customerSpecificData = customerChartData.map(item => ({
      ...item,
      consumption: item.consumption * (customer.currentConsumption / 10) // Scale based on customer usage
    }));

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8 text-emerald-400" />
              <div>
                <h3 className="text-2xl font-bold text-white">{customer.name}</h3>
                <p className="text-gray-400">{customer.accountNumber}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Customer Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <MetricCard
              title="Current Usage"
              value={`${customer.currentConsumption} kW`}
              subtitle="Real-time consumption"
              icon={Activity}
            />
            <MetricCard
              title="Connected Devices"
              value={customerDevices.length}
              subtitle={`${customerDevices.filter(d => d.status === 'online').length} online`}
              icon={Power}
            />
            <MetricCard
              title="Last Bill"
              value={`₦${customer.lastBillAmount.toLocaleString()}`}
              subtitle="Monthly charge"
              icon={FileText}
              color="blue"
            />
          </div>

          {/* Power Usage Chart */}
          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-white">Power Usage Analysis</h4>
              <select
                value={chartTimeRange}
                onChange={(e) => setChartTimeRange(e.target.value)}
                className="px-3 py-1 bg-gray-600 text-white rounded border border-gray-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={customerSpecificData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="consumption" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.3}
                  name="Power Usage (kW)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Device List with Controls */}
          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
            <h4 className="text-xl font-bold text-white mb-4">Connected Devices</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customerDevices.map(device => (
                <div key={device.id} className={`p-4 rounded-lg border ${
                  device.status === 'online' ? 'bg-emerald-900/20 border-emerald-700' : 'bg-red-900/20 border-red-700'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${device.status === 'online' ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                      <span className="text-white font-medium">{device.name}</span>
                      {device.autoDetected && (
                        <span className="px-1 py-0.5 bg-blue-600 text-blue-100 rounded text-xs">AUTO</span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setPowerControlDevice(device);
                        setShowPowerControlModal(true);
                      }}
                      className="p-1 text-gray-400 hover:text-emerald-400 hover:bg-gray-600 rounded"
                    >
                      <Shield className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-gray-400">Power</div>
                      <div className="text-white font-medium">{device.powerConsumption}W</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Temperature</div>
                      <div className={`font-medium ${
                        device.temperature > 50 ? 'text-red-400' : 
                        device.temperature > 40 ? 'text-yellow-400' : 'text-emerald-400'
                      }`}>{device.temperature}°C</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Voltage</div>
                      <div className="text-white font-medium">{device.voltage}V</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Last Seen</div>
                      <div className="text-white font-medium">{device.lastSeen}</div>
                    </div>
                  </div>

                  {device.status === 'online' && device.temperature > 50 && (
                    <div className="mt-3 p-2 bg-red-900/30 border border-red-700 rounded flex items-center space-x-2">
                      <Thermometer className="w-4 h-4 text-red-400" />
                      <span className="text-red-300 text-xs">High temperature detected</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Customer Management</h2>
          <p className="text-gray-400 mt-1">Monitor customer devices and consumption</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Customers"
          value={filteredCustomers.length}
          subtitle="Active connections"
          icon={Users}
        />
        <MetricCard
          title="Avg Consumption"
          value={`${(filteredCustomers.reduce((sum, c) => sum + c.currentConsumption, 0) / filteredCustomers.length || 0).toFixed(1)} kW`}
          subtitle="Per customer"
          icon={Activity}
        />
        <MetricCard
          title="Auto-Detected Devices"
          value={devices.filter(d => filteredCustomers.some(c => c.id === d.customerId) && d.autoDetected).length}
          subtitle="This month"
          icon={Power}
          color="blue"
        />
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredCustomers.map(customer => {
            const customerDevices = devices.filter(device => device.customerId === customer.id);
            const onlineDevices = customerDevices.filter(device => device.status === 'online');
            
            return (
              <div key={customer.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{customer.name}</h3>
                      <div className="text-sm text-gray-400">{customer.accountNumber}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-400">{customer.currentConsumption} kW</div>
                      <div className="text-sm text-gray-400">Current usage</div>
                    </div>
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-400">Contact:</span>
                    <div className="text-white">{customer.email}</div>
                    <div className="text-white">{customer.phone}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Address:</span>
                    <div className="text-white">{customer.address}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Devices:</span>
                    <div className="text-white">{onlineDevices.length}/{customerDevices.length} online</div>
                  </div>
                </div>

                <div className="border-t border-gray-600 pt-4">
                  <h4 className="text-white font-medium mb-3">Recent Device Activity</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {customerDevices.slice(0, 3).map(device => (
                      <div key={device.id} className={`p-2 rounded border text-xs ${
                        device.status === 'online' ? 'bg-emerald-900/20 border-emerald-700' : 'bg-red-900/20 border-red-700'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium truncate">{device.name}</span>
                          <span className="text-gray-400">{device.powerConsumption}W</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedCustomer && (
        <CustomerDetailModal 
          customer={selectedCustomer} 
          onClose={() => setSelectedCustomer(null)} 
        />
      )}
    </div>
  );
};

export default CustomersView;