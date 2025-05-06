import { ADD_TASK_FAILURE, ADD_TASK_REQUEST, ADD_TASK_SUCCESS, DELETE_TASK_FAILURE, DELETE_TASK_REQUEST, DELETE_TASK_SUCCESS, GET_TASK_FAILURE, GET_TASK_REQUEST, GET_TASK_SUCCESS, GET_TASKS_FAILURE, GET_TASKS_REQUEST, GET_TASKS_SUCCESS, UPDATE_TASK_FAILURE, UPDATE_TASK_REQUEST, UPDATE_TASK_SUCCESS } from "../actionTypes/actionTypes";
import {taskPayload, type taskState } from "@/types";
const taskState:taskState = {
    taskData: [],
    isLoading: false,
    error: null,
};


console.log(taskState.taskData)
const taskReducer = (state = taskState, { type, payload }: { type: string; payload: taskPayload }) => {
    switch (type) {
        // CREATE
        case ADD_TASK_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null
            };
        case ADD_TASK_SUCCESS:
            return {
                ...state,
                isLoading: false,
                taskData: [...state.taskData, payload],
                error: null
            };
        case ADD_TASK_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: payload
            };

        // READ ALL
        case GET_TASKS_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null
            };
        case GET_TASKS_SUCCESS:
            console.log(payload)
            return {
                ...state,
                isLoading: false,
                taskData: Array.isArray(payload) ? payload : [],
                error: null
            };
        case GET_TASKS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: payload
            };

        // READ SINGLE
        case GET_TASK_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null
            };
        case GET_TASK_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null
            };
        case GET_TASK_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: payload
            };

        // UPDATE
        case UPDATE_TASK_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null
            };
        case UPDATE_TASK_SUCCESS:
            return {
                ...state,
                isLoading: false,
                taskData: state.taskData.map(task => 
                    task._id === payload.id ? payload : task
                ),
                error: null
            };
        case UPDATE_TASK_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: payload
            };

        // DELETE
        case DELETE_TASK_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null
            };
        case DELETE_TASK_SUCCESS:
            return {
                ...state,
                isLoading: false,
                taskData: state.taskData.filter(task => task._id !== payload),
                error: null
            };
        case DELETE_TASK_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: payload
            };

        default:
            return state;
    }
};

export default taskReducer;