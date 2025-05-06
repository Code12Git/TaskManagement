import { Dispatch } from 'redux';
import { publicRequest } from '@/helpers/axios';
import { 
  REGISTER_REQUEST, 
  REGISTER_SUCCESS, 
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
} from '../actionTypes/actionTypes'
import { AuthResponse, UserCredentials } from '@/types';
import { ApiError } from '@/types';
import toast from 'react-hot-toast'

export const registerUser = (data: UserCredentials) => async (dispatch: Dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  
  try {
    const response = await publicRequest.post<AuthResponse>('/auth/register', data);
    dispatch({ 
      type: REGISTER_SUCCESS, 
      payload: {
        user: response.data.user,
        token: response.data.token
      }
    });
    toast.success("User Registered Successfully")
    return response.data;
  } catch (err) {
    const error = err as ApiError;
    dispatch({
      type: REGISTER_FAILURE,
      payload: error.response?.data?.code?.message || 
              error.response?.data?.message || 
              error.message || 
              'Registration failed'
    });
    toast.error("Error Register User Successfully")

  }
};

export const loginUser = (credentials: { email: string; password: string }) => async (dispatch: Dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const response = await publicRequest.post<AuthResponse>('/auth/login', credentials);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        user: response.data.data.user,
        token: response.data.data.token
      }
    });
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    toast.success("User Logged In Successfully")
    return response.data
  } catch (err) {
    const error = err as ApiError;
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.response?.data?.code?.message || 
              error.response?.data?.message || 
              error.message || 
              'Login failed'
    });
    toast.error("Error Logged In User Successfully")

  }

};