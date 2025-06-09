import { taskPayload, taskState } from "@/types";
import { DELETE_TASKS_REQUEST, DELETE_TASKS_SUCCESS, FILTERED_TASKS_FAILURE, FILTERED_TASKS_REQUEST, FILTERED_TASKS_SUCCESS, GET_TASKS_FAILURE, GET_TASKS_REQUEST, GET_TASKS_SUCCESS, SEARCH_TASKS_SUCCESS, UPDATE_TASK_FAILURE, UPDATE_TASK_REQUEST, UPDATE_TASK_SUCCESS } from "../actionTypes/actionTypes";

const initialState:taskState = {
    tasks:[],
    filteredTasks:[],
    isLoading:false,
    error:null
}
console.log("FilteredTask:",initialState.filteredTasks)

const taskReducer = (state = initialState, { type, payload }: { type: string; payload: taskPayload }) => {
    switch(type){
        case GET_TASKS_REQUEST:
        return {
            ...state,
            isLoading:false
        }
       case GET_TASKS_SUCCESS:
        return {
            ...state,
            tasks:payload,
            filteredTasks:[]
        }
       case GET_TASKS_FAILURE:
        return {
            ...state,
            isLoading:false,
            error:payload
        } 

        // UPDATE
    case UPDATE_TASK_REQUEST:
        return {
          ...state,
          isLoading: true,
          error: null,
        };
      case UPDATE_TASK_SUCCESS:
        console.log(payload);
        return {
          ...state,
          isLoading: false,
          tasks: state.tasks.map((task) =>
            task._id === payload._id ? payload : task
          ),
          error: null,
        };
      case UPDATE_TASK_FAILURE:
        return {
          ...state,
          isLoading: false,
          error: payload,
        };

        case DELETE_TASKS_REQUEST:
            return {
                ...state,
                isLoading:true
            }
        case DELETE_TASKS_SUCCESS:
            console.log(payload)
            return {
                ...state,
                isLoading:false,
                tasks: state.tasks.filter(task=>task._id !== payload.id),
                filteredTasks: state.filteredTasks.filter(task => task._id !== payload.id),
            }    
        
            case SEARCH_TASKS_SUCCESS:
                const normalizedSearchTerm = (payload.searchTerm || '').toLowerCase().replace(/\s+/g, '');
                console.log('Normalized search term:', normalizedSearchTerm ,state.filteredTasks);
                
                return {
                  ...state,
                  isLoading: false,
                  filteredTasks: normalizedSearchTerm 
                    ? state.tasks.filter(task => {
                        const normalizedTitle = task.title.toLowerCase().replace(/\s+/g, '');
                        const normalizedDescription = task.description.toLowerCase().replace(/\s+/g, '');
                        console.log(`Comparing: "${normalizedTitle}" with "${normalizedSearchTerm }"`);
                        return normalizedTitle.includes(normalizedSearchTerm ) || normalizedDescription.includes(normalizedSearchTerm );
                      })
                    : [],
                  error: null
                };
        case FILTERED_TASKS_REQUEST:
            return {
                ...state,
                isLoading:true
            }
            case FILTERED_TASKS_SUCCESS:
                const statusFilter = (payload.status || '').toLowerCase();
                const priorityFilter = (payload.priority || '').toLowerCase();
                
                return {
                    ...state,
                    isLoading: false,
                    filteredTasks: state.tasks.filter((task) => {
                        const taskStatus = task.status.toLowerCase();
                        const taskPriority = task.priority.toLowerCase();
                        
                        // If both filters are empty, return all tasks
                        if (!statusFilter && !priorityFilter) return true;
                        
                        // If status filter is provided but priority isn't
                        if (statusFilter && !priorityFilter) {
                            return taskStatus.includes(statusFilter);
                        }
                        
                        // If priority filter is provided but status isn't
                        if (!statusFilter && priorityFilter) {
                            return taskPriority.includes(priorityFilter);
                        }
                        console.log("Status Filter:",statusFilter,"Priority Filter:",priorityFilter,"Task Priority:",taskPriority,"Task Status:",taskStatus)
                        // If both filters are provided
                        return taskStatus.includes(statusFilter) && 
                               taskPriority.includes(priorityFilter);
                    }),
                    error: null
                };

        case FILTERED_TASKS_FAILURE:
            return {
                ...state,
                error:payload
            }    
        default : return state;
    }
}

export default taskReducer;