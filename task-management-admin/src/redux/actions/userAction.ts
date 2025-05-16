import { Dispatch } from 'redux';
import { privateRequest} from '@/helpers/axios';
import { 
    GET_USERS_COUNT_FAILURE,
  GET_USERS_COUNT_REQUEST,
  GET_USERS_COUNT_SUCCESS,
  GET_USERS_FAILURE,
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS
} from '../actionTypes/actionTypes'
import { AuthResponse  } from '@/types/index';
import { ApiError } from '@/types/index';
import toast from 'react-hot-toast'



export const fetchUserCountByMonth = () => async (dispatch: Dispatch) => {
  dispatch({ type: GET_USERS_COUNT_REQUEST });
  try {
    const response = await privateRequest.get<AuthResponse>('/user/count');
    dispatch({
      type: GET_USERS_COUNT_SUCCESS,
      payload: {
       count: response.data.data,
      }
    });
    return response.data.data
  } catch (err) {
    const error = err as ApiError;
    dispatch({
      type: GET_USERS_COUNT_FAILURE,
      payload: error.response?.data?.code?.message || 
              error.response?.data?.message || 
              error.message || 
              'Fetch Count failed'
    });
    toast.error("Error Fetching Count Successfully")
  }
};

export const fetchAllUsers = () => async(dispatch:Dispatch) => {
  dispatch({type:GET_USERS_REQUEST})
  try{
    const result = await privateRequest.get<AuthResponse>('/user');
    console.log(result.data.data)
    dispatch({
      type: GET_USERS_SUCCESS,
      payload:result.data.data
    })
    return result.data.data
  }catch (err) {
    const error = err as ApiError;
    dispatch({
      type: GET_USERS_FAILURE,
      payload: error.response?.data?.code?.message || 
              error.response?.data?.message || 
              error.message || 
              'Fetch User Failed'
    });
    toast.error("Error Fetching User Successfully")
  }
};
