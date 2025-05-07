import { Dispatch } from 'redux';
import { privateRequest } from '@/helpers/axios';
import { 
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  ASSIGN_USERS_REQUEST,
  ASSIGN_USERS_SUCCESS,
  ASSIGN_USERS_FAILURE
} from '../actionTypes/actionTypes'
import { AuthResponse } from '@/types';
import { ApiError } from '@/types';
import toast from 'react-hot-toast'

export const fetchUser = () => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_USERS_REQUEST });
  
  try {
    const response = await privateRequest.get<AuthResponse>('/user');
    console.log(response)
    dispatch({ 
      type: FETCH_USERS_SUCCESS, 
      payload:response.data.data
    });
    return response.data;
  } catch (err) {
    const error = err as ApiError;
    dispatch({
      type: FETCH_USERS_FAILURE,
      payload: error.response?.data?.code?.message || 
              error.response?.data?.message || 
              error.message || 
              'Users Fetching failed'
    });
    toast.error("Error Fetching User Successfully")
  }
};


export const assignUser = (userId:string,taskId:string) => async (dispatch: Dispatch) => {
  dispatch({ type: ASSIGN_USERS_REQUEST });
   console.log("UserId:",userId,"TaskId",taskId) 
  try {
     const res = await privateRequest.post<AuthResponse>('/user/assign',{userId,taskId});
    dispatch({ 
      type: ASSIGN_USERS_SUCCESS, 
    });
    console.log(res)
    toast.success('User Assigned Successfully')
  } catch (err) {
    const error = err as ApiError;
    dispatch({
      type: ASSIGN_USERS_FAILURE,
      payload: error.response?.data?.code?.message || 
              error.response?.data?.message || 
              error.message || 
              'Users Fetching failed'
    });
    toast.error("Error Fetching User Successfully")
  }
};

