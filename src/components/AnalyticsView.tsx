import React from 'react';
import { 
  Activity,
  CheckCircle,
  TrendingUp,
  Wifi,
  Gauge,
  Users
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import MetricCard from './MetricCard';

const AnalyticsView = ({ 
  selectedDCO, 
  setSelectedDCO, 
  DisCos, 
  powerChartData, 
  chartTimeRange, 
  setChartTimeRange, 
  meters, 
  customers, 
  devices 
}) => {
  const selectedDCOData = DisCos.find(dco => dco.id === selectedDCO);
  const dcoMeters = meters.filter(meter => meter.dcoId === selectedDCO);
  const chartData = powerChartData[chartTimeRange] || [];

  // DCO comparison data
  const dcoComparisonData = DisCos.map(dco => {
    const dcoMeterData = meters.filter(m => m.dcoId === dco.id);
    const dcoCustomerData = customers.filter(c => 
      dcoMeterData.some(m => m.id === c.meterId)
    );
    return {
      name: dco.code,
      consumption: dcoCustomerData.reduce((sum, c) => sum + c.currentConsumption, 0),
      customers: dcoCustomerData.length,
      meters: dcoMeterData.length,
      voltage: dcoMeterData.reduce((sum, m) => sum + m.voltage, 0) / dcoMeterData.length || 0
    };
  });

  // Device type distribution
  const dcoCustomers = customers.filter(customer => 
    dcoMeters.some(meter => meter.id === customer.meterId)
  );
  const dcoDevices = devices.filter(device => 
    dcoCustomers.some(customer => customer.id === device.customerId)
  );

  const deviceTypeData = dcoDevices.reduce((acc, device) => {
    const existing = acc.find(item => item.name === device.type);
    if (existing) {
      existing.value += 1;
      existing.power += device.powerConsumption;
    } else {
      acc.push({
        name: device.type,
        value: 1,
        power: device.powerConsumption
      });
    }
    return acc;
  }, []);

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Power Analytics Dashboard</h2>
          <p className="text-gray-400 mt-1">Real-time monitoring and trend analysis</p>
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
          <select
            value={chartTimeRange}
            onChange={(e) => setChartTimeRange(e.target.value)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>
      
      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Peak Demand"
          value={`${Math.max(...chartData.map(d => d.consumption)).toFixed(1)} kW`}
          subtitle="Highest recorded"
          icon={TrendingUp}
          color="red"
        />
        <MetricCard
          title="Load Factor"
          value={`${((chartData.reduce((sum, d) => sum + d.consumption, 0) / chartData.length) / Math.max(...chartData.map(d => d.consumption)) * 100).toFixed(1)}%`}
          subtitle="Efficiency ratio"
          icon={Activity}
          color="blue"
        />
        <MetricCard
          title="Avg Power Factor"
          value={(chartData.reduce((sum, d) => sum + d.powerFactor, 0) / chartData.length).toFixed(2)}
          subtitle="System efficiency"
          icon={Gauge}
        />
        <MetricCard
          title="System Uptime"
          value="99.8%"
          subtitle="Last 30 days"
          icon={CheckCircle}
        />
      </div>

      {/* DCO Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">DCO Power Consumption Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dcoComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend />
              <Bar dataKey="consumption" fill="#10B981" name="Consumption (kW)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Device Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                dataKey="value"
                data={deviceTypeData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({name, value}) => `${name}: ${value}`}
              >
                {deviceTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Power Readings Chart */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Live Power Readings - {selectedDCOData?.name}</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-sm text-gray-400">Current</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
              <span className="text-sm text-gray-400">Consumption</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-sm text-gray-400">Voltage</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <RechartsLineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis yAxisId="left" stroke="#9CA3AF" />
            <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#F3F4F6' }}
            />
            <Legend />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="consumption" 
              stroke="#10B981" 
              strokeWidth={2} 
              name="Consumption (kW)"
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="voltage" 
              stroke="#3B82F6" 
              strokeWidth={2} 
              name="Voltage (V)"
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="current" 
              stroke="#F59E0B" 
              strokeWidth={2} 
              name="Current (A)"
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>

      {/* Power Quality Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Power Factor Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis domain={[0.7, 1.0]} stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Area 
                type="monotone" 
                dataKey="powerFactor" 
                stroke="#8B5CF6" 
                fill="#8B5CF6" 
                fillOpacity={0.3}
                name="Power Factor"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Temperature Monitoring</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Area 
                type="monotone" 
                dataKey="temperature" 
                stroke="#EF4444" 
                fill="#EF4444" 
                fillOpacity={0.3}
                name="Temperature (°C)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;