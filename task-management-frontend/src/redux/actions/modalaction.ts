import { OPEN_MODAL,CLOSE_MODAL } from "../actionTypes/actionTypes";

export const openModal = (modalType: string, modalProps:any  = {}) => ({
  type: OPEN_MODAL,
  payload: { modalType, modalProps },
});

export const closeModal = () => ({
  type: CLOSE_MODAL,
});