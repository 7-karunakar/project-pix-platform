import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, Download, Mail, FileSpreadsheet, Film } from 'lucide-react';
import { storageService, Project, BudgetItem, ScheduleItem, CastCrewMember } from '../services/storageService';
import SceneCallSheet from '../components/SceneCallSheet';

const Reports: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [castCrew, setCastCrew] = useState<CastCrewMember[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [reportType, setReportType] = useState('overview');
  const [showSceneCallSheet, setShowSceneCallSheet] = useState(false);
  const [selectedScene, setSelectedScene] = useState<ScheduleItem | null>(null);

  useEffect(() => {
    setProjects(storageService.getProjects());
    setBudgetItems(storageService.getBudgetItems());
    setScheduleItems(storageService.getScheduleItems());
    setCastCrew(storageService.getCastCrew());
  }, []);

  const generatePDFReport = () => {
    const reportData = generateReportData();
    const htmlContent = generateHTMLReport(reportData);
    
    // Create a blob with HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.html`;
    link.click();
    URL.revokeObjectURL(url);
    
    alert('Report downloaded successfully!');
  };

  const generateExcelReport = () => {
    const reportData = generateReportData();
    const csvContent = generateCSVContent(reportData);
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    alert('Excel report downloaded successfully!');
  };

  const generateReportData = () => {
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

    return {
      project: selectedProject ? projects.find(p => p.id === selectedProject) : null,
      budget: { totalBudget, totalSpent, items: filteredBudgetItems },
      schedule: { completedScenes, totalScenes, items: filteredScheduleItems },
      castCrew,
      reportType,
      generatedAt: new Date().toISOString()
    };
  };

  const generateHTMLReport = (data: any) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>${data.reportType.charAt(0).toUpperCase() + data.reportType.slice(1)} Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .section { margin-bottom: 30px; }
        .metric { display: inline-block; margin: 10px 20px 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>Movie Production Management System</h1>
        <h2>${data.reportType.charAt(0).toUpperCase() + data.reportType.slice(1)} Report</h2>
        <p>Generated on: ${new Date(data.generatedAt).toLocaleString()}</p>
        ${data.project ? `<p>Project: ${data.project.title}</p>` : '<p>All Projects</p>'}
    </div>
    
    <div class="section">
        <h3>Summary Metrics</h3>
        <div class="metric">
            <strong>Total Budget:</strong><br>$${data.budget.totalBudget.toLocaleString()}
        </div>
        <div class="metric">
            <strong>Total Spent:</strong><br>$${data.budget.totalSpent.toLocaleString()}
        </div>
        <div class="metric">
            <strong>Budget Utilization:</strong><br>${((data.budget.totalSpent / data.budget.totalBudget) * 100).toFixed(1)}%
        </div>
        <div class="metric">
            <strong>Schedule Progress:</strong><br>${((data.schedule.completedScenes / data.schedule.totalScenes) * 100).toFixed(1)}%
        </div>
    </div>
    
    ${data.reportType === 'budget' || data.reportType === 'overview' ? `
    <div class="section">
        <h3>Budget Details</h3>
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Budget Amount</th>
                    <th>Actual Amount</th>
                    <th>Variance</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${data.budget.items.map((item: any) => `
                    <tr>
                        <td>${item.category}</td>
                        <td>${item.description}</td>
                        <td>$${item.budgetAmount.toLocaleString()}</td>
                        <td>$${item.actualAmount.toLocaleString()}</td>
                        <td>$${(item.actualAmount - item.budgetAmount).toLocaleString()}</td>
                        <td>${item.status}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    ` : ''}
    
    ${data.reportType === 'schedule' || data.reportType === 'overview' ? `
    <div class="section">
        <h3>Schedule Details</h3>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Scene</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Cast</th>
                </tr>
            </thead>
            <tbody>
                ${data.schedule.items.map((item: any) => `
                    <tr>
                        <td>${new Date(item.date).toLocaleDateString()}</td>
                        <td>${item.scene}</td>
                        <td>${item.location}</td>
                        <td>${item.status}</td>
                        <td>${item.cast.join(', ')}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    ` : ''}
    
    <div class="section">
        <h3>Cast & Crew Summary</h3>
        <p>Total Team Members: ${data.castCrew.length}</p>
        <p>Cast Members: ${data.castCrew.filter((m: any) => m.type === 'cast').length}</p>
        <p>Crew Members: ${data.castCrew.filter((m: any) => m.type === 'crew').length}</p>
    </div>
</body>
</html>
    `;
  };

  const generateCSVContent = (data: any) => {
    let csvContent = `${data.reportType.toUpperCase()} REPORT\n`;
    csvContent += `Generated,${new Date(data.generatedAt).toLocaleString()}\n`;
    csvContent += `Project,${data.project ? data.project.title : 'All Projects'}\n\n`;
    
    csvContent += `SUMMARY METRICS\n`;
    csvContent += `Total Budget,$${data.budget.totalBudget.toLocaleString()}\n`;
    csvContent += `Total Spent,$${data.budget.totalSpent.toLocaleString()}\n`;
    csvContent += `Budget Utilization,${((data.budget.totalSpent / data.budget.totalBudget) * 100).toFixed(1)}%\n`;
    csvContent += `Schedule Progress,${((data.schedule.completedScenes / data.schedule.totalScenes) * 100).toFixed(1)}%\n\n`;
    
    if (data.reportType === 'budget' || data.reportType === 'overview') {
      csvContent += `BUDGET DETAILS\n`;
      csvContent += `Category,Description,Budget Amount,Actual Amount,Variance,Status\n`;
      data.budget.items.forEach((item: any) => {
        csvContent += `${item.category},${item.description},$${item.budgetAmount},$${item.actualAmount},$${item.actualAmount - item.budgetAmount},${item.status}\n`;
      });
      csvContent += `\n`;
    }
    
    if (data.reportType === 'schedule' || data.reportType === 'overview') {
      csvContent += `SCHEDULE DETAILS\n`;
      csvContent += `Date,Scene,Location,Status,Cast\n`;
      data.schedule.items.forEach((item: any) => {
        csvContent += `${new Date(item.date).toLocaleDateString()},${item.scene},${item.location},${item.status},"${item.cast.join(', ')}"\n`;
      });
    }
    
    return csvContent;
  };

  const generateCallSheet = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysSchedule = scheduleItems.filter(item => item.date === today);
    
    if (todaysSchedule.length === 0) {
      alert('No schedule items for today');
      return;
    }

    const callSheetContent = `
CALL SHEET - ${new Date().toLocaleDateString()}

WEATHER: Sunny, 75°F

TODAY'S SCHEDULE:
${todaysSchedule.map(item => `
SCENE: ${item.scene}
TIME: ${item.time}
LOCATION: ${item.location}
CAST: ${item.cast.join(', ')}
CREW: ${item.crew.join(', ')}
NOTES: ${item.notes || 'N/A'}
---
`).join('')}

GENERAL INFORMATION:
- Please arrive 15 minutes before your call time
- Bring proper identification
- Mobile phones on silent during filming
- Catering will be available on location

EMERGENCY CONTACT: Production Office - (555) 123-4567
    `;

    const blob = new Blob([callSheetContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `call-sheet-${today}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    
    alert('Call sheet generated and downloaded successfully!');
  };

  const emailReport = () => {
    const reportData = generateReportData();
    const subject = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report - ${new Date().toLocaleDateString()}`;
    const body = `Please find the attached ${reportType} report for ${reportData.project ? reportData.project.title : 'all projects'}.

Summary:
- Total Budget: $${reportData.budget.totalBudget.toLocaleString()}
- Total Spent: $${reportData.budget.totalSpent.toLocaleString()}
- Budget Utilization: ${((reportData.budget.totalSpent / reportData.budget.totalBudget) * 100).toFixed(1)}%
- Schedule Progress: ${((reportData.schedule.completedScenes / reportData.schedule.totalScenes) * 100).toFixed(1)}%

Best regards,
Production Management Team`;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleSceneCallSheet = (scene: ScheduleItem) => {
    setSelectedScene(scene);
    setShowSceneCallSheet(true);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate comprehensive production reports and call sheets</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button
            onClick={generateCallSheet}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors justify-center"
          >
            <Calendar className="h-4 w-4" />
            <span>Generate Call Sheet</span>
          </button>
          <button
            onClick={generatePDFReport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors justify-center"
          >
            <Download className="h-4 w-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Budget Utilization</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{budgetUtilization.toFixed(1)}%</p>
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

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Schedule Progress</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{scheduleProgress.toFixed(1)}%</p>
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

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">${totalSpent.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">of ${totalBudget.toLocaleString()} budget</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{castCrew.length}</p>
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

      {/* Scene Call Sheets Section */}
      {reportType === 'schedule' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Individual Scene Call Sheets</h3>
            <p className="text-sm text-gray-600">
              Generate call sheets for specific scenes
            </p>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="space-y-3">
              {filteredScheduleItems.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{item.scene}</div>
                    <div className="text-sm text-gray-600">
                      {item.location} - {new Date(item.date).toLocaleDateString()} at {item.time}
                    </div>
                    <div className="text-sm text-gray-500">{item.notes || 'No description'}</div>
                  </div>
                  <button
                    onClick={() => handleSceneCallSheet(item)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Film className="h-4 w-4" />
                    <span>Scene Call Sheet</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Report Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Report Preview</h3>
          <p className="text-sm text-gray-600">
            {reportTypes.find(type => type.id === reportType)?.description}
          </p>
        </div>
        
        <div className="p-4 sm:p-6">
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
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Report Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={generatePDFReport}
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FileText className="h-6 w-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-600 text-center">Export HTML</span>
          </button>
          <button 
            onClick={generateExcelReport}
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <FileSpreadsheet className="h-6 w-6 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-600 text-center">Export CSV</span>
          </button>
          <button 
            onClick={generateCallSheet}
            className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <Calendar className="h-6 w-6 text-yellow-600 mb-2" />
            <span className="text-sm font-medium text-yellow-600 text-center">Call Sheet</span>
          </button>
          <button 
            onClick={emailReport}
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Mail className="h-6 w-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-600 text-center">Email Report</span>
          </button>
        </div>
      </div>

      {/* Scene Call Sheet Modal */}
      {showSceneCallSheet && selectedScene && (
        <SceneCallSheet
          scheduleItem={selectedScene}
          project={projects.find(p => p.id === selectedScene.projectId)}
          onClose={() => {
            setShowSceneCallSheet(false);
            setSelectedScene(null);
          }}
        />
      )}
    </div>
  );
};

export default Reports;
