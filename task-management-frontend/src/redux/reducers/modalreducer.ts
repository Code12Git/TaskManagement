// src/redux/reducers/modalReducer.ts

import { OPEN_MODAL,CLOSE_MODAL } from "../actionTypes/actionTypes";

const initialState = {
  modalType: null,
  modalProps: {},
  isOpen: false,
};

const modalReducer = (state = initialState, {type,payload}:{type:string,payload:{modalType:string,modalProps:string}}) => {
  switch (type) {
    case OPEN_MODAL:
      return {
        ...state,
        isOpen: true,
        modalType:  payload.modalType,
        modalProps: payload.modalProps,
      };
    case CLOSE_MODAL:
      return {
        ...state,
        isOpen: false,
        modalType: null,
        modalProps: {},
      };
    default:
      return state;
  }
};

export default modalReducer;
