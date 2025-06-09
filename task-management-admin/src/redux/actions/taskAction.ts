import { Dispatch } from "redux";
import { DELETE_TASKS_FAILURE, DELETE_TASKS_REQUEST, DELETE_TASKS_SUCCESS, FILTERED_TASKS_FAILURE, FILTERED_TASKS_REQUEST, FILTERED_TASKS_SUCCESS, GET_TASKS_FAILURE, GET_TASKS_REQUEST, GET_TASKS_SUCCESS, SEARCH_TASKS_SUCCESS, UPDATE_TASK_FAILURE, UPDATE_TASK_REQUEST, UPDATE_TASK_SUCCESS } from "../actionTypes/actionTypes";
import { AuthResponse, Task  } from '@/types/index';
import { ApiError } from '@/types/index';
import toast from 'react-hot-toast'
import { privateRequest } from "@/helpers/axios";


export const filteredTasks = (searchTerm:string) => (dispatch:Dispatch) =>{
  try{
    dispatch({type:SEARCH_TASKS_SUCCESS,payload:{searchTerm:searchTerm}})
  }catch(err){
    const error = err as ApiError;
    console.log(error)
  }
}

export const filterTasks = (filtered:{priority:string,status:string}) => (dispatch:Dispatch) => {
  dispatch({type:FILTERED_TASKS_REQUEST})
  console.log(filtered)
  try{
    dispatch({type:FILTERED_TASKS_SUCCESS,payload:filtered})
  }catch(err){
    const error = err as ApiError;
        dispatch({
          type: FILTERED_TASKS_FAILURE,
          payload: error.response?.data?.code?.message || 
                  error.response?.data?.message || 
                  error.message || 
                  'Fetch Filtered Task Failed'
        });
        toast.error("Error Fetching filtered data Successfully")
  }
}

export const deleteTasks = (id:string) => async(dispatch:Dispatch) => {
  dispatch({type:DELETE_TASKS_REQUEST})
  console.log(id)
  try{
    await privateRequest.delete(`/tasks/${id}`)
    dispatch({type:DELETE_TASKS_SUCCESS,payload:{id:id}})
  }catch(err){
    const error = err as ApiError;
        dispatch({
          type: DELETE_TASKS_FAILURE,
          payload: error.response?.data?.code?.message || 
                  error.response?.data?.message || 
                  error.message || 
                  'Delete Task Failed'
        });
        toast.error("Error Deleting tasks Successfully")
      }
}



export const getAllTasks = () => async(dispatch:Dispatch) => {
    dispatch({type:GET_TASKS_REQUEST})
    try{
        const res = await privateRequest.get<AuthResponse>('/tasks/allTasks')
        console.log(res.data.data)
        dispatch({type:GET_TASKS_SUCCESS,payload:res.data.data})
    }catch (err) {
        const error = err as ApiError;
        dispatch({
          type: GET_TASKS_FAILURE,
          payload: error.response?.data?.code?.message || 
                  error.response?.data?.message || 
                  error.message || 
                  'Fetch Task Failed'
        });
        toast.error("Error Fetching tasks Successfully")
      }
};
    
export const update= (data:Task,id:string) => async (dispatch:Dispatch) => {
  dispatch({type:UPDATE_TASK_REQUEST})
  try{
      const updatedTask = await privateRequest.put(`/tasks/${id}`,data)
      dispatch({type:UPDATE_TASK_SUCCESS,payload:updatedTask.data.data})
  }catch(err){
      const error = err as { response: { data: { code: { message: string } } } };
      dispatch({type:UPDATE_TASK_FAILURE,payload:error.response.data.code.message || "Something went wrong"})
  }
}    