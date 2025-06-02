
import React, { useState, useEffect } from 'react';
import { Plus, Search, Image, Calendar, Check } from 'lucide-react';
import { storageService, Asset } from '../services/storageService';

const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'props' as 'props' | 'costumes' | 'equipment',
    description: '',
    cost: '',
    status: 'available' as 'available' | 'in-use' | 'maintenance',
    assignedTo: '',
    assignedScene: ''
  });

  useEffect(() => {
    setAssets(storageService.getAssets());
  }, []);

  const handleCreateAsset = () => {
    if (formData.name.trim()) {
      const newAsset: Asset = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        description: formData.description,
        status: formData.status,
        assignedTo: formData.assignedTo,
        assignedScene: formData.assignedScene,
        cost: parseFloat(formData.cost) || 0
      };

      storageService.saveAsset(newAsset);
      setAssets(storageService.getAssets());
      setShowCreateModal(false);
      resetForm();
    }
  };

  const handleUpdateAsset = () => {
    if (selectedAsset && formData.name.trim()) {
      const updatedAsset: Asset = {
        ...selectedAsset,
        name: formData.name,
        category: formData.category,
        description: formData.description,
        status: formData.status,
        assignedTo: formData.assignedTo,
        assignedScene: formData.assignedScene,
        cost: parseFloat(formData.cost) || 0
      };

      storageService.saveAsset(updatedAsset);
      setAssets(storageService.getAssets());
      setSelectedAsset(null);
      setShowCreateModal(false);
      resetForm();
    }
  };

  const handleUpdateStatus = (id: string, status: 'available' | 'in-use' | 'maintenance') => {
    const assetList = storageService.getAssets();
    const asset = assetList.find(a => a.id === id);
    if (asset) {
      asset.status = status;
      storageService.saveAsset(asset);
      setAssets(storageService.getAssets());
    }
  };

  const handleDeleteAsset = (id: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      storageService.deleteAsset(id);
      setAssets(storageService.getAssets());
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'props',
      description: '',
      cost: '',
      status: 'available',
      assignedTo: '',
      assignedScene: ''
    });
  };

  const openEditModal = (asset: Asset) => {
    setSelectedAsset(asset);
    setFormData({
      name: asset.name,
      category: asset.category,
      description: asset.description,
      cost: asset.cost.toString(),
      status: asset.status,
      assignedTo: asset.assignedTo || '',
      assignedScene: asset.assignedScene || ''
    });
    setShowCreateModal(true);
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || asset.category === filterCategory;
    const matchesStatus = !filterStatus || asset.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in-use': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'props': return 'bg-purple-100 text-purple-800';
      case 'costumes': return 'bg-pink-100 text-pink-800';
      case 'equipment': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = ['props', 'costumes', 'equipment'];
  const statuses = ['available', 'in-use', 'maintenance'];

  const totalAssets = assets.length;
  const availableAssets = assets.filter(a => a.status === 'available').length;
  const inUseAssets = assets.filter(a => a.status === 'in-use').length;
  const maintenanceAssets = assets.filter(a => a.status === 'maintenance').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Asset Management</h1>
          <p className="text-gray-600 mt-1">Track and manage production assets, props, and equipment</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Asset</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assets</p>
              <p className="text-3xl font-bold text-gray-900">{totalAssets}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Image className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-3xl font-bold text-gray-900">{availableAssets}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Use</p>
              <p className="text-3xl font-bold text-gray-900">{inUseAssets}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-3xl font-bold text-gray-900">{maintenanceAssets}</p>
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
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => (
          <div key={asset.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <Image className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{asset.name}</h3>
                  <p className="text-sm text-gray-600">{asset.description}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(asset.category)}`}>
                  {asset.category}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(asset.status)}`}>
                  {asset.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cost</span>
                <span className="font-medium">${asset.cost.toLocaleString()}</span>
              </div>
              {asset.assignedTo && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Assigned To</span>
                  <span className="text-sm font-medium">{asset.assignedTo}</span>
                </div>
              )}
              {asset.assignedScene && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Scene</span>
                  <span className="text-sm font-medium">{asset.assignedScene}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex space-x-2">
                {asset.status === 'available' && (
                  <button
                    onClick={() => handleUpdateStatus(asset.id, 'in-use')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Check Out
                  </button>
                )}
                {asset.status === 'in-use' && (
                  <button
                    onClick={() => handleUpdateStatus(asset.id, 'available')}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Check In
                  </button>
                )}
                <button
                  onClick={() => handleUpdateStatus(asset.id, 'maintenance')}
                  className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                >
                  Maintenance
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(asset)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAsset(asset.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
          <p className="text-gray-600 mb-6">Start managing your production assets</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Asset</span>
          </button>
        </div>
      )}

      {/* Create/Edit Asset Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowCreateModal(false)}></div>
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">
                {selectedAsset ? 'Edit Asset' : 'Add New Asset'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter asset name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as 'props' | 'costumes' | 'equipment'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="props">Props</option>
                    <option value="costumes">Costumes</option>
                    <option value="equipment">Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Asset description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Asset cost"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'available' | 'in-use' | 'maintenance'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="available">Available</option>
                    <option value="in-use">In Use</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <input
                    type="text"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Person/Department (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Scene</label>
                  <input
                    type="text"
                    value={formData.assignedScene}
                    onChange={(e) => setFormData({...formData, assignedScene: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Scene (optional)"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedAsset(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={selectedAsset ? handleUpdateAsset : handleCreateAsset}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {selectedAsset ? 'Update' : 'Add'} Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets;
