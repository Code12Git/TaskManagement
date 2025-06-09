import { authState, adminPayload } from "@/types/index";
import {
 ADMIN_LOGIN_FAILURE,
 ADMIN_LOGIN_REQUEST,
 ADMIN_LOGIN_SUCCESS

} from "../actionTypes/actionTypes";

const initialState: authState = {
  adminData: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  token: null
};

const authReducer = (state = initialState, { type, payload }: { type: string; payload: adminPayload }) => {
  switch (type) {
    // LOGIN
    case ADMIN_LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case ADMIN_LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        adminData: payload.admin,
        isAuthenticated: true,
        token: payload.token,
        error: null
      };
    case ADMIN_LOGIN_FAILURE:
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