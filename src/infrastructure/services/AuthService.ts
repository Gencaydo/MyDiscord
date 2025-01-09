interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  username: string;
  avatar: string;
}

export class AuthService {
  private mockUsers = [
    {
      id: '1',
      email: 'test@test.com',
      password: 'password123',
      username: 'Test User',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1'
    }
  ];

  async login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    const user = this.mockUsers.find(u => u.email === credentials.email && u.password === credentials.password);
    
    if (user) {
      const token = `fake-jwt-${Math.random().toString(36).substring(7)}`;
      const { password, ...userWithoutPassword } = user;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      return { token, user: userWithoutPassword };
    }
    
    throw new Error('Invalid credentials');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
} 