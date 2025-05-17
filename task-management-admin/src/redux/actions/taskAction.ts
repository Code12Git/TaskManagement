import { Dispatch } from "redux";
import { GET_TASKS_FAILURE, GET_TASKS_REQUEST, GET_TASKS_SUCCESS } from "../actionTypes/actionTypes";
import { AuthResponse  } from '@/types/index';
import { ApiError } from '@/types/index';
import toast from 'react-hot-toast'
import { privateRequest } from "@/helpers/axios";

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
    
    