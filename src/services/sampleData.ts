
import { storageService, Project, BudgetItem, CastCrewMember, ScheduleItem, Asset, Location, Task, Message } from './storageService';

export const initializeSampleData = () => {
  // Check if data already exists
  const existingProjects = storageService.getProjects();
  if (existingProjects.length > 0) {
    return; // Data already exists, don't overwrite
  }

  // Sample Projects
  const sampleProjects: Project[] = [
    {
      id: '1',
      title: 'The Dark Knight Returns',
      genre: 'Action',
      budget: 15000000,
      timeline: '8 months',
      status: 'active',
      description: 'A superhero thriller about Batman returning to fight crime in Gotham City.',
      createdDate: new Date().toISOString(),
      teamMembers: ['1', '2', '3']
    },
    {
      id: '2',
      title: 'Summer Romance',
      genre: 'Romance',
      budget: 5000000,
      timeline: '4 months',
      status: 'planning',
      description: 'A heartwarming love story set during summer vacation.',
      createdDate: new Date(Date.now() - 86400000).toISOString(),
      teamMembers: ['4', '5']
    },
    {
      id: '3',
      title: 'Space Odyssey',
      genre: 'Sci-Fi',
      budget: 25000000,
      timeline: '12 months',
      status: 'active',
      description: 'An epic space adventure exploring distant galaxies.',
      createdDate: new Date(Date.now() - 172800000).toISOString(),
      teamMembers: ['6', '7', '8']
    }
  ];

  // Sample Cast & Crew
  const sampleCastCrew: CastCrewMember[] = [
    {
      id: '1',
      name: 'Christian Bale',
      role: 'Batman/Bruce Wayne',
      type: 'cast',
      contactInfo: { email: 'christian.bale@agency.com', phone: '+1-555-0101' },
      contractStatus: 'signed',
      availability: [],
      dailyRate: 50000
    },
    {
      id: '2',
      name: 'Christopher Nolan',
      role: 'Director',
      type: 'crew',
      contactInfo: { email: 'c.nolan@production.com', phone: '+1-555-0102' },
      contractStatus: 'signed',
      availability: [],
      dailyRate: 25000
    },
    {
      id: '3',
      name: 'Hans Zimmer',
      role: 'Composer',
      type: 'crew',
      contactInfo: { email: 'hans.zimmer@music.com', phone: '+1-555-0103' },
      contractStatus: 'pending',
      availability: [],
      dailyRate: 15000
    },
    {
      id: '4',
      name: 'Emma Stone',
      role: 'Lead Actress',
      type: 'cast',
      contactInfo: { email: 'emma.stone@agency.com', phone: '+1-555-0104' },
      contractStatus: 'signed',
      availability: [],
      dailyRate: 30000
    },
    {
      id: '5',
      name: 'Ryan Gosling',
      role: 'Lead Actor',
      type: 'cast',
      contactInfo: { email: 'ryan.gosling@agency.com', phone: '+1-555-0105' },
      contractStatus: 'signed',
      availability: [],
      dailyRate: 35000
    },
    {
      id: '6',
      name: 'Denis Villeneuve',
      role: 'Director',
      type: 'crew',
      contactInfo: { email: 'd.villeneuve@production.com', phone: '+1-555-0106' },
      contractStatus: 'signed',
      availability: [],
      dailyRate: 30000
    },
    {
      id: '7',
      name: 'Timothée Chalamet',
      role: 'Lead Actor',
      type: 'cast',
      contactInfo: { email: 'timothee.chalamet@agency.com', phone: '+1-555-0107' },
      contractStatus: 'signed',
      availability: [],
      dailyRate: 25000
    },
    {
      id: '8',
      name: 'Roger Deakins',
      role: 'Cinematographer',
      type: 'crew',
      contactInfo: { email: 'roger.deakins@production.com', phone: '+1-555-0108' },
      contractStatus: 'signed',
      availability: [],
      dailyRate: 20000
    }
  ];

  // Sample Budget Items
  const sampleBudgetItems: BudgetItem[] = [
    {
      id: '1',
      projectId: '1',
      category: 'Cast & Crew',
      description: 'Lead Actor Payment - Christian Bale',
      budgetAmount: 2000000,
      actualAmount: 2000000,
      status: 'approved',
      date: new Date().toISOString()
    },
    {
      id: '2',
      projectId: '1',
      category: 'Equipment',
      description: 'Camera Equipment Rental',
      budgetAmount: 500000,
      actualAmount: 450000,
      status: 'approved',
      date: new Date().toISOString()
    },
    {
      id: '3',
      projectId: '1',
      category: 'Locations',
      description: 'Gotham City Set Construction',
      budgetAmount: 3000000,
      actualAmount: 2800000,
      status: 'approved',
      date: new Date().toISOString()
    },
    {
      id: '4',
      projectId: '2',
      category: 'Cast & Crew',
      description: 'Lead Actress Payment - Emma Stone',
      budgetAmount: 1000000,
      actualAmount: 0,
      status: 'pending',
      date: new Date().toISOString()
    },
    {
      id: '5',
      projectId: '3',
      category: 'Props & Costumes',
      description: 'Space Suit Design and Creation',
      budgetAmount: 800000,
      actualAmount: 750000,
      status: 'approved',
      date: new Date().toISOString()
    }
  ];

  // Sample Schedule Items
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 86400000);
  const dayAfter = new Date(today.getTime() + 172800000);

  const sampleScheduleItems: ScheduleItem[] = [
    {
      id: '1',
      projectId: '1',
      date: today.toISOString().split('T')[0],
      time: '08:00',
      scene: 'Scene 15 - Batman vs Joker Rooftop Fight',
      location: 'Warner Bros Studio - Stage 5',
      cast: ['1'],
      crew: ['2', '8'],
      notes: 'Night shoot, safety coordinator required',
      status: 'in-progress'
    },
    {
      id: '2',
      projectId: '1',
      date: tomorrow.toISOString().split('T')[0],
      time: '06:00',
      scene: 'Scene 22 - Wayne Manor Interior',
      location: 'Wayne Manor Set',
      cast: ['1'],
      crew: ['2'],
      notes: 'Early morning shoot for golden hour lighting',
      status: 'scheduled'
    },
    {
      id: '3',
      projectId: '2',
      date: dayAfter.toISOString().split('T')[0],
      time: '10:00',
      scene: 'Scene 5 - Beach Walk Romance',
      location: 'Malibu Beach',
      cast: ['4', '5'],
      crew: ['6'],
      notes: 'Weather dependent, backup indoor location available',
      status: 'scheduled'
    },
    {
      id: '4',
      projectId: '3',
      date: new Date(today.getTime() - 86400000).toISOString().split('T')[0],
      time: '14:00',
      scene: 'Scene 8 - Spaceship Interior',
      location: 'Sony Studios - Stage 12',
      cast: ['7'],
      crew: ['6', '8'],
      notes: 'Green screen work, VFX team on standby',
      status: 'completed'
    }
  ];

  // Sample Assets
  const sampleAssets: Asset[] = [
    {
      id: '1',
      name: 'Batmobile',
      category: 'props',
      description: 'Main vehicle for Batman scenes',
      status: 'in-use',
      assignedTo: 'Stunt Team',
      assignedScene: 'Scene 15',
      cost: 500000
    },
    {
      id: '2',
      name: 'Batman Costume',
      category: 'costumes',
      description: 'Primary Batman suit',
      status: 'in-use',
      assignedTo: 'Christian Bale',
      assignedScene: 'Scene 15',
      cost: 100000
    },
    {
      id: '3',
      name: 'RED Camera Package',
      category: 'equipment',
      description: 'Primary camera equipment',
      status: 'available',
      cost: 150000
    },
    {
      id: '4',
      name: 'Space Helmet',
      category: 'props',
      description: 'Astronaut helmet for space scenes',
      status: 'in-use',
      assignedTo: 'Timothée Chalamet',
      assignedScene: 'Scene 8',
      cost: 25000
    },
    {
      id: '5',
      name: 'Lighting Rig',
      category: 'equipment',
      description: 'Professional lighting equipment',
      status: 'maintenance',
      cost: 75000
    }
  ];

  // Sample Locations
  const sampleLocations: Location[] = [
    {
      id: '1',
      name: 'Warner Bros Studio',
      address: '4000 Warner Boulevard, Burbank, CA 91522',
      contactPerson: 'Studio Manager',
      permitStatus: 'approved',
      cost: 50000,
      availability: [],
      notes: 'Full studio access, parking available'
    },
    {
      id: '2',
      name: 'Malibu Beach',
      address: 'Malibu, CA 90265',
      contactPerson: 'Parks Department',
      permitStatus: 'approved',
      cost: 15000,
      availability: [],
      notes: 'Weather dependent, tide schedule important'
    },
    {
      id: '3',
      name: 'Downtown LA Rooftop',
      address: '123 Main St, Los Angeles, CA 90012',
      contactPerson: 'Building Owner',
      permitStatus: 'pending',
      cost: 25000,
      availability: [],
      notes: 'Safety equipment required, insurance needed'
    },
    {
      id: '4',
      name: 'Sony Studios',
      address: '10202 W Washington Blvd, Culver City, CA 90232',
      contactPerson: 'Location Manager',
      permitStatus: 'approved',
      cost: 60000,
      availability: [],
      notes: 'Green screen stages available'
    }
  ];

  // Sample Tasks
  const sampleTasks: Task[] = [
    {
      id: '1',
      title: 'Finalize VFX shots for Scene 8',
      description: 'Complete post-production work on space scenes',
      assignedTo: 'VFX Team',
      priority: 'high',
      status: 'in-progress',
      dueDate: tomorrow.toISOString().split('T')[0],
      projectId: '3'
    },
    {
      id: '2',
      title: 'Schedule costume fittings',
      description: 'Organize final costume fittings for all cast members',
      assignedTo: 'Costume Department',
      priority: 'medium',
      status: 'todo',
      dueDate: dayAfter.toISOString().split('T')[0],
      projectId: '1'
    },
    {
      id: '3',
      title: 'Secure rooftop location permits',
      description: 'Get all necessary permits for downtown rooftop shooting',
      assignedTo: 'Location Manager',
      priority: 'high',
      status: 'in-progress',
      dueDate: today.toISOString().split('T')[0],
      projectId: '1'
    }
  ];

  // Sample Messages
  const sampleMessages: Message[] = [
    {
      id: '1',
      sender: 'Christopher Nolan',
      recipient: 'Production Team',
      subject: 'Schedule Change for Tomorrow',
      content: 'Due to weather conditions, we need to move the rooftop scene to Stage 5. Please inform all cast and crew.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isRead: false,
      channel: 'production'
    },
    {
      id: '2',
      sender: 'Costume Department',
      recipient: 'Christian Bale',
      subject: 'Costume Fitting Reminder',
      content: 'Reminder: Costume fitting scheduled for tomorrow at 2 PM in Trailer 3.',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      isRead: true,
      channel: 'cast'
    },
    {
      id: '3',
      sender: 'VFX Supervisor',
      recipient: 'Denis Villeneuve',
      subject: 'VFX Progress Update',
      content: 'Space sequence VFX are 80% complete. Expecting final delivery by end of week.',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      isRead: false,
      channel: 'production'
    }
  ];

  // Save all sample data
  sampleProjects.forEach(project => storageService.saveProject(project));
  sampleCastCrew.forEach(member => storageService.saveCastCrewMember(member));
  sampleBudgetItems.forEach(item => storageService.saveBudgetItem(item));
  sampleScheduleItems.forEach(item => storageService.saveScheduleItem(item));
  sampleAssets.forEach(asset => storageService.saveAsset(asset));
  sampleLocations.forEach(location => storageService.saveLocation(location));
  sampleTasks.forEach(task => storageService.saveTask(task));
  sampleMessages.forEach(message => storageService.saveMessage(message));

  console.log('Sample data initialized successfully!');
};
