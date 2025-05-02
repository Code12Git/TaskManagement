export interface taskState {
    taskData:Task[],
    isLoading:boolean,
    error:boolean|null
}


export interface taskPayload {
    id?:string,
    taskData?:Task
}


export interface Task {

  title?: string;

  description: string;

  dueDate: string;

  priority?: 'low' | 'medium' | 'high';

  status?: 'not-started' | 'in-progress' | 'completed';

}

export type ErrorType =
  | {
      err: {
        message: string;
      };
    }
  | unknown;
