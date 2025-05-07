import { userDataPayload } from "@/types";
import {
    FETCH_USERS_REQUEST,
    FETCH_USERS_SUCCESS,
    FETCH_USERS_FAILURE,
    ASSIGN_USERS_REQUEST,
    ASSIGN_USERS_SUCCESS,
    ASSIGN_USERS_FAILURE,
  } from "../actionTypes/actionTypes";
  
  const initialState = {
    loading: false,
    users: [],
    error: null,
  };
  
  const userReducer = (state = initialState, {type,payload}:{type:string,payload:userDataPayload}) => {
    switch (type) {
      case FETCH_USERS_REQUEST:
        return { ...state, loading: true, error: null };
  
      case FETCH_USERS_SUCCESS:
        console.log(payload)
        return { ...state, loading: false, users: payload };
  
      case FETCH_USERS_FAILURE:
        return { ...state, loading: false, error: payload };

        case ASSIGN_USERS_REQUEST:
          return { ...state, loading: true, error: null };
    
        case ASSIGN_USERS_SUCCESS:
          return { ...state, loading: false };
    
        case ASSIGN_USERS_FAILURE:
          return { ...state, loading: false, error: payload };


      default:
        return state;
    }
  };
  
  export default userReducer;
  