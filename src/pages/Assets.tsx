
import React, { useState, useEffect } from 'react';
import { Plus, Search, Package, QrCode, Calendar, User, MapPin, AlertCircle, Edit3, Trash2 } from 'lucide-react';
import { storageService, Asset } from '../services/storageService';
import BarcodeScanner from '../components/BarcodeScanner';

const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [newAsset, setNewAsset] = useState<Omit<Asset, 'id'>>({
    name: '',
    type: 'prop',
    status: 'available',
    location: '',
    assignedTo: '',
    assignedScene: '',
    notes: '',
    barcode: ''
  });

  useEffect(() => {
    const loadedAssets = storageService.getAssets();
    setAssets(loadedAssets);
    setFilteredAssets(loadedAssets);
  }, []);

  useEffect(() => {
    let filtered = assets;

    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.assignedTo && asset.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (asset.barcode && asset.barcode.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(asset => asset.type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(asset => asset.status === filterStatus);
    }

    setFilteredAssets(filtered);
  }, [assets, searchTerm, filterType, filterStatus]);

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const asset: Asset = {
      ...newAsset,
      id: Date.now().toString()
    };
    
    storageService.saveAsset(asset);
    setAssets([...assets, asset]);
    setNewAsset({
      name: '',
      type: 'prop',
      status: 'available',
      location: '',
      assignedTo: '',
      assignedScene: '',
      notes: '',
      barcode: ''
    });
    setShowAddForm(false);
    
    alert('Asset added successfully!');
  };

  const handleCheckOut = (asset: Asset) => {
    const assignedTo = prompt('Assign to (name):');
    const assignedScene = prompt('Assign to scene:');
    
    if (assignedTo && assignedScene) {
      const updatedAsset = { 
        ...asset, 
        status: 'checked-out' as const,
        assignedTo,
        assignedScene
      };
      storageService.saveAsset(updatedAsset);
      setAssets(assets.map(a => a.id === asset.id ? updatedAsset : a));
      alert('Asset checked out successfully!');
    }
  };

  const handleCheckIn = (asset: Asset) => {
    const updatedAsset = { 
      ...asset, 
      status: 'available' as const,
      assignedTo: '',
      assignedScene: ''
    };
    storageService.saveAsset(updatedAsset);
    setAssets(assets.map(a => a.id === asset.id ? updatedAsset : a));
    alert('Asset checked in successfully!');
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setShowEditForm(true);
  };

  const handleUpdateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAsset) {
      storageService.saveAsset(editingAsset);
      setAssets(assets.map(a => a.id === editingAsset.id ? editingAsset : a));
      setShowEditForm(false);
      setEditingAsset(null);
      alert('Asset updated successfully!');
    }
  };

  const handleDeleteAsset = (id: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      storageService.deleteAsset(id);
      setAssets(assets.filter(a => a.id !== id));
      alert('Asset deleted successfully!');
    }
  };

  const handleBarcodeScanned = (code: string) => {
    const asset = assets.find(a => a.barcode === code);
    if (asset) {
      alert(`Asset found: ${asset.name}\nStatus: ${asset.status}\nLocation: ${asset.location}`);
    } else {
      alert('Asset not found for this barcode');
    }
    setShowBarcodeScanner(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'checked-out': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'damaged': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prop': return 'bg-purple-100 text-purple-800';
      case 'costume': return 'bg-pink-100 text-pink-800';
      case 'equipment': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Asset Management</h1>
          <p className="text-gray-600 mt-1">Track and manage all production assets</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button
            onClick={() => setShowBarcodeScanner(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors justify-center"
          >
            <QrCode className="h-4 w-4" />
            <span>Scan Barcode</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add Asset</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="prop">Props</option>
            <option value="costume">Costumes</option>
            <option value="equipment">Equipment</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="checked-out">Checked Out</option>
            <option value="maintenance">Maintenance</option>
            <option value="damaged">Damaged</option>
          </select>
          <div className="text-sm text-gray-600 flex items-center">
            <Package className="h-4 w-4 mr-1" />
            {filteredAssets.length} assets
          </div>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map(asset => (
          <div key={asset.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{asset.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(asset.type)}`}>
                      {asset.type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(asset.status)}`}>
                      {asset.status}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEditAsset(asset)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAsset(asset.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{asset.location}</span>
                </div>
                {asset.assignedTo && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>Assigned to: {asset.assignedTo}</span>
                  </div>
                )}
                {asset.assignedScene && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Scene: {asset.assignedScene}</span>
                  </div>
                )}
                {asset.barcode && (
                  <div className="flex items-center">
                    <QrCode className="h-4 w-4 mr-2" />
                    <span>Barcode: {asset.barcode}</span>
                  </div>
                )}
                {asset.notes && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                    {asset.notes}
                  </div>
                )}
              </div>

              <div className="mt-4 flex space-x-2">
                {asset.status === 'available' && (
                  <button
                    onClick={() => handleCheckOut(asset)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    Check Out
                  </button>
                )}
                {asset.status === 'checked-out' && (
                  <button
                    onClick={() => handleCheckIn(asset)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    Check In
                  </button>
                )}
                {asset.status === 'maintenance' && (
                  <div className="flex-1 bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm text-center">
                    In Maintenance
                  </div>
                )}
                {asset.status === 'damaged' && (
                  <div className="flex-1 bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm text-center">
                    Damaged
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Asset Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Add New Asset</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddAsset} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newAsset.type}
                  onChange={(e) => setNewAsset({...newAsset, type: e.target.value as 'prop' | 'costume' | 'equipment'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="prop">Prop</option>
                  <option value="costume">Costume</option>
                  <option value="equipment">Equipment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={newAsset.location}
                  onChange={(e) => setNewAsset({...newAsset, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Barcode (Optional)</label>
                <input
                  type="text"
                  value={newAsset.barcode}
                  onChange={(e) => setNewAsset({...newAsset, barcode: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  value={newAsset.notes}
                  onChange={(e) => setNewAsset({...newAsset, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Asset Modal */}
      {showEditForm && editingAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Edit Asset</h3>
              <button
                onClick={() => setShowEditForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateAsset} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  value={editingAsset.name}
                  onChange={(e) => setEditingAsset({...editingAsset, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={editingAsset.type}
                  onChange={(e) => setEditingAsset({...editingAsset, type: e.target.value as 'prop' | 'costume' | 'equipment'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="prop">Prop</option>
                  <option value="costume">Costume</option>
                  <option value="equipment">Equipment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editingAsset.status}
                  onChange={(e) => setEditingAsset({...editingAsset, status: e.target.value as 'available' | 'checked-out' | 'maintenance' | 'damaged'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="available">Available</option>
                  <option value="checked-out">Checked Out</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="damaged">Damaged</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={editingAsset.location}
                  onChange={(e) => setEditingAsset({...editingAsset, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                <input
                  type="text"
                  value={editingAsset.assignedTo || ''}
                  onChange={(e) => setEditingAsset({...editingAsset, assignedTo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Scene</label>
                <input
                  type="text"
                  value={editingAsset.assignedScene || ''}
                  onChange={(e) => setEditingAsset({...editingAsset, assignedScene: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
                <input
                  type="text"
                  value={editingAsset.barcode || ''}
                  onChange={(e) => setEditingAsset({...editingAsset, barcode: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={editingAsset.notes || ''}
                  onChange={(e) => setEditingAsset({...editingAsset, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setShowBarcodeScanner(false)}
        />
      )}

      {/* Empty State */}
      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No assets found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Get started by adding a new asset'
            }
          </p>
          {!searchTerm && filterType === 'all' && filterStatus === 'all' && (
            <div className="mt-6">
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Assets;
