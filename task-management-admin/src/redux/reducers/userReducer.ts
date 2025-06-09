import { userPayload, userState } from "@/types/index";
import {
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
} from "../actionTypes/actionTypes";

const initialState: userState = {
  userData: [],
  isLoading: false,
  error: null,
  count:null
};

console.log(initialState.userData)

const userReducer = (state = initialState, { type, payload }: { type: string; payload: userPayload }) => {
  switch (type) {
    // Get all users
    case GET_USERS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      }

     case GET_USERS_SUCCESS:
      return{
        ...state,
        isLoading: false,
        userData: payload,
        error: null
      } 
      case GET_USERS_FAILURE:
      return{
        ...state,
        isLoading: false,
        error: payload
      }
    // Get users count
    case GET_USERS_COUNT_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case GET_USERS_COUNT_SUCCESS:
      console.log(payload)
      return {
        ...state,
        isLoading: false,
        userData: payload.user,
        count: (() => {
          const counts = new Array(12).fill(0);  
          if (payload.count) {
            payload.count.forEach((item: { count: number; month: string }) => {
              const monthIndex = Number(item.month.split("-")[1]) - 1;
              console.log(`Month: ${item.month}, Index: ${monthIndex}, Count: ${item.count}`);
              counts[monthIndex] = item.count;
            });
          }
          return counts;
        })(),
        
        error: null
      };
    case GET_USERS_COUNT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload
      };

    // Delete users

    case DELETE_USERS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      }  
    
    case DELETE_USERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userData: state.userData ? state.userData.filter((user) => !payload.includes(user._id)) : [],
        error: null
      }  

    case DELETE_USERS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload
      }
    case UPDATE_USERS_ROLE_REQUEST:
      return{
        ...state,
        isLoading:true,
      }
      case UPDATE_USERS_ROLE_SUCCESS: {
        const updatedUser = payload as { _id: string; role: string };
      
        return {
          ...state,
          userData: state?.userData?.map(user =>
            user._id.toString() === updatedUser._id.toString()
              ? { ...user, role: updatedUser.role }
              : user
          ),
          loading: false,
        };
      }
      
      
    case UPDATE_USERS_ROLE_FAILURE:
      return {
        ...state,
        isLoading:false,
        error:payload
      }  
    default:
      return state;
  }
};

export default userReducer;