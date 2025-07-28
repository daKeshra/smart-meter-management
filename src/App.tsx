import { useState, useEffect } from 'react';
import { 
    Settings, 
  Monitor, 
  Wifi,
  WifiOff,
  Zap as ZapOff,
} from 'lucide-react';
// import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import DisCosView from './components/DisCOsView';
import MetersView from './components/MetersView';
import AnalyticsView from './components/AnalyticsView';
import CustomersView from './components/CustomersView';
import DevicesView from './components/DevicesView';
import AlertsView from './components/AlertsView';
import SettingsView from './components/SettingsView';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDCO, setSelectedDCO] = useState('1');
  const [energyData, setEnergyData] = useState({
    currentConsumption: 'N/A',
    voltage: 230,
    current: 12.5,
    power: 2.8,
    totalDevices: 0,
    activeAlerts: 0,
    lastUpdate: '4% from last hour'
  });

  
  type DCO = {
    id: string;
    name: string;
    code: string;
    email: string;
    phone: string;
    address: string;
    region: string;
    registrationDate: string;
    status: string;
    meterCount: number;
    customerCount: number;
  };
  const [DisCos, setDisCos] = useState<DCO[]>([]);
  type Meter = {
    id: string;
    serialNumber: string;
    dcoId: string;
    dcoName: string;
    location: string;
    type: string;
    status: string;
    installDate: string;
    lastReading: string;
    currentReading: number;
    voltage: number;
    current: number;
    powerFactor: number;
    customerCount: number;
  };
  const [meters, setMeters] = useState<Meter[]>([]);
  type Customer = {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    meterId: string;
    meterSerial: string;
    accountNumber: string;
    connectionDate: string;
    tariffClass: string;
    status: string;
    deviceCount: number;
    lastBillAmount: number;
    currentConsumption: number;
  };
  const [customers, setCustomers] = useState<Customer[]>([]);
  type Device = {
    id: string;
    name: string;
    type: string;
    customerId: string;
    customerName: string;
    meterId: string;
    status: string;
    powerConsumption: number;
    voltage: number;
    current: number;
    temperature: number;
    lastSeen: string;
    autoDetected: boolean;
    detectedAt: string;
    deviceSignature: string;
  };
  const [devices, setDevices] = useState<Device[]>([]);
  type Alert = {
    id: string;
    type: string;
    title: string;
    message: string;
    customerId: string;
    customerName: string;
    deviceId: string;
    deviceName: string;
    meterId: string;
    dcoId: string;
    priority: string;
    status: string;
    createdAt: string;
    aiConfidence: number;
    recommendedAction: string;
    sentToCustomer: boolean;
    sentToDCO: boolean;
    powerAction?: string;
    powerActionTaken?: boolean;
    powerLimit?: number;
    powerActionTime?: string;
  };

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAddDCOModal, setShowAddDCOModal] = useState(false);
  const [showAddMeterModal, setShowAddMeterModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [alertFilter, setAlertFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [chartTimeRange, setChartTimeRange] = useState('24h');
  const [powerChartData, setPowerChartData] = useState([]);
  const [showPowerControlModal, setShowPowerControlModal] = useState(false);
  const [powerControlDevice, setPowerControlDevice] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    // Mock DisCos (Distribution Companies) data
    setDisCos([
      {
        id: '1',
        name: 'Lagos Electric Distribution Company',
        code: 'LEDCO',
        email: 'contact@ledco.ng',
        phone: '+234-901-234-5678',
        address: '123 Victoria Island, Lagos',
        region: 'Lagos State',
        registrationDate: '2024-01-15',
        status: 'active',
        meterCount: 3,
        customerCount: 5
      },
      {
        id: '2',
        name: 'Abuja Electricity Distribution Company',
        code: 'AEDC',
        email: 'info@aedc.ng',
        phone: '+234-803-567-8901',
        address: '45 Central Area, Abuja',
        region: 'FCT Abuja',
        registrationDate: '2024-02-20',
        status: 'active',
        meterCount: 2,
        customerCount: 3
      },
      {
        id: '3',
        name: 'Port Harcourt Electricity Distribution Company',
        code: 'PHEDC',
        email: 'support@phedc.ng',
        phone: '+234-704-123-4567',
        address: '78 Trans Amadi, Port Harcourt',
        region: 'Rivers State',
        registrationDate: '2024-03-10',
        status: 'active',
        meterCount: 1,
        customerCount: 2
      }
    ]);

    // Mock meters data
    setMeters([
      {
        id: '1',
        serialNumber: 'LEDCO-001-2024',
        dcoId: '1',
        dcoName: 'Lagos Electric Distribution Company',
        location: 'Victoria Island Commercial District',
        type: 'Three Phase Smart Meter',
        status: 'online',
        installDate: '2024-01-20',
        lastReading: '2024-07-25T14:30:00',
        currentReading: 1547.8,
        voltage: 231,
        current: 15.2,
        powerFactor: 0.95,
        customerCount: 2
      },
      {
        id: '2',
        serialNumber: 'LEDCO-002-2024',
        dcoId: '1',
        dcoName: 'Lagos Electric Distribution Company',
        location: 'Ikoyi Residential Area',
        type: 'Single Phase Smart Meter',
        status: 'online',
        installDate: '2024-02-15',
        lastReading: '2024-07-25T14:28:00',
        currentReading: 892.3,
        voltage: 228,
        current: 8.7,
        powerFactor: 0.92,
        customerCount: 1
      },
      {
        id: '3',
        serialNumber: 'LEDCO-003-2024',
        dcoId: '1',
        dcoName: 'Lagos Electric Distribution Company',
        location: 'Lekki Phase 1',
        type: 'Three Phase Smart Meter',
        status: 'maintenance',
        installDate: '2024-03-01',
        lastReading: '2024-07-25T12:15:00',
        currentReading: 2341.7,
        voltage: 0,
        current: 0,
        powerFactor: 0,
        customerCount: 2
      },
      {
        id: '4',
        serialNumber: 'AEDC-001-2024',
        dcoId: '2',
        dcoName: 'Abuja Electricity Distribution Company',
        location: 'Maitama District',
        type: 'Three Phase Smart Meter',
        status: 'online',
        installDate: '2024-02-25',
        lastReading: '2024-07-25T14:32:00',
        currentReading: 1876.4,
        voltage: 234,
        current: 12.8,
        powerFactor: 0.94,
        customerCount: 2
      }
    ]);

    // Mock customers data
    setCustomers([
      {
        id: '1',
        name: 'John Adebayo',
        email: 'john.adebayo@email.com',
        phone: '+234-805-123-4567',
        address: '12 Adeola Street, Victoria Island, Lagos',
        meterId: '1',
        meterSerial: 'LEDCO-001-2024',
        accountNumber: 'LEDCO/VI/001',
        connectionDate: '2024-01-25',
        tariffClass: 'Residential',
        status: 'active',
        deviceCount: 8,
        lastBillAmount: 15420,
        currentConsumption: 4.2
      },
      {
        id: '2',
        name: 'Sarah Okafor',
        email: 'sarah.okafor@email.com',
        phone: '+234-806-234-5678',
        address: '34 Tiamiyu Savage Street, Victoria Island, Lagos',
        meterId: '1',
        meterSerial: 'LEDCO-001-2024',
        accountNumber: 'LEDCO/VI/002',
        connectionDate: '2024-02-10',
        tariffClass: 'Commercial',
        status: 'active',
        deviceCount: 12,
        lastBillAmount: 23680,
        currentConsumption: 6.8
      },
      {
        id: '3',
        name: 'Mohammed Ibrahim',
        email: 'mohammed.ibrahim@email.com',
        phone: '+234-807-345-6789',
        address: '78 Bourdillon Road, Ikoyi, Lagos',
        meterId: '2',
        meterSerial: 'LEDCO-002-2024',
        accountNumber: 'LEDCO/IK/001',
        connectionDate: '2024-02-20',
        tariffClass: 'Residential',
        status: 'active',
        deviceCount: 6,
        lastBillAmount: 12340,
        currentConsumption: 3.1
      }
    ]);

    // Mock devices data with automatic detection simulation
    setDevices([
      // Customer 1 devices
      {
        id: '1',
        name: 'Samsung 65" Smart TV',
        type: 'Entertainment',
        customerId: '1',
        customerName: 'John Adebayo',
        meterId: '1',
        status: 'online',
        powerConsumption: 150,
        voltage: 231,
        current: 0.65,
        temperature: 42,
        lastSeen: '1 minute ago',
        autoDetected: true,
        detectedAt: '2024-07-25T10:30:00',
        deviceSignature: 'TV_SAMSUNG_65'
      },
      {
        id: '2',
        name: 'LG Double Door Refrigerator',
        type: 'Appliance',
        customerId: '1',
        customerName: 'John Adebayo',
        meterId: '1',
        status: 'online',
        powerConsumption: 320,
        voltage: 230,
        current: 1.39,
        temperature: 3,
        lastSeen: '30 seconds ago',
        autoDetected: true,
        detectedAt: '2024-01-25T14:20:00',
        deviceSignature: 'FRIDGE_LG_450L'
      },
      {
        id: '3',
        name: 'Panasonic Air Conditioner',
        type: 'HVAC',
        customerId: '1',
        customerName: 'John Adebayo',
        meterId: '1',
        status: 'online',
        powerConsumption: 1200,
        voltage: 232,
        current: 5.17,
        temperature: 68,
        lastSeen: '2 minutes ago',
        autoDetected: true,
        detectedAt: '2024-03-15T16:45:00',
        deviceSignature: 'AC_PANASONIC_1.5HP'
      },
      {
        id: '4',
        name: 'Haier Thermocool Washing Machine',
        type: 'Appliance',
        customerId: '1',
        customerName: 'John Adebayo',
        meterId: '1',
        status: 'offline',
        powerConsumption: 0,
        voltage: 0,
        current: 0,
        temperature: 25,
        lastSeen: '2 hours ago',
        autoDetected: true,
        detectedAt: '2024-04-20T11:30:00',
        deviceSignature: 'WASHER_HAIER_8KG'
      },
      // Customer 2 devices
      {
        id: '5',
        name: 'Dell OptiPlex Desktop',
        type: 'Computer',
        customerId: '2',
        customerName: 'Sarah Okafor',
        meterId: '1',
        status: 'online',
        powerConsumption: 85,
        voltage: 231,
        current: 0.37,
        temperature: 45,
        lastSeen: '45 seconds ago',
        autoDetected: true,
        detectedAt: '2024-02-12T09:15:00',
        deviceSignature: 'PC_DELL_OPTIPLEX'
      },
      {
        id: '6',
        name: 'Midea Microwave Oven',
        type: 'Appliance',
        customerId: '2',
        customerName: 'Sarah Okafor',
        meterId: '1',
        status: 'online',
        powerConsumption: 800,
        voltage: 229,
        current: 3.49,
        temperature: 55,
        lastSeen: '15 minutes ago',
        autoDetected: true,
        detectedAt: '2024-07-20T13:22:00',
        deviceSignature: 'MICROWAVE_MIDEA_25L'
      }
    ]);

    // Mock AI-generated alerts with power control actions
    setAlerts([
      {
        id: '1',
        type: 'critical',
        title: 'Critical Overheating - Auto Shutdown Initiated',
        message: 'AI Analysis: Panasonic Air Conditioner at John Adebayo\'s residence reached dangerous temperature of 68°C. IMMEDIATE AUTO-SHUTDOWN executed to prevent fire hazard. Customer and emergency services notified.',
        customerId: '1',
        customerName: 'John Adebayo',
        deviceId: '3',
        deviceName: 'Panasonic Air Conditioner',
        meterId: '1',
        dcoId: '1',
        priority: 'critical',
        status: 'active',
        createdAt: '2024-07-25T14:25:00',
        aiConfidence: 0.94,
        recommendedAction: 'Device auto-shutdown completed. Professional inspection required before restart.',
        sentToCustomer: true,
        sentToDCO: true,
        powerAction: 'shutdown',
        powerActionTaken: true,
        powerActionTime: '2024-07-25T14:25:30'
      },
      {
        id: '2',
        type: 'warning',
        title: 'Power Consumption Limit Applied',
        message: 'AI Analysis: LG Refrigerator showing 23% overconsumption. Power limit of 250W applied automatically to prevent damage. Efficiency monitoring active.',
        customerId: '1',
        customerName: 'John Adebayo',
        deviceId: '2',
        deviceName: 'LG Double Door Refrigerator',
        meterId: '1',
        dcoId: '1',
        priority: 'medium',
        status: 'active',
        createdAt: '2024-07-25T12:15:00',
        aiConfidence: 0.78,
        recommendedAction: 'Power limited to safe levels. Schedule maintenance within 7 days.',
        sentToCustomer: true,
        sentToDCO: true,
        powerAction: 'limit',
        powerActionTaken: true,
        powerLimit: 250,
        powerActionTime: '2024-07-25T12:16:00'
      },
      {
        id: '3',
        type: 'info',
        title: 'New Device Auto-Detected and Configured',
        message: 'AI Analysis: New microwave oven detected at Sarah Okafor\'s location. Device signature matches Midea 25L model. Optimal power profile applied automatically.',
        customerId: '2',
        customerName: 'Sarah Okafor',
        deviceId: '6',
        deviceName: 'Midea Microwave Oven',
        meterId: '1',
        dcoId: '1',
        priority: 'low',
        status: 'resolved',
        createdAt: '2024-07-20T13:22:00',
        aiConfidence: 0.91,
        recommendedAction: 'Device configured with safety parameters. Normal operation approved.',
        sentToCustomer: true,
        sentToDCO: false,
        powerAction: 'configure',
        powerActionTaken: true,
        powerActionTime: '2024-07-20T13:23:00'
      },
      {
        id: '4',
        type: 'warning',
        title: 'Device Connection Restored - Power Monitoring Active',
        message: 'AI Analysis: Washing machine reconnected after 2-hour outage. Power restored with enhanced monitoring. Startup sequence completed successfully.',
        customerId: '1',
        customerName: 'John Adebayo',
        deviceId: '4',
        deviceName: 'Haier Thermocool Washing Machine',
        meterId: '1',
        dcoId: '1',
        priority: 'medium',
        status: 'resolved',
        createdAt: '2024-07-25T12:30:00',
        aiConfidence: 0.82,
        recommendedAction: 'Power restored. Enhanced monitoring active for 24 hours.',
        sentToCustomer: true,
        sentToDCO: true,
        powerAction: 'restore',
        powerActionTaken: true,
        powerActionTime: '2024-07-25T14:15:00'
      }
    ]);

    // Generate mock chart data for power consumption
    const generateChartData = () => {
      const now = new Date();
      const data24h = [];
      const data7d = [];
      const data30d = [];

      // 24 hours data (hourly)
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        data24h.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          timestamp: time,
          consumption: 8 + Math.random() * 6 + Math.sin(i * 0.5) * 2,
          voltage: 228 + Math.random() * 8,
          current: 10 + Math.random() * 8,
          powerFactor: 0.85 + Math.random() * 0.15,
          temperature: 25 + Math.random() * 15
        });
      }

      // 7 days data (daily averages)
      for (let i = 6; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        data7d.push({
          time: time.toLocaleDateString('en-US', { weekday: 'short' }),
          timestamp: time,
          consumption: 180 + Math.random() * 80 + Math.sin(i * 0.8) * 20,
          voltage: 230 + Math.random() * 6,
          current: 12 + Math.random() * 6,
          powerFactor: 0.88 + Math.random() * 0.1,
          temperature: 28 + Math.random() * 10
        });
      }

      // 30 days data (daily averages)
      for (let i = 29; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        data30d.push({
          time: time.getDate().toString(),
          timestamp: time,
          consumption: 200 + Math.random() * 100 + Math.sin(i * 0.3) * 30,
          voltage: 230 + Math.random() * 8,
          current: 14 + Math.random() * 8,
          powerFactor: 0.87 + Math.random() * 0.12,
          temperature: 30 + Math.random() * 12
        });
      }

      setPowerChartData({
        '24h': data24h,
        '7d': data7d,
        '30d': data30d
      });
    };

    generateChartData();

    // Mock user data
    setUser({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      role: 'admin'
    });

    // Update energy data with actual device counts
    setEnergyData(prev => ({
      ...prev,
      totalDevices: 6,
      activeAlerts: 3
    }));
  }, []);

  interface PowerControlAction {
    deviceId: string;
    action: 'shutdown' | 'limit' | 'restore';
    value?: number; // Optional value for limit action
  }

  // const handlePowerControl = async ({deviceId, action, value = null}:PowerControlAction) => {
  //   try {
  //     // Simulate AI power control action
  //     const device = devices.find(d => d.id === deviceId);
  //     if (!device) return;

  //     let updatedDevice = { ...device };
  //     let alertMessage = '';

  //     switch (action) {
  //       case 'shutdown':
  //         updatedDevice.status = 'offline';
  //         updatedDevice.powerConsumption = 0;
  //         updatedDevice.voltage = 0;
  //         updatedDevice.current = 0;
  //         alertMessage = `AI Emergency Shutdown: ${device.name} has been automatically shut down due to critical safety concerns.`;
  //         break;
  //       case 'limit':
  //         updatedDevice.powerConsumption = Math.min(device.powerConsumption, value);
  //         alertMessage = `AI Power Limit Applied: ${device.name} power consumption limited to ${value}W for safety.`;
  //         break;
  //       case 'restore':
  //         updatedDevice.status = 'online';
  //         updatedDevice.powerConsumption = device.powerConsumption || 100;
  //         updatedDevice.voltage = 230;
  //         updatedDevice.current = updatedDevice.powerConsumption / updatedDevice.voltage;
  //         alertMessage = `AI Power Restored: ${device.name} power has been restored with enhanced monitoring.`;
  //         break;
  //     }

  //     // Update device in state
  //     setDevices(prev => prev.map(d => d.id === deviceId ? updatedDevice : d));

  //     // Create new alert for the action
  //     const newAlert = {
  //       id: Date.now().toString(),
  //       type: action === 'shutdown' ? 'critical' : 'warning',
  //       title: `AI Power Control Action: ${action.toUpperCase()}`,
  //       message: alertMessage,
  //       customerId: device.customerId,
  //       customerName: device.customerName,
  //       deviceId: deviceId,
  //       deviceName: device.name,
  //       meterId: device.meterId,
  //       dcoId: selectedDCO,
  //       priority: action === 'shutdown' ? 'critical' : 'medium',
  //       status: 'active',
  //       createdAt: new Date().toISOString(),
  //       aiConfidence: 0.95,
  //       recommendedAction: `Power control action executed automatically by AI system.`,
  //       sentToCustomer: true,
  //       sentToDCO: true,
  //       powerAction: action,
  //       powerActionTaken: true,
  //       powerLimit: value,
  //       powerActionTime: new Date().toISOString()
  //     };

  //     setAlerts(prev => [newAlert, ...prev]);
  //     setShowPowerControlModal(false);
  //     setPowerControlDevice(null);

  //   } catch (error) {
  //     console.error('Error executing power control:', error);
  //   }
  // };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const selectedDCOData = DisCos.find(dco => dco.id === selectedDCO);
        const dcoMeters = meters.filter(meter => meter.dcoId === selectedDCO);
        const dcoCustomers = customers.filter(customer => 
          dcoMeters.some(meter => meter.id === customer.meterId)
        );
        const dcoDevices = devices.filter(device => 
          dcoCustomers.some(customer => customer.id === device.customerId)
        );
        const dcoAlerts = alerts.filter(alert => alert.dcoId === selectedDCO && alert.status === 'active');
        
        setEnergyData({
          currentConsumption: dcoCustomers.reduce((sum, customer) => sum + customer.currentConsumption, 0).toFixed(1) + ' kW',
          voltage: Math.round(dcoMeters.reduce((sum, meter) => sum + meter.voltage, 0) / dcoMeters.length) || 0,
          current: (dcoMeters.reduce((sum, meter) => sum + meter.current, 0) / dcoMeters.length).toFixed(1) || 0,
          power: (dcoDevices.reduce((sum, device) => sum + device.powerConsumption, 0) / 1000).toFixed(1),
          totalDevices: dcoDevices.length,
          activeAlerts: dcoAlerts.length,
          lastUpdate: '2% from last hour'
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    const handleClickOutside = (event:any) => {
      if (showUserMenu && !event.target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu, selectedDCO]);

  useEffect(() => {
    if (sidebarCollapsed) {
      setShowUserMenu(false);
    }
  }, [sidebarCollapsed]);

  const getStatusColor = (status:any) => {
    switch (status) {
      case 'online':
      case 'active':
        return 'text-emerald-400 bg-emerald-400/10';
      case 'offline':
      case 'inactive':
        return 'text-red-400 bg-red-400/10';
      case 'maintenance':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'resolved':
        return 'text-blue-400 bg-blue-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getPriorityColor = (priority:any) => {
    switch (priority) {
      case 'critical':
        return 'text-red-400 bg-red-400/10';
      case 'high':
        return 'text-orange-400 bg-orange-400/10';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'low':
        return 'text-green-400 bg-green-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status:any) => {
    switch (status) {
      case 'online':
        return <Wifi className="w-4 h-4" />;
      case 'offline':
        return <WifiOff className="w-4 h-4" />;
      case 'maintenance':
        return <Settings className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView 
          energyData={energyData} 
          loading={loading} 
          selectedDCO={selectedDCO} 
          setSelectedDCO={setSelectedDCO} 
          fetchDashboardData={fetchDashboardData} 
          DisCos={DisCos} 
          alerts={alerts} 
          devices={devices} 
          meters={meters} 
          customers={customers} 
        />;
      case 'DisCos':
        return <DisCosView 
          DisCos={DisCos} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          setShowAddDCOModal={setShowAddDCOModal} 
          setSelectedDCO={setSelectedDCO} 
          getStatusColor={getStatusColor} 
        />;
      case 'meters':
        return <MetersView 
          selectedDCO={selectedDCO} 
          setSelectedDCO={setSelectedDCO} 
          DisCos={DisCos} 
          meters={meters} 
          customers={customers} 
          setShowAddMeterModal={setShowAddMeterModal} 
          getStatusColor={getStatusColor} 
        />;
      case 'analytics':
        return <AnalyticsView 
          selectedDCO={selectedDCO} 
          setSelectedDCO={setSelectedDCO} 
          DisCos={DisCos} 
          powerChartData={powerChartData} 
          chartTimeRange={chartTimeRange} 
          setChartTimeRange={setChartTimeRange} 
          meters={meters} 
          customers={customers} 
          devices={devices} 
        />;
      case 'customers':
        return <CustomersView 
          selectedDCO={selectedDCO} 
          setSelectedDCO={setSelectedDCO} 
          DisCos={DisCos} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          meters={meters} 
          customers={customers} 
          devices={devices} 
          selectedCustomer={selectedCustomer} 
          setSelectedCustomer={setSelectedCustomer} 
          chartTimeRange={chartTimeRange} 
          setChartTimeRange={setChartTimeRange} 
          powerChartData={powerChartData} 
          setPowerControlDevice={setPowerControlDevice} 
          setShowPowerControlModal={setShowPowerControlModal} 
        />;
      case 'devices':
        return <DevicesView 
          selectedDCO={selectedDCO} 
          setSelectedDCO={setSelectedDCO} 
          DisCos={DisCos} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          deviceFilter={deviceFilter} 
          setDeviceFilter={setDeviceFilter} 
          meters={meters} 
          customers={customers} 
          devices={devices} 
          getStatusColor={getStatusColor} 
          getStatusIcon={getStatusIcon} 
        />;
      case 'alerts':
        return <AlertsView 
          selectedDCO={selectedDCO} 
          setSelectedDCO={setSelectedDCO} 
          DisCos={DisCos} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          alertFilter={alertFilter} 
          setAlertFilter={setAlertFilter} 
          alerts={alerts} 
          getPriorityColor={getPriorityColor} 
        />;
      case 'settings':
        return <SettingsView user={user} setUser={setUser} />;
      default:
        return <DashboardView 
          energyData={energyData} 
          loading={loading} 
          selectedDCO={selectedDCO} 
          setSelectedDCO={setSelectedDCO} 
          fetchDashboardData={fetchDashboardData} 
          DisCos={DisCos} 
          alerts={alerts} 
          devices={devices} 
          meters={meters} 
          customers={customers} 
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed} 
        user={user} 
        showUserMenu={showUserMenu} 
        setShowUserMenu={setShowUserMenu} 
      />
      
      <div className={`flex-1 overflow-auto transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <main className="p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;