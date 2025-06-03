
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  role: string;
}

class AuthService {
  private currentUser: User | null = null;

  constructor() {
    this.initializeTestUsers();
    this.loadCurrentUser();
  }

  private initializeTestUsers() {
    const existingUsers = this.getUsers();
    if (existingUsers.length === 0) {
      const testUsers = [
        {
          id: '1',
          username: 'admin',
          email: 'admin@movieproduction.com',
          password: 'admin123',
          role: 'Production Manager',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          username: 'director',
          email: 'director@movieproduction.com',
          password: 'director123',
          role: 'Director',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          username: 'coordinator',
          email: 'coordinator@movieproduction.com',
          password: 'coord123',
          role: 'Production Coordinator',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('users', JSON.stringify(testUsers));
    }
  }

  private getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: any[]) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  private loadCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  login(credentials: LoginCredentials): boolean {
    const users = this.getUsers();
    const user = users.find((u: any) => 
      u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      this.currentUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      };
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      return true;
    }
    return false;
  }

  signup(signupData: SignupData): boolean {
    const users = this.getUsers();
    
    // Check if username or email already exists
    const existingUser = users.find((u: any) => 
      u.username === signupData.username || u.email === signupData.email
    );

    if (existingUser) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      ...signupData,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);

    // Auto login after signup
    this.currentUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    };
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    
    return true;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getTestCredentials() {
    return [
      { username: 'admin', password: 'admin123', role: 'Production Manager' },
      { username: 'director', password: 'director123', role: 'Director' },
      { username: 'coordinator', password: 'coord123', role: 'Production Coordinator' }
    ];
  }
}

export const authService = new AuthService();
