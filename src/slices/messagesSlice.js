import { createSlice } from '@reduxjs/toolkit';
import { removeChannel } from './channelsSlice';

export const messagesSlice = createSlice({
  name: 'messages',
  initialState: null,
  reducers: {
    addMessage: (state, action) => {
      state.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeChannel, (state, action) => {
        const channelId = action.payload;
        return state.filter((message) => message.channelId !== channelId);
      });
  },
});

export const { addMessage } = messagesSlice.actions;
export const messagesSelector = (state) => state.messages
  .filter((msg) => msg.channelId === state.currentChannelId);
export default messagesSlice.reducer;
