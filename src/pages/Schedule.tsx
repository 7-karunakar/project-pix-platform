
import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Clock, User } from 'lucide-react';
import { storageService, ScheduleItem, Project, CastCrewMember } from '../services/storageService';

const Schedule: React.FC = () => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [castCrew, setCastCrew] = useState<CastCrewMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  const [formData, setFormData] = useState({
    projectId: '',
    date: '',
    time: '',
    scene: '',
    location: '',
    cast: [] as string[],
    crew: [] as string[],
    notes: ''
  });

  useEffect(() => {
    setScheduleItems(storageService.getScheduleItems());
    setProjects(storageService.getProjects());
    setCastCrew(storageService.getCastCrew());
  }, []);

  const handleCreateSchedule = () => {
    if (formData.date && formData.time && formData.scene) {
      const newItem: ScheduleItem = {
        id: Date.now().toString(),
        projectId: formData.projectId,
        date: formData.date,
        time: formData.time,
        scene: formData.scene,
        location: formData.location,
        cast: formData.cast,
        crew: formData.crew,
        notes: formData.notes,
        status: 'scheduled'
      };

      storageService.saveScheduleItem(newItem);
      setScheduleItems(storageService.getScheduleItems());
      setShowCreateModal(false);
      resetForm();
    }
  };

  const handleUpdateSchedule = () => {
    if (selectedSchedule && formData.date && formData.time && formData.scene) {
      const updatedItem: ScheduleItem = {
        ...selectedSchedule,
        projectId: formData.projectId,
        date: formData.date,
        time: formData.time,
        scene: formData.scene,
        location: formData.location,
        cast: formData.cast,
        crew: formData.crew,
        notes: formData.notes
      };

      storageService.saveScheduleItem(updatedItem);
      setScheduleItems(storageService.getScheduleItems());
      setSelectedSchedule(null);
      setShowCreateModal(false);
      resetForm();
    }
  };

  const handleUpdateStatus = (id: string, status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled') => {
    const items = storageService.getScheduleItems();
    const item = items.find(i => i.id === id);
    if (item) {
      item.status = status;
      storageService.saveScheduleItem(item);
      setScheduleItems(storageService.getScheduleItems());
    }
  };

  const handleDeleteSchedule = (id: string) => {
    if (window.confirm('Are you sure you want to delete this schedule item?')) {
      storageService.deleteScheduleItem(id);
      setScheduleItems(storageService.getScheduleItems());
    }
  };

  const resetForm = () => {
    setFormData({
      projectId: '',
      date: '',
      time: '',
      scene: '',
      location: '',
      cast: [],
      crew: [],
      notes: ''
    });
  };

  const openEditModal = (item: ScheduleItem) => {
    setSelectedSchedule(item);
    setFormData({
      projectId: item.projectId,
      date: item.date,
      time: item.time,
      scene: item.scene,
      location: item.location,
      cast: item.cast,
      crew: item.crew,
      notes: item.notes || ''
    });
    setShowCreateModal(true);
  };

  const filteredItems = scheduleItems.filter(item => {
    const matchesSearch = item.scene.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = !selectedProject || item.projectId === selectedProject;
    return matchesSearch && matchesProject;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const todaysSchedule = filteredItems.filter(item => item.date === new Date().toISOString().split('T')[0]);
  const upcomingSchedule = filteredItems.filter(item => new Date(item.date) > new Date());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Production Schedule</h1>
          <p className="text-gray-600 mt-1">Manage shooting schedules and daily call sheets</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex bg-gray-100 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'calendar' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              Calendar
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Schedule</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Shoots</p>
              <p className="text-3xl font-bold text-gray-900">{todaysSchedule.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-3xl font-bold text-gray-900">{upcomingSchedule.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900">
                {filteredItems.filter(item => item.status === 'completed').length}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-gray-900">
                {filteredItems.filter(item => item.status === 'in-progress').length}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-red-600" />
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
              placeholder="Search schedule items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Schedule Items */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredItems.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((item) => {
            const project = projects.find(p => p.id === item.projectId);
            return (
              <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.scene}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    {project && <p className="text-sm text-gray-600">{project.title}</p>}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSchedule(item.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {new Date(item.date).toLocaleDateString()} at {item.time}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{item.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {item.cast.length + item.crew.length} members
                    </span>
                  </div>
                </div>

                {item.notes && (
                  <p className="text-sm text-gray-600 mb-4">{item.notes}</p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    {item.status === 'scheduled' && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'in-progress')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Start
                      </button>
                    )}
                    {item.status === 'in-progress' && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'completed')}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'cancelled')}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Generate Call Sheet
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
            <p className="text-gray-600">Calendar view coming soon</p>
          </div>
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No schedule items found</h3>
          <p className="text-gray-600 mb-6">Start planning your shooting schedule</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Schedule</span>
          </button>
        </div>
      )}

      {/* Create/Edit Schedule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowCreateModal(false)}></div>
            
            <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">
                {selectedSchedule ? 'Edit Schedule' : 'Add Schedule Item'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.title}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scene</label>
                  <input
                    type="text"
                    value={formData.scene}
                    onChange={(e) => setFormData({...formData, scene: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Scene description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Shooting location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedSchedule(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={selectedSchedule ? handleUpdateSchedule : handleCreateSchedule}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {selectedSchedule ? 'Update' : 'Add'} Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
