import { Dispatch } from 'redux';
import { privateRequest} from '@/helpers/axios';
import { 
  ASSIGN_USERS_FAILURE,
  ASSIGN_USERS_REQUEST,
  ASSIGN_USERS_SUCCESS,
  DELETE_USERS_FAILURE,
  DELETE_USERS_REQUEST,
    DELETE_USERS_SUCCESS,
    GET_USERS_COUNT_FAILURE,
  GET_USERS_COUNT_REQUEST,
  GET_USERS_COUNT_SUCCESS,
  GET_USERS_FAILURE,
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  UPDATE_USERS_ROLE_FAILURE,
  UPDATE_USERS_ROLE_REQUEST,
  UPDATE_USERS_ROLE_SUCCESS
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
  }
};

export const fetchAllUsers = () => async(dispatch:Dispatch) => {
  dispatch({type:GET_USERS_REQUEST})
  try{
    const result = await privateRequest.get<AuthResponse>('/user');
    dispatch({
      type: GET_USERS_SUCCESS,
      payload:result.data.data
    })
    
  }catch (err) {
    const error = err as ApiError;
    dispatch({
      type: GET_USERS_FAILURE,
      payload: error.response?.data?.code?.message || 
              error.response?.data?.message || 
              error.message || 
              'Fetch User Failed'
    });
  }
};


export const deleteUsers = (userId:string) => async(dispatch:Dispatch) => {
  dispatch({type:DELETE_USERS_REQUEST})
  try{
    const result = await privateRequest.delete<AuthResponse>(`/user/${userId}`);
    dispatch({
      type: DELETE_USERS_SUCCESS,
      payload:result.data.data
    })
    toast.success("User Deleted Successfully")

  }catch(err){
    const error = err as ApiError;
    dispatch({
      type: DELETE_USERS_FAILURE,
      payload: error.response?.data?.code?.message || 
              error.response?.data?.message || 
              error.message || 
              'Delete User Failed'
    });
    toast.error("Error Deleting User Successfully")
  }
}


export const updateUsers = (userId:string,role:string) => async(dispatch:Dispatch) => {
  dispatch({type:UPDATE_USERS_ROLE_REQUEST})
  console.log(role)
  try{
    const res = await privateRequest.put(`/user/${userId}`,{role})
    dispatch({type:UPDATE_USERS_ROLE_SUCCESS,payload:res.data.data})
    toast.success('Role updated Successfully')
  }catch(err){
    const error = err as ApiError;
    dispatch({
      type: UPDATE_USERS_ROLE_FAILURE,
      payload: error.response?.data?.code?.message || 
              error.response?.data?.message || 
              error.message || 
              'Update User Role Failed'
    });
    toast.error("Error Updating User Role Successfully")
  }
}

export const assignUser = (userId:string,taskId:string) => async (dispatch: Dispatch) => {
  dispatch({ type: ASSIGN_USERS_REQUEST });
  try {
    await privateRequest.post<AuthResponse>('/user/assign',{userId,taskId});
    console.log(userId,)
    dispatch({ 
      type: ASSIGN_USERS_SUCCESS, 
    });
    
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

