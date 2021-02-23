import { createSlice } from '@reduxjs/toolkit';
import { addChannel } from './channelsSlice';

const currentChannelIdSlice = createSlice({
  name: 'currentChannelId',
  initialState: null,
  reducers: {
    setCurrentChannelId: (state, action) => action.payload,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addChannel, (state, action) => action.payload.id);
  },
});

export const { setCurrentChannelId } = currentChannelIdSlice.actions;
export const currentChannelIdSelector = (state) => state.currentChannelId;
export default currentChannelIdSlice.reducer;
