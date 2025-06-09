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

export interface adminPayload {
  admin?: Admin;
  token?: string;
  error?: string;
  id?: string;
}

export interface taskState {
  tasks: Task[];
  filteredTasks: Task[];
  isLoading: boolean;
  error: null;
}

export interface taskPayload {
  isLoading: boolean;
  searchTerm: string;
  _id?: string;
  id: string;
  priority: string;
  status: string;
}

export interface userPayload {
  includes(_id: string | undefined): unknown;
  count?: null | [];
  _id?: string;

  role?: string;
  forEach(arg0: (item: { count: number; month: string }) => void): unknown;
  user?: User;
  error?: string;
}

export interface authState {
  adminData: Admin | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface userState {
  userData: User[] | null;
  isLoading: boolean;
  error: string | null;
  count: number | null;
}

export interface Admin {
  _id?: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  data: {
    admin: Admin;
    token: string;
  };
  statusCode: number;
}

export interface userInfo {
  activeUsers: string;
  churnRate: string;
  change:{
    activeUsers:{change:string,trend:string},
    churnRate:{change:string,trend:string},
    newUser:{change:string,trend:string},
    totalUsers:{change:string,trend:string}
  };
  newUser: string;
  totalUsers: string;
}

export interface Task {
  _id: string;
  assignTo?: {
    name: string;
    _id: string;
  };
  createdAt: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "not-started" | "in-progress" | "completed";
  title: string;
  updatedAt: string;
  userId: string;
}

export interface TaskInput {
  title: string;
  description: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  status: "not-started" | "in-progress" | "completed";
}