import { User, userDataPayload } from "@/types";
import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  ASSIGN_USERS_REQUEST,
  ASSIGN_USERS_SUCCESS,
  ASSIGN_USERS_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
} from "../actionTypes/actionTypes";

const initialState = {
  loading: false,
  users: [],
  error: null,
};

const userReducer = (
  state = initialState,
  { type, payload }: { type: string; payload: userDataPayload }
) => {
  switch (type) {
    case FETCH_USERS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_USERS_SUCCESS:
      return { ...state, loading: false, users: payload };

    case FETCH_USERS_FAILURE:
      return { ...state, loading: false, error: payload };

    case ASSIGN_USERS_REQUEST:
      return { ...state, loading: true, error: null };

    case ASSIGN_USERS_SUCCESS:
      return { ...state, loading: false };

    case ASSIGN_USERS_FAILURE:
      return { ...state, loading: false, error: payload };

    case UPDATE_USER_REQUEST:
      return {...state,loading:true}
     
      case UPDATE_USER_SUCCESS: {
        const { userId, userData } = payload;
        return {
          ...state,
          users: state.users.map((user:User) =>
            user._id === userId ? userData : user
          )
        };
      }
      
      
    case UPDATE_USER_FAILURE:
        return {...state,loading:false,error:payload}  

    default:
      return state;
  }
};

export default userReducer;
