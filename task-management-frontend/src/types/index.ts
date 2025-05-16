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
  data:{
    user: User;
    token: string
  }
  statusCode:number;
}

export interface AuthError {
  message: string;
  statusCode?: number;
}

export interface authState {
  userData: User | null;  
  isLoading: boolean;
  error: string | null;   
  isAuthenticated: boolean;
  token: string | null;
}

export interface userState {
  users: User[];
  loading:boolean;
  error:null
}
export interface modalState{
  modalType:string;
  modalProps:boolean
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

export interface userDataPayload{
  user?:User
}

export interface  searchTerm {
  searchType:string
  status: string;
  priority: string;
  dueDate: string;
}
// Your existing task interfaces
export interface Task {
  _id?:string
  title?: string;
  description: string;
  dueDate: Date;
  priority?: 'low' | 'medium' | 'high';
  status?: 'not-started' | 'in-progress' | 'completed';
  assignedTo?:string;
  userId?:string
  assignTo?:string
}

export interface taskState {
  taskData: Task[];
  filteredData:Task[]
  isLoading: boolean;
  error: string | null;  // Changed to string for consistency
}

export interface taskPayload {
  id?: string;
  _id?:string;
  taskData?: Task;
  searchType?:string;
  status?:string;
  priority?:string;
  dueDate?:string;
  task?:string;
}

export type ErrorType = 
  | {
      err: {
        message: string;
      };
    }
  | unknown;