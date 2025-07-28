import React from 'react';
import { 
  Building2,
  Activity,
  Users,
  Plus,
  Search,
  Eye,
  Edit,
  MapPin
} from 'lucide-react';
import MetricCard from './MetricCard';

const DisCosView = ({ 
  DisCos, 
  searchTerm, 
  setSearchTerm, 
  setShowAddDCOModal, 
  setSelectedDCO, 
  getStatusColor 
}) => {
  const filteredDisCos = DisCos.filter(dco => {
    const matchesSearch = dco.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dco.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dco.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Distribution Company Management</h2>
        <button 
          onClick={() => setShowAddDCOModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add DisCo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total DisCos"
          value={DisCos.length}
          subtitle="Registered companies"
          icon={Building2}
        />
        <MetricCard
          title="Active DisCos"
          value={DisCos.filter(d => d.status === 'active').length}
          subtitle="Currently operational"
          icon={Activity}
        />
        <MetricCard
          title="Total Coverage"
          value={DisCos.reduce((sum, d) => sum + d.customerCount, 0)}
          subtitle="Customers served"
          icon={Users}
        />
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search DisCos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredDisCos.map(dco => (
            <div key={dco.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{dco.name}</h3>
                    <span className="px-2 py-1 bg-blue-600 text-blue-100 rounded-full text-xs font-medium">
                      {dco.code}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dco.status)}`}>
                      {dco.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-300">
                    <div>
                      <span className="text-gray-400">Region:</span> {dco.region}
                    </div>
                    <div>
                      <span className="text-gray-400">Email:</span> {dco.email}
                    </div>
                    <div>
                      <span className="text-gray-400">Meters:</span> {dco.meterCount}
                    </div>
                    <div>
                      <span className="text-gray-400">Customers:</span> {dco.customerCount}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {dco.address}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setSelectedDCO(dco.id)}
                    className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-gray-600 rounded"
                  >
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

export default DisCosView;
