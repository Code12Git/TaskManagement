// types/index.ts

export interface User {
  _id?: string;
  name: string;
  username: string;
  email: string;
  password: string; 
  role?: string; 
  createdAt?: string;
  updatedAt?: string;
}
export interface registerFormData {
  name:string;
  email:string;
  username:string;
  password:string;
}
export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthError {
  message: string;
  statusCode?: number;
}

export interface userState {
  userData: User | null;  // Changed from User[] to User since auth deals with single user
  isLoading: boolean;
  error: string | null;   // Changed from boolean to string for error messages
  isAuthenticated: boolean;
  token: string | null;
}

export interface UserCredentials {
  username: string;
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user:User
  token: string;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
      code?: {
        message?: string;
      };
    };
  };
  message?: string;
}

export interface userPayload {
  user?: User;
  token?: string;
  error?: string;
  id?: string;
}

// Your existing task interfaces
export interface Task {
  title?: string;
  description: string;
  dueDate: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'not-started' | 'in-progress' | 'completed';
}

export interface taskState {
  taskData: Task[];
  isLoading: boolean;
  error: string | null;  // Changed to string for consistency
}

export interface taskPayload {
  id?: string;
  taskData?: Task;
}

export type ErrorType = 
  | {
      err: {
        message: string;
      };
    }
  | unknown;