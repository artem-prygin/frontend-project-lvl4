/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { remove } from 'lodash';
import axios from 'axios';
import { removeChannel } from './channelsSlice';
import routes from '../routes';

export const postMessageAsync = createAsyncThunk(
  'messages/addMessageAsync',
  async (payload) => {
    const { currentChannelId, body, username } = payload;
    const route = routes.channelMessagesPath(currentChannelId);
    await axios.post(route, { data: { attributes: { body, username } } });
  },
);

export const fetchAllMessagesAsync = createAsyncThunk(
  'messages/storeMessagesAsync',
  async () => {
    const route = routes.messagesPath();
    const response = await axios.get(route);
    const messages = response.data.data.map((message) => message.attributes);
    return { messages };
  },
);

export const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    list: [],
  },
  reducers: {
    addMessage: (state, action) => {
      const newMessage = action.payload;
      state.list.push(newMessage);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeChannel, (state, action) => {
        const channelId = action.payload;
        remove(state.list, (message) => message.channelId === channelId);
      })
      .addCase(fetchAllMessagesAsync.fulfilled, (state, action) => {
        const { messages } = action.payload;
        state.list = messages;
      });
  },
});

export const { addMessage, storeMessages } = messagesSlice.actions;
export const messagesSelector = (state) => state.messages.list
  .filter((msg) => msg.channelId === state.channelsData.currentChannelId);
export default messagesSlice.reducer;
