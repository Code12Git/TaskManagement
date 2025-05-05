import { Dispatch } from 'redux';
import { publicRequest } from '@/helpers/axios';
import { 
  REGISTER_REQUEST, 
  REGISTER_SUCCESS, 
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE
} from '../actionTypes/actionTypes'
import { AuthResponse, UserCredentials } from '@/types';
import { ApiError } from '@/types';


export const registerUser = (data: UserCredentials) => async (dispatch: Dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  
  try {
    const response = await publicRequest.post<AuthResponse>('/user/register', data);
    dispatch({ 
      type: REGISTER_SUCCESS, 
      payload: {
        user: response.data.user,
        token: response.data.token
      }
    });
  } catch (err) {
    const error = err as ApiError;
    dispatch({
      type: REGISTER_FAILURE,
      payload: error.response?.data?.code?.message || 
              error.response?.data?.message || 
              error.message || 
              'Registration failed'
    });
  }
};

export const loginUser = (credentials: { email: string; password: string }) => async (dispatch: Dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  
  try {
    const response = await publicRequest.post<AuthResponse>('/user/login', credentials);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        user: response.data.user,
        token: response.data.token
      }
    });
  } catch (err) {
    const error = err as ApiError;
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.response?.data?.code?.message || 
              error.response?.data?.message || 
              error.message || 
              'Login failed'
    });
  }
};