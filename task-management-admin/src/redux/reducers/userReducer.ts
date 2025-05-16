import { userPayload, userState } from "@/types/index";
import {
  GET_USERS_COUNT_FAILURE,
 GET_USERS_COUNT_REQUEST,
 GET_USERS_COUNT_SUCCESS,
 GET_USERS_FAILURE,
 GET_USERS_REQUEST,
 GET_USERS_SUCCESS
} from "../actionTypes/actionTypes";

const initialState: userState = {
  userData: [],
  isLoading: false,
  error: null,
  count:null
};

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
      console.log("UserData:",payload)
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


    default:
      return state;
  }
};

export default userReducer;