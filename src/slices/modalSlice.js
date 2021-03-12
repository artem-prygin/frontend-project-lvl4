/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const getModal = (state) => state.modal;

export const modalSlice = createSlice({
  name: 'messages',
  initialState: { modalType: null, data: null, isOpened: false },
  reducers: {
    openModal: (state, action) => {
      const { modalType, data } = action.payload;
      state.modalType = modalType;
      state.isOpened = true;
      state.data = data;
    },
    closeModal: (state) => {
      state.modalType = null;
      state.isOpened = false;
      state.data = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
