import { userPayload, userState } from "@/types/index";
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE
} from "../actionTypes/actionTypes";

const initialState: userState = {
  userData: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  token: null
};

const authReducer = (state = initialState, { type, payload }: { type: string; payload: userPayload }) => {
  switch (type) {
    // REGISTER
    case REGISTER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userData: payload.user,
        isAuthenticated: true,
        token: payload.token,
        error: null
      };
    case REGISTER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload
      };

    // LOGIN
    case LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userData: payload.user,
        isAuthenticated: true,
        token: payload.token,
        error: null
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload
      };

    // LOGOUT
    case LOGOUT_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case LOGOUT_SUCCESS:
      return {
        ...initialState 
      };
    case LOGOUT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload
      };

    default:
      return state;
  }
};

export default authReducer;