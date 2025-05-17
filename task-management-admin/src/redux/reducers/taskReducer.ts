import { taskPayload, taskState } from "@/types";
import { GET_TASKS_FAILURE, GET_TASKS_REQUEST, GET_TASKS_SUCCESS } from "../actionTypes/actionTypes";

const initialState:taskState = {
    tasks:[],
    isLoading:false,
    error:null
}


const taskReducer = (state = initialState, { type, payload }: { type: string; payload: taskPayload }) => {
    switch(type){
        case GET_TASKS_REQUEST:
        return {
            ...state,
            isLoading:false
        }
       case GET_TASKS_SUCCESS:
        console.log(payload)
        return {
            ...state,
            tasks:payload
        }
       case GET_TASKS_FAILURE:
        return {
            ...state,
            isLoading:false,
            error:payload
        } 
        default : return state;
    }
}

export default taskReducer;