
import { storageService } from './storageService';

export const initializeSampleData = () => {
  // Check if data already exists
  if (storageService.getProjects().length > 0) return;

  // Sample Projects
  const sampleProjects = [
    {
      id: '1',
      title: 'Midnight Dreams',
      genre: 'Thriller',
      budget: 2500000,
      timeline: '6 months',
      status: 'in-production',
      description: 'A psychological thriller about dreams and reality',
      createdDate: '2024-01-15',
      teamMembers: ['John Director', 'Sarah Producer', 'Mike Cinematographer']
    },
    {
      id: '2',
      title: 'Summer Romance',
      genre: 'Romance',
      budget: 1800000,
      timeline: '4 months',
      status: 'pre-production',
      description: 'A heartwarming love story set in coastal California',
      createdDate: '2024-02-01',
      teamMembers: ['Lisa Director', 'Tom Producer']
    }
  ];

  // Sample Budget Items
  const sampleBudgetItems = [
    {
      id: '1',
      projectId: '1',
      category: 'Equipment',
      description: 'Camera rental for principal photography',
      budgetAmount: 50000,
      actualAmount: 45000,
      status: 'approved' as const,
      date: '2024-03-01'
    },
    {
      id: '2',
      projectId: '1',
      category: 'Cast',
      description: 'Lead actor compensation',
      budgetAmount: 200000,
      actualAmount: 200000,
      status: 'approved' as const,
      date: '2024-03-05'
    },
    {
      id: '3',
      projectId: '2',
      category: 'Location',
      description: 'Beach house rental',
      budgetAmount: 30000,
      actualAmount: 0,
      status: 'pending' as const,
      date: '2024-04-01'
    }
  ];

  // Sample Cast & Crew
  const sampleCastCrew = [
    {
      id: '1',
      name: 'Emma Stone',
      role: 'Lead Actress',
      type: 'cast' as const,
      contactInfo: {
        email: 'emma.stone@agency.com',
        phone: '+1-555-0101'
      },
      contractStatus: 'signed' as const,
      availability: ['2024-03-15', '2024-03-16', '2024-03-17'],
      dailyRate: 15000
    },
    {
      id: '2',
      name: 'Michael Johnson',
      role: 'Cinematographer',
      type: 'crew' as const,
      contactInfo: {
        email: 'mike.j@filmcrew.com',
        phone: '+1-555-0102'
      },
      contractStatus: 'signed' as const,
      availability: ['2024-03-15', '2024-03-16', '2024-03-17', '2024-03-18'],
      dailyRate: 2500
    },
    {
      id: '3',
      name: 'Sarah Director',
      role: 'Director',
      type: 'crew' as const,
      contactInfo: {
        email: 'sarah.d@production.com',
        phone: '+1-555-0103'
      },
      contractStatus: 'signed' as const,
      availability: ['2024-03-15', '2024-03-16', '2024-03-17', '2024-03-18', '2024-03-19'],
      dailyRate: 5000
    }
  ];

  // Sample Schedule Items
  const sampleScheduleItems = [
    {
      id: '1',
      projectId: '1',
      date: '2024-03-15',
      time: '08:00',
      scene: 'Opening Sequence - Dream Scene',
      location: 'Studio A - Soundstage',
      cast: ['Emma Stone'],
      crew: ['Michael Johnson', 'Sarah Director'],
      notes: 'Fog machine required for dream sequence',
      status: 'scheduled' as const
    },
    {
      id: '2',
      projectId: '1',
      date: '2024-03-16',
      time: '09:00',
      scene: 'Apartment Interior - Morning',
      location: 'Location House - Downtown',
      cast: ['Emma Stone'],
      crew: ['Michael Johnson', 'Sarah Director'],
      notes: 'Natural lighting preferred',
      status: 'scheduled' as const
    }
  ];

  // Sample Assets
  const sampleAssets = [
    {
      id: '1',
      name: 'RED Camera Package',
      category: 'equipment' as const,
      description: 'RED Epic-W 8K camera with lens kit',
      status: 'available' as const,
      cost: 45000
    },
    {
      id: '2',
      name: 'Period Costume Set',
      category: 'costumes' as const,
      description: '1920s era costumes for lead characters',
      status: 'in-use' as const,
      assignedTo: 'Emma Stone',
      assignedScene: 'Opening Sequence',
      cost: 8000
    },
    {
      id: '3',
      name: 'Vintage Car Prop',
      category: 'props' as const,
      description: '1965 Ford Mustang convertible',
      status: 'available' as const,
      cost: 12000
    }
  ];

  // Sample Locations
  const sampleLocations = [
    {
      id: '1',
      name: 'Downtown Loft',
      address: '123 Main St, Los Angeles, CA 90210',
      contactPerson: 'Property Manager - John Smith',
      permitStatus: 'approved' as const,
      cost: 5000,
      availability: ['2024-03-15', '2024-03-16', '2024-03-17'],
      notes: 'Parking available for 20 vehicles'
    },
    {
      id: '2',
      name: 'Malibu Beach House',
      address: '456 Ocean Dr, Malibu, CA 90265',
      contactPerson: 'Owner - Lisa Williams',
      permitStatus: 'pending' as const,
      cost: 8000,
      availability: ['2024-04-01', '2024-04-02', '2024-04-03']
    }
  ];

  // Sample Tasks
  const sampleTasks = [
    {
      id: '1',
      title: 'Finalize shooting script',
      description: 'Complete final revisions to the shooting script based on director feedback',
      assignedTo: 'Sarah Director',
      priority: 'high' as const,
      status: 'in-progress' as const,
      dueDate: '2024-03-10',
      projectId: '1',
      dependencies: []
    },
    {
      id: '2',
      title: 'Secure location permits',
      description: 'Obtain all necessary permits for downtown loft location',
      assignedTo: 'Tom Producer',
      priority: 'medium' as const,
      status: 'todo' as const,
      dueDate: '2024-03-12',
      projectId: '1',
      dependencies: []
    },
    {
      id: '3',
      title: 'Equipment delivery coordination',
      description: 'Coordinate delivery of camera equipment to set',
      assignedTo: 'Michael Johnson',
      priority: 'high' as const,
      status: 'in-progress' as const,
      dueDate: '2024-03-14',
      projectId: '1',
      dependencies: []
    }
  ];

  // Sample Messages
  const sampleMessages = [
    {
      id: '1',
      sender: 'Sarah Director',
      recipient: 'Production Team',
      subject: 'Script Changes for Tomorrow',
      content: 'Please note the script changes for tomorrow\'s shoot. Scene 15 has been moved to the end of the day.',
      timestamp: '2024-03-14T10:30:00Z',
      isRead: false,
      channel: 'production'
    },
    {
      id: '2',
      sender: 'Michael Johnson',
      recipient: 'Equipment Team',
      subject: 'Camera Setup Complete',
      content: 'Camera setup is complete and tested. Ready for first shot at 8:00 AM.',
      timestamp: '2024-03-14T15:45:00Z',
      isRead: true,
      channel: 'technical'
    }
  ];

  // Save all sample data
  sampleProjects.forEach(project => storageService.saveProject(project));
  sampleBudgetItems.forEach(item => storageService.saveBudgetItem(item));
  sampleCastCrew.forEach(member => storageService.saveCastCrewMember(member));
  sampleScheduleItems.forEach(item => storageService.saveScheduleItem(item));
  sampleAssets.forEach(asset => storageService.saveAsset(asset));
  sampleLocations.forEach(location => storageService.saveLocation(location));
  sampleTasks.forEach(task => storageService.saveTask(task));
  sampleMessages.forEach(message => storageService.saveMessage(message));
};
