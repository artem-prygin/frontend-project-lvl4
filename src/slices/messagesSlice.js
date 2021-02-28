/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { remove } from 'lodash';
import { removeChannel } from './channelsSlice';

export const messagesSlice = createSlice({
  name: 'messages',
  initialState: [],
  reducers: {
    storeMessages: (state, action) => {
      const messages = action.payload;
      state = messages;
    },
    addMessage: (state, action) => {
      const newMessage = action.payload;
      state.push(newMessage);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeChannel, (state, action) => {
        const channelId = action.payload;
        remove(state, (message) => message.channelId === channelId);
      });
  },
});

export const { addMessage, storeMessages } = messagesSlice.actions;
export const messagesSelector = (state) => state.messages
  .filter((msg) => msg.channelId === state.channelsData.currentChannelId);
export default messagesSlice.reducer;
