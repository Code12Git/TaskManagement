import {  searchTerm, Task } from "@/types"
import { ADD_TASK_FAILURE, ADD_TASK_REQUEST, ADD_TASK_SUCCESS, DELETE_TASK_FAILURE, DELETE_TASK_REQUEST, DELETE_TASK_SUCCESS, FILTERED_TASKS_FAILURE, FILTERED_TASKS_REQUEST, FILTERED_TASKS_SUCCESS, GET_TASK_FAILURE, GET_TASK_REQUEST, GET_TASK_SUCCESS, GET_TASKS_FAILURE, GET_TASKS_REQUEST, GET_TASKS_SUCCESS, UPDATE_TASK_FAILURE, UPDATE_TASK_REQUEST, UPDATE_TASK_SUCCESS } from "../actionTypes/actionTypes"
import { privateRequest} from "@/helpers/axios"
import { Dispatch } from "redux";

export const create = (data: Task) => async (dispatch: Dispatch) => {
    dispatch({ type: ADD_TASK_REQUEST });
  
    try {
      const response = await privateRequest.post('/tasks', data); 
      const task = response.data;
      dispatch({ type: ADD_TASK_SUCCESS, payload: task });
    } catch (err) {
        const error = err as { response: { data: { code: { message: string } } } };
        dispatch({
        type: ADD_TASK_FAILURE,
        payload: error.response.data.code.message|| 'Something went wrong',
      });
    }
  };

export const deleteOne = (id:string) => async (dispatch: Dispatch) =>  {
    dispatch({type:DELETE_TASK_REQUEST})
    try{
        await privateRequest.delete(`/tasks/${id}`); 
        dispatch({ type: DELETE_TASK_SUCCESS, payload: id });
    }catch(err){
        const error = err as { response: { data: { code: { message: string } } } };
        dispatch({type:DELETE_TASK_FAILURE, payload: error.response.data.code.message|| 'Something went wrong',})
    }
}

export const update= (data:Task,id:string) => async (dispatch:Dispatch) => {
    dispatch({type:UPDATE_TASK_REQUEST,payload:{id:id,task:data}})
    try{
        const updatedTask = await privateRequest.put(`/tasks/${id}`,id)
        dispatch({type:UPDATE_TASK_SUCCESS,payload:updatedTask})
    }catch(err){
        const error = err as { response: { data: { code: { message: string } } } };
        dispatch({type:UPDATE_TASK_FAILURE,payload:error.response.data.code.message || "Something went wrong"})
    }
}

export const get = () =>async (dispatch:Dispatch) => {
    dispatch({type:GET_TASK_REQUEST})
    try{
        const getTask = await privateRequest.get(`/tasks`)
        console.log(getTask)
        dispatch({type:GET_TASK_SUCCESS,payload:getTask.data.data})
    }catch(err){
        const error = err as {response : {data: {code:{message:string}}}}
        dispatch({type:GET_TASK_FAILURE,payload:error.response.data.code.message || "Something went wrong"})
    }
}

// taskAction.ts
export const getAll = () => async (dispatch: Dispatch) => {
    dispatch({ type: GET_TASKS_REQUEST });
    try {
      const { data } = await privateRequest.get('/tasks/allTasks');
      console.log(data)
      
       dispatch({ 
        type: GET_TASKS_SUCCESS, 
        payload: Array.isArray(data) ? data : data.data || [] 
      });
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      dispatch({ 
        type: GET_TASKS_FAILURE, 
        payload: error.response?.data?.message || "Failed to fetch tasks" 
      });
    }
  };

  export const filteredTask = (searchTerm: searchTerm) => async (dispatch: Dispatch) => {
    dispatch({ type: FILTERED_TASKS_REQUEST });
    try {
      dispatch({ 
        type: FILTERED_TASKS_SUCCESS,
        payload:searchTerm
      });
      
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      dispatch({ 
        type: FILTERED_TASKS_FAILURE, 
        payload: error.response?.data?.message || "Failed to filter tasks" 
      });
    }
  }