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

export interface taskState  {
  tasks: Task[],
  isLoading:boolean,
  error:null
}


export interface taskPayload {
  isLoading:boolean
}

  export interface userPayload {
    includes(_id: string | undefined): unknown;
    count?: null | [];
    _id?:string;
    role?:string;
    forEach(arg0: (item: { count: number; month: string; }) => void): unknown;
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
    count:number | null;
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
    statusCode:number
  }
  
  export interface Task {
    _id: string;
    assignTo: string;
    createdAt: string;
    description: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    status: 'not-started' | 'in-progress' | 'completed';
    title: string;
    updatedAt: string;
    userId: string;
  }