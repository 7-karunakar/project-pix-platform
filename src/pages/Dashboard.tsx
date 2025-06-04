import React, { useState, useEffect } from 'react';
import { Calendar, CalendarCheck, User, FileText, Plus, Search, TrendingUp, AlertTriangle, Clock, FolderOpen } from 'lucide-react';
import { storageService, Project, Task, ScheduleItem, BudgetItem } from '../services/storageService';
import { weatherService, WeatherForecast } from '../services/weatherService';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [showQuickActionModal, setShowQuickActionModal] = useState(false);

  useEffect(() => {
    setProjects(storageService.getProjects());
    setTasks(storageService.getTasks());
    setScheduleItems(storageService.getScheduleItems());
    setBudgetItems(storageService.getBudgetItems());
    loadWeatherData();

    // Update weather every 5 minutes
    const weatherInterval = setInterval(loadWeatherData, 5 * 60 * 1000);
    return () => clearInterval(weatherInterval);
  }, []);

  const loadWeatherData = async () => {
    try {
      const weatherData = await weatherService.getWeatherForecast();
      setWeather(weatherData);
    } catch (error) {
      console.error('Failed to load weather data:', error);
    }
  };

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const upcomingTasks = tasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length;
  const todaySchedule = scheduleItems.filter(s => s.date === new Date().toISOString().split('T')[0]).length;
  
  const totalBudget = budgetItems.reduce((sum, item) => sum + item.budgetAmount, 0);
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.actualAmount, 0);
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const completedSchedule = scheduleItems.filter(s => s.status === 'completed').length;
  const totalSchedule = scheduleItems.length;
  const scheduleAdherence = totalSchedule > 0 ? (completedSchedule / totalSchedule) * 100 : 0;
  
  const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;
  
  const resourceUtilization = scheduleItems.filter(s => s.status === 'completed' || s.status === 'in-progress').length;

  const exportAnalytics = () => {
    const analyticsData = {
      summary: {
        activeProjects,
        taskCompletionRate: taskCompletionRate.toFixed(1),
        budgetUtilization: budgetUtilization.toFixed(1),
        scheduleAdherence: scheduleAdherence.toFixed(1)
      },
      budget: {
        totalBudget,
        totalSpent,
        remaining: totalBudget - totalSpent,
        utilizationPercentage: budgetUtilization.toFixed(1)
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        overdue: overdueTasks,
        upcoming: upcomingTasks
      },
      schedule: {
        total: totalSchedule,
        completed: completedSchedule,
        today: todaySchedule,
        adherence: scheduleAdherence.toFixed(1)
      }
    };

    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `production-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const recentActivities = [
    { id: 1, action: 'New project created', item: 'The Dark Knight Returns', time: '2 hours ago' },
    { id: 2, action: 'Budget approved', item: 'Location rental - Central Park', time: '4 hours ago' },
    { id: 3, action: 'Schedule updated', item: 'Scene 15 - Action sequence', time: '6 hours ago' },
    { id: 4, action: 'Cast member added', item: 'John Doe - Lead Actor', time: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your production overview.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button 
            onClick={exportAnalytics}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors justify-center"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Export Analytics</span>
          </button>
          <button 
            onClick={() => setShowQuickActionModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Quick Action</span>
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards for US 14 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{activeProjects}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Task Completion</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{taskCompletionRate.toFixed(1)}%</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <CalendarCheck className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-gray-600 text-sm">{completedTasks} of {totalTasks} tasks</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Schedule Adherence</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{scheduleAdherence.toFixed(1)}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">{completedSchedule} completed sessions</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Budget Usage</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{budgetUtilization.toFixed(1)}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <User className="h-6 w-6 text-purple-600" />
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
      </div>

      {/* Additional KPI Cards for Enhanced Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Tasks</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">{overdueTasks}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-red-600 text-sm font-medium">Require immediate attention</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resource Utilization</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{resourceUtilization}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <User className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-indigo-600 text-sm font-medium">Active resources</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Schedule</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{todaySchedule}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-orange-600 text-sm font-medium">Shooting sessions</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                  <p className="text-sm text-gray-600 truncate">{activity.item}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Projects */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Current Projects</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {projects.slice(0, 4).map((project) => (
              <div key={project.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-900 truncate">{project.title}</h3>
                  <p className="text-sm text-gray-600">{project.genre}</p>
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                    project.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">${project.budget.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weather and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Forecast</h3>
          {weather ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Today</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{weather.today.temperature}°F</span>
                  <span className="text-xs text-gray-500">{weather.today.condition}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tomorrow</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{weather.tomorrow.temperature}°F</span>
                  <span className="text-xs text-gray-500">{weather.tomorrow.condition}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Day After</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{weather.dayAfter.temperature}°F</span>
                  <span className="text-xs text-gray-500">{weather.dayAfter.condition}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading weather...</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button 
              onClick={() => setShowQuickActionModal(true)}
              className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Plus className="h-6 w-6 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-600 text-center">New Project</span>
            </button>
            <button 
              onClick={() => setShowQuickActionModal(true)}
              className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Calendar className="h-6 w-6 text-green-600 mb-2" />
              <span className="text-sm font-medium text-green-600 text-center">Add Schedule</span>
            </button>
            <button 
              onClick={() => setShowQuickActionModal(true)}
              className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <User className="h-6 w-6 text-yellow-600 mb-2" />
              <span className="text-sm font-medium text-yellow-600 text-center">Add Member</span>
            </button>
            <button 
              onClick={exportAnalytics}
              className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <FileText className="h-6 w-6 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-purple-600 text-center">Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Modal */}
      {showQuickActionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowQuickActionModal(false)}></div>
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FolderOpen className="h-5 w-5 text-blue-600" />
                  <span>Create New Project</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <span>Schedule Meeting</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <User className="h-5 w-5 text-yellow-600" />
                  <span>Add Team Member</span>
                </button>
                <button 
                  onClick={() => {
                    exportAnalytics();
                    setShowQuickActionModal(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FileText className="h-5 w-5 text-purple-600" />
                  <span>Export Analytics</span>
                </button>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowQuickActionModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
