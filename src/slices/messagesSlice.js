/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { remove } from 'lodash';
import axios from 'axios';
import { removeChannel } from './channelsSlice';
import routes from '../routes';

export const getMessages = (state) => state.messagesData.messages
  .filter((msg) => {
    const { currentChannelId } = state.channelsData;
    return msg.channelId === currentChannelId;
  });

export const createMessageAsync = createAsyncThunk(
  'messages/createMessageAsync',
  async ({ currentChannelId, body, username }) => {
    const route = routes.channelMessagesPath(currentChannelId);
    await axios.post(route, { data: { attributes: { body, username } } });
  },
);

export const fetchAllMessagesAsync = createAsyncThunk(
  'messages/fetchAllMessagesAsync',
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
    messages: [],
  },
  reducers: {
    addMessage: (state, action) => {
      const { newMessage } = action.payload;
      state.messages.push(newMessage);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeChannel, (state, action) => {
        const channelId = action.payload;
        remove(state.messages, (message) => message.channelId === channelId);
      })
      .addCase(fetchAllMessagesAsync.fulfilled, (state, action) => {
        const { messages } = action.payload;
        state.messages = messages;
      });
  },
});

export const { addMessage, storeMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
