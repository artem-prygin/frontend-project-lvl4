import { createSlice } from '@reduxjs/toolkit';

const initialState = { modalType: null, data: null };

export const modalSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    openModal: (state, action) => {
      const { modalType, data } = action.payload;
      return { modalType, data };
    },
    closeModal: () => initialState,
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export const modalSelector = (state) => state.modal;
export default modalSlice.reducer;
