import React, { useState } from 'react';
import { 
  Gauge,
  Wifi,
  Zap,
  Users,
  Plus,
  Search,
  X,
  Save
} from 'lucide-react';

// MetricCard component
const MetricCard = ({ title, value, subtitle, icon: Icon }) => (
  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
      </div>
      <div className="p-3 bg-emerald-600 rounded-full">
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

// Add Meter Modal Component
const AddMeterModal = ({ isOpen, onClose, onAddMeter, DisCos, selectedDCO }) => {
  const [formData, setFormData] = useState({
    serialNumber: '',
    location: '',
    dcoId: selectedDCO,
    customerName: '',
    accountNumber: '',
    voltage: 220,
    current: 10,
    powerFactor: 0.95,
    initialReading: 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.serialNumber || !formData.location || !formData.customerName || !formData.accountNumber) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Generate unique IDs
    const meterId = Date.now().toString();
    const customerId = (Date.now() + 1).toString();
    
    // Create new meter object
    const newMeter = {
      id: meterId,
      serialNumber: formData.serialNumber,
      location: formData.location,
      dcoId: formData.dcoId,
      status: 'online',
      currentReading: parseInt(formData.initialReading),
      voltage: parseInt(formData.voltage),
      current: parseInt(formData.current),
      powerFactor: parseFloat(formData.powerFactor),
      customerCount: 1,
      lastUpdate: new Date().toISOString()
    };

    // Create associated customer
    const newCustomer = {
      id: customerId,
      name: formData.customerName,
      accountNumber: formData.accountNumber,
      meterId: meterId,
      currentConsumption: Math.floor(Math.random() * 5) + 1, // Random initial consumption
      deviceCount: Math.floor(Math.random() * 10) + 1,
      status: 'active'
    };

    onAddMeter(newMeter, newCustomer);
    
    // Reset form
    setFormData({
      serialNumber: '',
      location: '',
      dcoId: selectedDCO,
      customerName: '',
      accountNumber: '',
      voltage: 220,
      current: 10,
      powerFactor: 0.95,
      initialReading: 0
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Add New Meter</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Serial Number *
            </label>
            <input
              type="text"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none"
              placeholder="e.g., MTR-2024-001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none"
              placeholder="e.g., Block A, Unit 12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              DCO *
            </label>
            <select
              name="dcoId"
              value={formData.dcoId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none"
            >
              {DisCos.map(dco => (
                <option key={dco.id} value={dco.id}>{dco.name}</option>
              ))}
            </select>
          </div>

          <div className="border-t border-gray-600 pt-4">
            <h4 className="text-lg font-medium text-white mb-3">Primary Customer Details</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none"
                placeholder="e.g., John Smith"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Account Number *
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none"
                placeholder="e.g., ACC-2024-001"
              />
            </div>
          </div>

          <div className="border-t border-gray-600 pt-4">
            <h4 className="text-lg font-medium text-white mb-3">Technical Specifications</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Voltage (V)
                </label>
                <input
                  type="number"
                  name="voltage"
                  value={formData.voltage}
                  onChange={handleInputChange}
                  min="100"
                  max="300"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Current (A)
                </label>
                <input
                  type="number"
                  name="current"
                  value={formData.current}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Power Factor
                </label>
                <input
                  type="number"
                  name="powerFactor"
                  value={formData.powerFactor}
                  onChange={handleInputChange}
                  min="0.1"
                  max="1.0"
                  step="0.01"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Initial Reading (kWh)
                </label>
                <input
                  type="number"
                  name="initialReading"
                  value={formData.initialReading}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                handleSubmit();
              }}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Add Meter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetersView = () => {
  // Sample data - in a real app, this would come from props or API
  const [DisCos] = useState([
    { id: 'dco1', name: 'Lagos Island DCO' },
    { id: 'dco2', name: 'Victoria Island DCO' },
    { id: 'dco3', name: 'Surulere DCO' }
  ]);

  const [selectedDCO, setSelectedDCO] = useState('dco1');
  const [showAddMeterModal, setShowAddMeterModal] = useState(false);
  
  const [meters, setMeters] = useState([
    {
      id: '1',
      serialNumber: 'MTR-2024-001',
      location: 'Block A, Unit 12',
      dcoId: 'dco1',
      status: 'online',
      currentReading: 1250,
      voltage: 220,
      current: 15,
      powerFactor: 0.95,
      customerCount: 1,
      lastUpdate: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      serialNumber: 'MTR-2024-002',
      location: 'Block B, Unit 8',
      dcoId: 'dco1',
      status: 'maintenance',
      currentReading: 980,
      voltage: 218,
      current: 12,
      powerFactor: 0.92,
      customerCount: 1,
      lastUpdate: '2024-01-15T09:15:00Z'
    }
  ]);

  const [customers, setCustomers] = useState([
    {
      id: '1',
      name: 'Adebayo Johnson',
      accountNumber: 'ACC-2024-001',
      meterId: '1',
      currentConsumption: 3.2,
      deviceCount: 8,
      status: 'active'
    },
    {
      id: '2',
      name: 'Fatima Ahmed',
      accountNumber: 'ACC-2024-002',
      meterId: '2',
      currentConsumption: 2.8,
      deviceCount: 6,
      status: 'active'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-600 text-white';
      case 'maintenance':
        return 'bg-yellow-600 text-white';
      case 'offline':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const handleAddMeter = (newMeter, newCustomer) => {
    setMeters(prev => [...prev, newMeter]);
    setCustomers(prev => [...prev, newCustomer]);
  };

  const dcoMeters = meters.filter(meter => meter.dcoId === selectedDCO);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Smart Meter Management</h2>
            <p className="text-gray-400 mt-1">Monitor meter readings and performance</p>
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
            <button 
              onClick={() => setShowAddMeterModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Meter</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Total Meters"
            value={dcoMeters.length}
            subtitle="Under this DCO"
            icon={Gauge}
          />
          <MetricCard
            title="Online Meters"
            value={dcoMeters.filter(m => m.status === 'online').length}
            subtitle="Currently active"
            icon={Wifi}
          />
          <MetricCard
            title="Avg Voltage"
            value={`${Math.round(dcoMeters.reduce((sum, m) => sum + m.voltage, 0) / dcoMeters.length) || 0}V`}
            subtitle="System average"
            icon={Zap}
          />
          <MetricCard
            title="Total Customers"
            value={dcoMeters.reduce((sum, m) => sum + m.customerCount, 0)}
            subtitle="Connected"
            icon={Users}
          />
        </div>

        <div className="space-y-4">
          {dcoMeters.map(meter => {
            const meterCustomers = customers.filter(customer => customer.meterId === meter.id);
            
            return (
              <div key={meter.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-full ${meter.status === 'online' ? 'bg-emerald-600' : meter.status === 'maintenance' ? 'bg-yellow-600' : 'bg-red-600'}`}>
                      <Gauge className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{meter.serialNumber}</h3>
                      <div className="text-gray-400">{meter.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(meter.status)}`}>
                      {meter.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-emerald-400">{meter.currentReading}</div>
                    <div className="text-sm text-gray-400">kWh Reading</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-400">{meter.voltage}V</div>
                    <div className="text-sm text-gray-400">Voltage</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-400">{meter.current}A</div>
                    <div className="text-sm text-gray-400">Current</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-400">{meter.powerFactor}</div>
                    <div className="text-sm text-gray-400">Power Factor</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-400">{meter.customerCount}</div>
                    <div className="text-sm text-gray-400">Customers</div>
                  </div>
                </div>

                <div className="border-t border-gray-600 pt-4">
                  <h4 className="text-white font-medium mb-3">Connected Customers</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {meterCustomers.map(customer => (
                      <div key={customer.id} className="bg-gray-700 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white font-medium">{customer.name}</div>
                            <div className="text-sm text-gray-400">{customer.accountNumber}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-emerald-400 font-medium">{customer.currentConsumption} kW</div>
                            <div className="text-xs text-gray-400">{customer.deviceCount} devices</div>
                          </div>
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

      <AddMeterModal
        isOpen={showAddMeterModal}
        onClose={() => setShowAddMeterModal(false)}
        onAddMeter={handleAddMeter}
        DisCos={DisCos}
        selectedDCO={selectedDCO}
      />
    </div>
  );
};

export default MetersView;
