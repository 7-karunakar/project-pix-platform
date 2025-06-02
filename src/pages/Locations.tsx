
import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Check } from 'lucide-react';
import { storageService, Location } from '../services/storageService';

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactPerson: '',
    permitStatus: 'pending' as 'pending' | 'approved' | 'expired',
    cost: '',
    notes: ''
  });

  useEffect(() => {
    setLocations(storageService.getLocations());
  }, []);

  const handleCreateLocation = () => {
    if (formData.name.trim() && formData.address.trim()) {
      const newLocation: Location = {
        id: Date.now().toString(),
        name: formData.name,
        address: formData.address,
        contactPerson: formData.contactPerson,
        permitStatus: formData.permitStatus,
        cost: parseFloat(formData.cost) || 0,
        availability: [],
        notes: formData.notes
      };

      storageService.saveLocation(newLocation);
      setLocations(storageService.getLocations());
      setShowCreateModal(false);
      resetForm();
    }
  };

  const handleUpdateLocation = () => {
    if (selectedLocation && formData.name.trim() && formData.address.trim()) {
      const updatedLocation: Location = {
        ...selectedLocation,
        name: formData.name,
        address: formData.address,
        contactPerson: formData.contactPerson,
        permitStatus: formData.permitStatus,
        cost: parseFloat(formData.cost) || 0,
        notes: formData.notes
      };

      storageService.saveLocation(updatedLocation);
      setLocations(storageService.getLocations());
      setSelectedLocation(null);
      setShowCreateModal(false);
      resetForm();
    }
  };

  const handleUpdatePermitStatus = (id: string, status: 'pending' | 'approved' | 'expired') => {
    const locationList = storageService.getLocations();
    const location = locationList.find(l => l.id === id);
    if (location) {
      location.permitStatus = status;
      storageService.saveLocation(location);
      setLocations(storageService.getLocations());
    }
  };

  const handleDeleteLocation = (id: string) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      storageService.deleteLocation(id);
      setLocations(storageService.getLocations());
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      contactPerson: '',
      permitStatus: 'pending',
      cost: '',
      notes: ''
    });
  };

  const openEditModal = (location: Location) => {
    setSelectedLocation(location);
    setFormData({
      name: location.name,
      address: location.address,
      contactPerson: location.contactPerson,
      permitStatus: location.permitStatus,
      cost: location.cost.toString(),
      notes: location.notes || ''
    });
    setShowCreateModal(true);
  };

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || location.permitStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getPermitStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalLocations = locations.length;
  const approvedPermits = locations.filter(l => l.permitStatus === 'approved').length;
  const pendingPermits = locations.filter(l => l.permitStatus === 'pending').length;
  const expiredPermits = locations.filter(l => l.permitStatus === 'expired').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Location Management</h1>
          <p className="text-gray-600 mt-1">Manage shooting locations, permits, and logistics</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Location</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Locations</p>
              <p className="text-3xl font-bold text-gray-900">{totalLocations}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved Permits</p>
              <p className="text-3xl font-bold text-gray-900">{approvedPermits}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Permits</p>
              <p className="text-3xl font-bold text-gray-900">{pendingPermits}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expired Permits</p>
              <p className="text-3xl font-bold text-gray-900">{expiredPermits}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Permit Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((location) => (
          <div key={location.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{location.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{location.address}</p>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPermitStatusColor(location.permitStatus)}`}>
                {location.permitStatus}
              </span>
            </div>
            
            <div className="space-y-3 mb-4">
              {location.contactPerson && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Contact</span>
                  <span className="text-sm font-medium">{location.contactPerson}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cost</span>
                <span className="font-medium">${location.cost.toLocaleString()}</span>
              </div>
              {location.notes && (
                <div>
                  <span className="text-sm text-gray-600">Notes</span>
                  <p className="text-sm text-gray-800 mt-1">{location.notes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex space-x-2">
                {location.permitStatus === 'pending' && (
                  <button
                    onClick={() => handleUpdatePermitStatus(location.id, 'approved')}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Approve
                  </button>
                )}
                {location.permitStatus === 'approved' && (
                  <button
                    onClick={() => handleUpdatePermitStatus(location.id, 'expired')}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Mark Expired
                  </button>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(location)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteLocation(location.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLocations.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No locations found</h3>
          <p className="text-gray-600 mb-6">Start adding shooting locations</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Location</span>
          </button>
        </div>
      )}

      {/* Create/Edit Location Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowCreateModal(false)}></div>
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">
                {selectedLocation ? 'Edit Location' : 'Add New Location'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter location name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Contact person name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Permit Status</label>
                  <select
                    value={formData.permitStatus}
                    onChange={(e) => setFormData({...formData, permitStatus: e.target.value as 'pending' | 'approved' | 'expired'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Location cost"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes (optional)"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedLocation(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={selectedLocation ? handleUpdateLocation : handleCreateLocation}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {selectedLocation ? 'Update' : 'Add'} Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Locations;
