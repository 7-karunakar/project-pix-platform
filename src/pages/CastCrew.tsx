
import React, { useState, useEffect } from 'react';
import { Plus, Search, User, Mail, Calendar } from 'lucide-react';
import { storageService, CastCrewMember } from '../services/storageService';

const CastCrew: React.FC = () => {
  const [members, setMembers] = useState<CastCrewMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<CastCrewMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    type: 'cast' as 'cast' | 'crew',
    email: '',
    phone: '',
    contractStatus: 'pending' as 'pending' | 'signed' | 'expired',
    dailyRate: ''
  });

  useEffect(() => {
    setMembers(storageService.getCastCrew());
  }, []);

  const handleCreateMember = () => {
    if (formData.name.trim() && formData.role.trim()) {
      const newMember: CastCrewMember = {
        id: Date.now().toString(),
        name: formData.name,
        role: formData.role,
        type: formData.type,
        contactInfo: {
          email: formData.email,
          phone: formData.phone
        },
        contractStatus: formData.contractStatus,
        availability: [],
        dailyRate: parseFloat(formData.dailyRate) || 0
      };

      storageService.saveCastCrewMember(newMember);
      setMembers(storageService.getCastCrew());
      setShowCreateModal(false);
      resetForm();
    }
  };

  const handleUpdateMember = () => {
    if (selectedMember && formData.name.trim() && formData.role.trim()) {
      const updatedMember: CastCrewMember = {
        ...selectedMember,
        name: formData.name,
        role: formData.role,
        type: formData.type,
        contactInfo: {
          email: formData.email,
          phone: formData.phone
        },
        contractStatus: formData.contractStatus,
        dailyRate: parseFloat(formData.dailyRate) || 0
      };

      storageService.saveCastCrewMember(updatedMember);
      setMembers(storageService.getCastCrew());
      setSelectedMember(null);
      setShowCreateModal(false);
      resetForm();
    }
  };

  const handleDeleteMember = (id: string) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      storageService.deleteCastCrewMember(id);
      setMembers(storageService.getCastCrew());
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      type: 'cast',
      email: '',
      phone: '',
      contractStatus: 'pending',
      dailyRate: ''
    });
  };

  const openEditModal = (member: CastCrewMember) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      type: member.type,
      email: member.contactInfo.email,
      phone: member.contactInfo.phone,
      contractStatus: member.contractStatus,
      dailyRate: member.dailyRate.toString()
    });
    setShowCreateModal(true);
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || member.type === filterType;
    return matchesSearch && matchesType;
  });

  const getContractStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const castMembers = filteredMembers.filter(m => m.type === 'cast');
  const crewMembers = filteredMembers.filter(m => m.type === 'crew');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cast & Crew Management</h1>
          <p className="text-gray-600 mt-1">Manage your production team members and contracts</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-3xl font-bold text-gray-900">{members.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cast Members</p>
              <p className="text-3xl font-bold text-gray-900">{castMembers.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <User className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Crew Members</p>
              <p className="text-3xl font-bold text-gray-900">{crewMembers.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <User className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Contracts</p>
              <p className="text-3xl font-bold text-gray-900">
                {members.filter(m => m.contractStatus === 'pending').length}
              </p>
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
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="cast">Cast</option>
            <option value="crew">Crew</option>
          </select>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${member.type === 'cast' ? 'bg-green-100' : 'bg-blue-100'}`}>
                  <User className={`h-6 w-6 ${member.type === 'cast' ? 'text-green-600' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                member.type === 'cast' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {member.type}
              </span>
            </div>
            
            <div className="space-y-3 mb-4">
              {member.contactInfo.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{member.contactInfo.email}</span>
                </div>
              )}
              {member.contactInfo.phone && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{member.contactInfo.phone}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Daily Rate</span>
                <span className="font-medium">${member.dailyRate.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Contract Status</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getContractStatusColor(member.contractStatus)}`}>
                  {member.contractStatus}
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-100">
              <button
                onClick={() => openEditModal(member)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteMember(member.id)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
          <p className="text-gray-600 mb-6">Start building your production team</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Member</span>
          </button>
        </div>
      )}

      {/* Create/Edit Member Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowCreateModal(false)}></div>
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">
                {selectedMember ? 'Edit Member' : 'Add New Member'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter member name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Lead Actor, Director, Cinematographer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as 'cast' | 'crew'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="cast">Cast</option>
                    <option value="crew">Crew</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate</label>
                  <input
                    type="number"
                    value={formData.dailyRate}
                    onChange={(e) => setFormData({...formData, dailyRate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter daily rate"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contract Status</label>
                  <select
                    value={formData.contractStatus}
                    onChange={(e) => setFormData({...formData, contractStatus: e.target.value as 'pending' | 'signed' | 'expired'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="signed">Signed</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedMember(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={selectedMember ? handleUpdateMember : handleCreateMember}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {selectedMember ? 'Update' : 'Add'} Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CastCrew;
