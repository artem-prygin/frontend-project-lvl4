/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { remove } from 'lodash';
import axios from 'axios';
import { removeChannel } from './channelsSlice';
import routes from '../routes';

export const postMessage = createAsyncThunk(
  'messagesThunk/addMessage',
  async (payload) => {
    const { currentChannelId, body, username } = payload;
    const route = routes.channelMessagesPath(currentChannelId);
    await axios.post(route, { data: { attributes: { body, username } } });
  },
);

export const fetchAllMessages = createAsyncThunk(
  'messagesThunk/storeMessages',
  async () => {
    const route = routes.messagesPath();
    const response = await axios.get(route);
    return response.data;
  },
);

export const messagesSlice = createSlice({
  name: 'messages',
  initialState: [],
  reducers: {
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
      })
      .addCase(fetchAllMessages.fulfilled, (state, action) => {
        const messages = action.payload.data.map((message) => message.attributes);
        state = messages;
      });
  },
});

export const { addMessage, storeMessages } = messagesSlice.actions;
export const messagesSelector = (state) => state.messages
  .filter((msg) => msg.channelId === state.channelsData.currentChannelId);
export default messagesSlice.reducer;
