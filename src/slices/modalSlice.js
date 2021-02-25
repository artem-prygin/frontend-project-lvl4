/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const modalSlice = createSlice({
  name: 'messages',
  initialState: { modalType: null, data: null },
  reducers: {
    openModal: (state, action) => {
      const { modalType, data } = action.payload;
      state.modalType = modalType;
      state.data = data;
    },
    closeModal: (state) => {
      state.modalType = null;
      state.data = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export const modalSelector = (state) => state.modal;
export default modalSlice.reducer;
