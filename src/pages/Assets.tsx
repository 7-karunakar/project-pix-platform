
import React, { useState, useEffect } from 'react';
import { Plus, Search, Package, Wrench, Shirt, Scan } from 'lucide-react';
import { storageService, Asset } from '../services/storageService';
import BarcodeScanner from '../components/BarcodeScanner';

const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'props' as 'props' | 'costumes' | 'equipment',
    description: '',
    status: 'available' as 'available' | 'in-use' | 'maintenance',
    assignedTo: '',
    assignedScene: '',
    cost: 0,
    barcode: ''
  });

  useEffect(() => {
    setAssets(storageService.getAssets());
  }, []);

  const handleCreateAsset = () => {
    if (formData.name && formData.description) {
      const newAsset: Asset = {
        id: selectedAsset?.id || Date.now().toString(),
        ...formData,
        barcode: formData.barcode || undefined
      };

      storageService.saveAsset(newAsset);
      setAssets(storageService.getAssets());
      setShowCreateModal(false);
      resetForm();
    }
  };

  const handleUpdateAsset = () => {
    if (selectedAsset && formData.name && formData.description) {
      const updatedAsset: Asset = {
        ...selectedAsset,
        ...formData,
        barcode: formData.barcode || undefined
      };

      storageService.saveAsset(updatedAsset);
      setAssets(storageService.getAssets());
      setSelectedAsset(null);
      setShowCreateModal(false);
      resetForm();
    }
  };

  const handleDeleteAsset = (id: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      storageService.deleteAsset(id);
      setAssets(storageService.getAssets());
    }
  };

  const handleCheckOut = (id: string, assignedTo: string, assignedScene: string) => {
    const asset = assets.find(a => a.id === id);
    if (asset) {
      const updatedAsset = {
        ...asset,
        status: 'in-use' as const,
        assignedTo,
        assignedScene
      };
      storageService.saveAsset(updatedAsset);
      setAssets(storageService.getAssets());
    }
  };

  const handleCheckIn = (id: string) => {
    const asset = assets.find(a => a.id === id);
    if (asset) {
      const updatedAsset = {
        ...asset,
        status: 'available' as const,
        assignedTo: undefined,
        assignedScene: undefined
      };
      storageService.saveAsset(updatedAsset);
      setAssets(storageService.getAssets());
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'props',
      description: '',
      status: 'available',
      assignedTo: '',
      assignedScene: '',
      cost: 0,
      barcode: ''
    });
  };

  const openEditModal = (asset: Asset) => {
    setSelectedAsset(asset);
    setFormData({
      name: asset.name,
      category: asset.category,
      description: asset.description,
      status: asset.status,
      assignedTo: asset.assignedTo || '',
      assignedScene: asset.assignedScene || '',
      cost: asset.cost,
      barcode: (asset as any).barcode || ''
    });
    setShowCreateModal(true);
  };

  const handleBarcodeScanned = (barcode: string) => {
    // Check if asset with this barcode already exists
    const existingAsset = assets.find(a => (a as any).barcode === barcode);
    if (existingAsset) {
      alert(`Asset "${existingAsset.name}" already exists with this barcode`);
      setShowBarcodeScanner(false);
      return;
    }

    setFormData(prev => ({ ...prev, barcode }));
    setShowBarcodeScanner(false);
    setShowCreateModal(true);
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || asset.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || asset.status === filterStatus;
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'props': return Package;
      case 'costumes': return Shirt;
      case 'equipment': return Wrench;
      default: return Package;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Asset Management</h1>
          <p className="text-gray-600 mt-1">Track and manage production assets with barcode support</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowBarcodeScanner(true)}
            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors justify-center"
          >
            <Scan className="h-4 w-4" />
            <span>Scan Asset</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add Asset</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">
                {assets.filter(a => a.status === 'available').length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Package className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Use</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                {assets.filter(a => a.status === 'in-use').length}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">
                {assets.filter(a => a.status === 'maintenance').length}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Wrench className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
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
            <option value="all">All Categories</option>
            <option value="props">Props</option>
            <option value="costumes">Costumes</option>
            <option value="equipment">Equipment</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="in-use">In Use</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Assets List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredAssets.map((asset) => {
          const CategoryIcon = getCategoryIcon(asset.category);
          return (
            <div key={asset.id} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <CategoryIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{asset.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{asset.category}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(asset.status)}`}>
                  {asset.status.replace('-', ' ')}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{asset.description}</p>
              
              {(asset as any).barcode && (
                <div className="mb-4 p-2 bg-gray-50 rounded border">
                  <div className="flex items-center space-x-2">
                    <Scan className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-mono text-gray-700">{(asset as any).barcode}</span>
                  </div>
                </div>
              )}

              {asset.assignedTo && (
                <div className="mb-4 text-sm">
                  <p className="text-gray-600">Assigned to: <span className="font-medium">{asset.assignedTo}</span></p>
                  {asset.assignedScene && (
                    <p className="text-gray-600">Scene: <span className="font-medium">{asset.assignedScene}</span></p>
                  )}
                </div>
              )}

              <div className="mb-4">
                <p className="text-sm text-gray-600">Cost: <span className="font-medium">${asset.cost.toLocaleString()}</span></p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(asset)}
                  className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Edit
                </button>
                {asset.status === 'available' ? (
                  <button
                    onClick={() => {
                      const assignedTo = prompt('Assign to:');
                      const assignedScene = prompt('Scene:');
                      if (assignedTo) handleCheckOut(asset.id, assignedTo, assignedScene || '');
                    }}
                    className="flex-1 text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Check Out
                  </button>
                ) : asset.status === 'in-use' ? (
                  <button
                    onClick={() => handleCheckIn(asset.id)}
                    className="flex-1 text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    Check In
                  </button>
                ) : null}
                <button
                  onClick={() => handleDeleteAsset(asset.id)}
                  className="flex-1 text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
          <p className="text-gray-600 mb-6">Start building your asset inventory</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Asset</span>
          </button>
        </div>
      )}

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setShowBarcodeScanner(false)}
        />
      )}

      {/* Create/Edit Asset Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowCreateModal(false)}></div>
            
            <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
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
                    placeholder="Asset name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.barcode}
                      onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter or scan barcode"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        setShowBarcodeScanner(true);
                      }}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Scan className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                {formData.status === 'in-use' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                      <input
                        type="text"
                        value={formData.assignedTo}
                        onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Person or department"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Scene</label>
                      <input
                        type="text"
                        value={formData.assignedScene}
                        onChange={(e) => setFormData({...formData, assignedScene: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Scene number or name"
                      />
                    </div>
                  </div>
                )}
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
