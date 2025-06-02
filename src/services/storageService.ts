
export interface Project {
  id: string;
  title: string;
  genre: string;
  budget: number;
  timeline: string;
  status: string;
  description?: string;
  createdDate: string;
  teamMembers: string[];
}

export interface BudgetItem {
  id: string;
  projectId: string;
  category: string;
  description: string;
  budgetAmount: number;
  actualAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface CastCrewMember {
  id: string;
  name: string;
  role: string;
  type: 'cast' | 'crew';
  contactInfo: {
    email: string;
    phone: string;
  };
  contractStatus: 'pending' | 'signed' | 'expired';
  availability: string[];
  dailyRate: number;
}

export interface ScheduleItem {
  id: string;
  projectId: string;
  date: string;
  time: string;
  scene: string;
  location: string;
  cast: string[];
  crew: string[];
  notes?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

export interface Asset {
  id: string;
  name: string;
  category: 'props' | 'costumes' | 'equipment';
  description: string;
  status: 'available' | 'in-use' | 'maintenance';
  assignedTo?: string;
  assignedScene?: string;
  cost: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  contactPerson: string;
  permitStatus: 'pending' | 'approved' | 'expired';
  cost: number;
  availability: string[];
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: string;
  projectId: string;
}

export interface Message {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  channel?: string;
}

class StorageService {
  private getFromStorage<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Projects
  getProjects(): Project[] {
    return this.getFromStorage<Project>('projects');
  }

  saveProject(project: Project): void {
    const projects = this.getProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    if (existingIndex >= 0) {
      projects[existingIndex] = project;
    } else {
      projects.push(project);
    }
    this.saveToStorage('projects', projects);
  }

  deleteProject(id: string): void {
    const projects = this.getProjects().filter(p => p.id !== id);
    this.saveToStorage('projects', projects);
  }

  // Budget
  getBudgetItems(): BudgetItem[] {
    return this.getFromStorage<BudgetItem>('budgetItems');
  }

  saveBudgetItem(item: BudgetItem): void {
    const items = this.getBudgetItems();
    const existingIndex = items.findIndex(i => i.id === item.id);
    if (existingIndex >= 0) {
      items[existingIndex] = item;
    } else {
      items.push(item);
    }
    this.saveToStorage('budgetItems', items);
  }

  deleteBudgetItem(id: string): void {
    const items = this.getBudgetItems().filter(i => i.id !== id);
    this.saveToStorage('budgetItems', items);
  }

  // Cast & Crew
  getCastCrew(): CastCrewMember[] {
    return this.getFromStorage<CastCrewMember>('castCrew');
  }

  saveCastCrewMember(member: CastCrewMember): void {
    const members = this.getCastCrew();
    const existingIndex = members.findIndex(m => m.id === member.id);
    if (existingIndex >= 0) {
      members[existingIndex] = member;
    } else {
      members.push(member);
    }
    this.saveToStorage('castCrew', members);
  }

  deleteCastCrewMember(id: string): void {
    const members = this.getCastCrew().filter(m => m.id !== id);
    this.saveToStorage('castCrew', members);
  }

  // Schedule
  getScheduleItems(): ScheduleItem[] {
    return this.getFromStorage<ScheduleItem>('scheduleItems');
  }

  saveScheduleItem(item: ScheduleItem): void {
    const items = this.getScheduleItems();
    const existingIndex = items.findIndex(i => i.id === item.id);
    if (existingIndex >= 0) {
      items[existingIndex] = item;
    } else {
      items.push(item);
    }
    this.saveToStorage('scheduleItems', items);
  }

  deleteScheduleItem(id: string): void {
    const items = this.getScheduleItems().filter(i => i.id !== id);
    this.saveToStorage('scheduleItems', items);
  }

  // Assets
  getAssets(): Asset[] {
    return this.getFromStorage<Asset>('assets');
  }

  saveAsset(asset: Asset): void {
    const assets = this.getAssets();
    const existingIndex = assets.findIndex(a => a.id === asset.id);
    if (existingIndex >= 0) {
      assets[existingIndex] = asset;
    } else {
      assets.push(asset);
    }
    this.saveToStorage('assets', assets);
  }

  deleteAsset(id: string): void {
    const assets = this.getAssets().filter(a => a.id !== id);
    this.saveToStorage('assets', assets);
  }

  // Locations
  getLocations(): Location[] {
    return this.getFromStorage<Location>('locations');
  }

  saveLocation(location: Location): void {
    const locations = this.getLocations();
    const existingIndex = locations.findIndex(l => l.id === location.id);
    if (existingIndex >= 0) {
      locations[existingIndex] = location;
    } else {
      locations.push(location);
    }
    this.saveToStorage('locations', locations);
  }

  deleteLocation(id: string): void {
    const locations = this.getLocations().filter(l => l.id !== id);
    this.saveToStorage('locations', locations);
  }

  // Tasks
  getTasks(): Task[] {
    return this.getFromStorage<Task>('tasks');
  }

  saveTask(task: Task): void {
    const tasks = this.getTasks();
    const existingIndex = tasks.findIndex(t => t.id === task.id);
    if (existingIndex >= 0) {
      tasks[existingIndex] = task;
    } else {
      tasks.push(task);
    }
    this.saveToStorage('tasks', tasks);
  }

  deleteTask(id: string): void {
    const tasks = this.getTasks().filter(t => t.id !== id);
    this.saveToStorage('tasks', tasks);
  }

  // Messages
  getMessages(): Message[] {
    return this.getFromStorage<Message>('messages');
  }

  saveMessage(message: Message): void {
    const messages = this.getMessages();
    messages.push(message);
    this.saveToStorage('messages', messages);
  }

  deleteMessage(id: string): void {
    const messages = this.getMessages().filter(m => m.id !== id);
    this.saveToStorage('messages', messages);
  }
}

export const storageService = new StorageService();
