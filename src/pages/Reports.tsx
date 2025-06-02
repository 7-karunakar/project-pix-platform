
import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, Download } from 'lucide-react';
import { storageService, Project, BudgetItem, ScheduleItem, CastCrewMember } from '../services/storageService';

const Reports: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [castCrew, setCastCrew] = useState<CastCrewMember[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [reportType, setReportType] = useState('overview');

  useEffect(() => {
    setProjects(storageService.getProjects());
    setBudgetItems(storageService.getBudgetItems());
    setScheduleItems(storageService.getScheduleItems());
    setCastCrew(storageService.getCastCrew());
  }, []);

  const generateReport = () => {
    console.log(`Generating ${reportType} report for project: ${selectedProject || 'All Projects'}`);
    // Here you would implement the actual report generation logic
    alert(`${reportType} report generated successfully!`);
  };

  const generateCallSheet = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysSchedule = scheduleItems.filter(item => item.date === today);
    
    if (todaysSchedule.length === 0) {
      alert('No schedule items for today');
      return;
    }

    console.log('Generating call sheet for today:', todaysSchedule);
    alert('Call sheet generated successfully!');
  };

  const filteredBudgetItems = selectedProject ? 
    budgetItems.filter(item => item.projectId === selectedProject) : 
    budgetItems;

  const filteredScheduleItems = selectedProject ? 
    scheduleItems.filter(item => item.projectId === selectedProject) : 
    scheduleItems;

  const totalBudget = filteredBudgetItems.reduce((sum, item) => sum + item.budgetAmount, 0);
  const totalSpent = filteredBudgetItems.reduce((sum, item) => sum + item.actualAmount, 0);
  const completedScenes = filteredScheduleItems.filter(item => item.status === 'completed').length;
  const totalScenes = filteredScheduleItems.length;

  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const scheduleProgress = totalScenes > 0 ? (completedScenes / totalScenes) * 100 : 0;

  const reportTypes = [
    { id: 'overview', name: 'Project Overview', description: 'Comprehensive project summary' },
    { id: 'budget', name: 'Budget Report', description: 'Financial analysis and spending' },
    { id: 'schedule', name: 'Schedule Report', description: 'Shooting progress and timeline' },
    { id: 'cast-crew', name: 'Cast & Crew Report', description: 'Team member details and contracts' },
    { id: 'daily', name: 'Daily Progress', description: 'Day-by-day production summary' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate comprehensive production reports and call sheets</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={generateCallSheet}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Calendar className="h-4 w-4" />
            <span>Generate Call Sheet</span>
          </button>
          <button
            onClick={generateReport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {reportTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Budget Utilization</p>
              <p className="text-3xl font-bold text-gray-900">{budgetUtilization.toFixed(1)}%</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${budgetUtilization > 90 ? 'bg-red-500' : budgetUtilization > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Schedule Progress</p>
              <p className="text-3xl font-bold text-gray-900">{scheduleProgress.toFixed(1)}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 bg-green-500 rounded-full"
                style={{ width: `${scheduleProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900">${totalSpent.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">of ${totalBudget.toLocaleString()} budget</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-3xl font-bold text-gray-900">{castCrew.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <User className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">
              {castCrew.filter(m => m.type === 'cast').length} cast, {castCrew.filter(m => m.type === 'crew').length} crew
            </span>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Report Preview</h3>
          <p className="text-sm text-gray-600">
            {reportTypes.find(type => type.id === reportType)?.description}
          </p>
        </div>
        
        <div className="p-6">
          {reportType === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Project Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Projects:</span>
                      <span className="text-sm font-medium">{projects.filter(p => p.status === 'active').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Budget:</span>
                      <span className="text-sm font-medium">${totalBudget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Scenes:</span>
                      <span className="text-sm font-medium">{totalScenes}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Completed Scenes:</span>
                      <span className="text-sm font-medium">{completedScenes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Team Members:</span>
                      <span className="text-sm font-medium">{castCrew.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Amount Spent:</span>
                      <span className="text-sm font-medium">${totalSpent.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {reportType === 'budget' && (
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-900">Budget Analysis</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Category</th>
                      <th className="text-right py-2">Budget</th>
                      <th className="text-right py-2">Actual</th>
                      <th className="text-right py-2">Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBudgetItems.slice(0, 5).map(item => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2">{item.category}</td>
                        <td className="text-right py-2">${item.budgetAmount.toLocaleString()}</td>
                        <td className="text-right py-2">${item.actualAmount.toLocaleString()}</td>
                        <td className={`text-right py-2 ${item.actualAmount > item.budgetAmount ? 'text-red-600' : 'text-green-600'}`}>
                          ${(item.actualAmount - item.budgetAmount).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportType === 'schedule' && (
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-900">Schedule Progress</h4>
              <div className="space-y-3">
                {filteredScheduleItems.slice(0, 5).map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{item.scene}</div>
                      <div className="text-sm text-gray-600">{item.location} - {item.date}</div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'completed' ? 'bg-green-100 text-green-800' :
                      item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {reportType === 'cast-crew' && (
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-900">Team Overview</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Cast Members</h5>
                  <div className="space-y-2">
                    {castCrew.filter(m => m.type === 'cast').slice(0, 5).map(member => (
                      <div key={member.id} className="flex justify-between items-center">
                        <span className="text-sm">{member.name}</span>
                        <span className="text-sm text-gray-600">{member.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Crew Members</h5>
                  <div className="space-y-2">
                    {castCrew.filter(m => m.type === 'crew').slice(0, 5).map(member => (
                      <div key={member.id} className="flex justify-between items-center">
                        <span className="text-sm">{member.name}</span>
                        <span className="text-sm text-gray-600">{member.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {reportType === 'daily' && (
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-900">Daily Progress Report</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Report Date: {new Date().toLocaleDateString()}</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{scheduleItems.filter(s => s.date === new Date().toISOString().split('T')[0]).length}</div>
                      <div className="text-sm text-gray-600">Scenes Today</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{scheduleItems.filter(s => s.status === 'completed' && s.date === new Date().toISOString().split('T')[0]).length}</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">{scheduleItems.filter(s => s.status === 'in-progress').length}</div>
                      <div className="text-sm text-gray-600">In Progress</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Report Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <FileText className="h-6 w-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-600">Export PDF</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Download className="h-6 w-6 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-600">Export Excel</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
            <Calendar className="h-6 w-6 text-yellow-600 mb-2" />
            <span className="text-sm font-medium text-yellow-600">Schedule Report</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <User className="h-6 w-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-600">Email Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
