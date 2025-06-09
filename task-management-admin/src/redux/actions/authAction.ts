import { Dispatch } from 'redux';
import { publicRequest } from '@/helpers/axios';
import { 
  ADMIN_LOGIN_FAILURE ,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGIN_REQUEST
} from '../actionTypes/actionTypes'
import { AuthResponse  } from '@/types/index';
import { ApiError } from '@/types/index';
import toast from 'react-hot-toast'



export const adminLogin = (credentials: { email: string; password: string }) => async (dispatch: Dispatch) => {
  dispatch({ type: ADMIN_LOGIN_REQUEST });
  try {
    const response = await publicRequest.post<AuthResponse>('/auth/admin', credentials);
    dispatch({
      type: ADMIN_LOGIN_SUCCESS,
      payload: {
        admin: response.data.data.admin,
        token: response.data.data.token
      }
    });
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('admin', JSON.stringify(response.data.data.admin));
    toast.success("Admin Logged In Successfully")
    return response.data
  } catch (err) {
    const error = err as ApiError;
    dispatch({
      type: ADMIN_LOGIN_FAILURE,
      payload: error.response?.data?.code?.message || 
              error.response?.data?.message || 
              error.message || 
              'Login failed'
    });
  }

};