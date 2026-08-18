export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  avatarUrl: string;
  batch?: string;
  grade?: string;
  subjectSpecialization?: string; // For faculty: e.g., 'Senior Physics Faculty'
  xp: number;
  streak: number;
  rollNumber?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export type CurrentUser = User;
