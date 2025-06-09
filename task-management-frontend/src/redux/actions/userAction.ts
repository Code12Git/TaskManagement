import { Dispatch } from 'redux';
import { privateRequest } from '@/helpers/axios';
import { 
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  ASSIGN_USERS_REQUEST,
  ASSIGN_USERS_SUCCESS,
  ASSIGN_USERS_FAILURE,
  UPDATE_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS
} from '../actionTypes/actionTypes'
import { AuthResponse, User } from '@/types';
import { ApiError } from '@/types';
import toast from 'react-hot-toast'

export const fetchUser = () => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_USERS_REQUEST });
  
  try {
    const response = await privateRequest.get('/user');
    console.log(response.data)
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
  }
};


export const assignUser = (userId:string,taskId:string) => async (dispatch: Dispatch) => {
  dispatch({ type: ASSIGN_USERS_REQUEST });
  try {
    await privateRequest.post<AuthResponse>('/user/assign',{userId,taskId});
  
    dispatch({ 
      type: ASSIGN_USERS_SUCCESS, 
    });
    toast.success('You assigned a task to another user')
  } catch (err) {
    const error = err as ApiError;
    dispatch({
      type: ASSIGN_USERS_FAILURE,
      payload: error.response?.data?.code?.message || 
              error.response?.data?.message || 
              error.message || 
              'Users Fetching failed'
    });
  }
};

export const updatedUser = (userId: string, userData: Partial<User>) => async (dispatch: Dispatch) => {
  dispatch({ type: UPDATE_USER_REQUEST });

  try {
    await privateRequest.put<AuthResponse>(`/user/${userId}`, userData);

    dispatch({
      type: UPDATE_USER_SUCCESS,
      payload: {
        userId,
        userData,
      },
    });

    const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
    const updatedLocalUser = { ...existingUser, ...userData };
    localStorage.setItem("user", JSON.stringify(updatedLocalUser));

    toast.success("User Updated Successfully");
  } catch (err) {
    const error = err as ApiError;
    dispatch({
      type: UPDATE_USER_FAILURE,
      payload:
        error.response?.data?.code?.message ||
        error.response?.data?.message ||
        error.message ||
        "Error Updating User",
    });
    toast.error("User cannot be updated Successfully!");
  }
};
