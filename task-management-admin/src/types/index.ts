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

  export interface userPayload {
    count?: null | [];
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
    _id?: string;
    name: string;
    username: string;
    email: string;
    password: string; 
    role?: string; 
    createdAt?: string;
    updatedAt?: string;
  }

  export interface userState {
    userData: User | null;  
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