
import { authService } from './authService';

export type UserRole = 'Production Manager' | 'Director' | 'Assistant Director' | 'Production Coordinator' | 'Cast Member' | 'Crew Member';

export interface RolePermissions {
  dashboard: boolean;
  projects: boolean;
  budget: boolean;
  castCrew: boolean;
  schedule: boolean;
  tasks: boolean;
  assets: boolean;
  locations: boolean;
  communication: boolean;
  reports: boolean;
  feedback: boolean;
}

const rolePermissions: Record<UserRole, RolePermissions> = {
  'Production Manager': {
    dashboard: true,
    projects: true,
    budget: true,
    castCrew: true,
    schedule: true,
    tasks: true,
    assets: true,
    locations: true,
    communication: true,
    reports: true,
    feedback: true,
  },
  'Production Coordinator': {
    dashboard: false,
    projects: false,
    budget: false,
    castCrew: true,
    schedule: false,
    tasks: false,
    assets: true,
    locations: true,
    communication: true,
    reports: true,
    feedback: false,
  },
  'Assistant Director': {
    dashboard: false,
    projects: false,
    budget: false,
    castCrew: false,
    schedule: true,
    tasks: false,
    assets: false,
    locations: false,
    communication: true,
    reports: true,
    feedback: false,
  },
  'Director': {
    dashboard: true,
    projects: true,
    budget: true,
    castCrew: true,
    schedule: true,
    tasks: true,
    assets: true,
    locations: true,
    communication: true,
    reports: true,
    feedback: true,
  },
  'Cast Member': {
    dashboard: false,
    projects: false,
    budget: false,
    castCrew: false,
    schedule: false,
    tasks: false,
    assets: false,
    locations: false,
    communication: true,
    reports: true,
    feedback: true,
  },
  'Crew Member': {
    dashboard: false,
    projects: false,
    budget: false,
    castCrew: false,
    schedule: false,
    tasks: false,
    assets: false,
    locations: false,
    communication: true,
    reports: true,
    feedback: true,
  },
};

class RBACService {
  hasPermission(section: keyof RolePermissions): boolean {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return false;

    const userRole = currentUser.role as UserRole;
    const permissions = rolePermissions[userRole];
    
    return permissions ? permissions[section] : false;
  }

  getUserPermissions(): RolePermissions | null {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return null;

    const userRole = currentUser.role as UserRole;
    return rolePermissions[userRole] || null;
  }

  getAccessibleRoutes(): string[] {
    const permissions = this.getUserPermissions();
    if (!permissions) return [];

    const routes: string[] = [];
    
    if (permissions.dashboard) routes.push('/');
    if (permissions.projects) routes.push('/projects');
    if (permissions.budget) routes.push('/budget');
    if (permissions.castCrew) routes.push('/cast-crew');
    if (permissions.schedule) routes.push('/schedule');
    if (permissions.tasks) routes.push('/tasks');
    if (permissions.assets) routes.push('/assets');
    if (permissions.locations) routes.push('/locations');
    if (permissions.communication) routes.push('/communication');
    if (permissions.reports) routes.push('/reports');
    if (permissions.feedback) routes.push('/feedback');

    return routes;
  }

  canAccessRoute(route: string): boolean {
    const accessibleRoutes = this.getAccessibleRoutes();
    return accessibleRoutes.includes(route);
  }
}

export const rbacService = new RBACService();
