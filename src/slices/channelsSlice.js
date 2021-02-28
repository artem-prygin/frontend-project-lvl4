/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { remove, first } from 'lodash';
import axios from 'axios';
import routes from '../routes';

export const addChannelThunk = createAsyncThunk(
  'channelsThunk/addChannel',
  async (name) => {
    const route = routes.channelsPath();
    await axios
      .post(route, { data: { attributes: { name } } });
  },
);

export const renameChannelThunk = createAsyncThunk(
  'channelsThunk/renameChannel',
  async ([name, currentChannelId]) => {
    const route = routes.channelPath(currentChannelId);
    await axios
      .patch(route, { data: { attributes: { name } } });
  },
);

export const removeChannelThunk = createAsyncThunk(
  'channelsThunk/removeChannel',
  async (channelId) => {
    const route = routes.channelPath(channelId);
    await axios
      .delete(route);
  },
);

export const storeChannelsThunk = createAsyncThunk(
  'channelsThunk/storeChannels',
  async () => {
    const route = routes.channelsPath();
    const response = await axios.get(route);
    return response.data;
  },
);

export const channelsSlice = createSlice({
  name: 'channelsData',
  initialState: {
    channels: [],
    currentChannelId: null
  },
  reducers: {
    addChannel: (state, action) => {
      const newChannel = action.payload;
      const newChannelId = newChannel.id;
      state.channels.push(action.payload);
      state.currentChannelId = newChannelId;
    },
    removeChannel: (state, action) => {
      const channelId = action.payload;
      remove(state.channels, (channel) => channel.id === channelId);
      if (channelId === state.currentChannelId) {
        const defaultChannelId = first(state.channels)?.id;
        state.currentChannelId = defaultChannelId;
      }
    },
    renameChannel: (state, action) => {
      const {
        id,
        name
      } = action.payload;
      const channelToRename = state.channels.find((channel) => channel.id === id);
      channelToRename.name = name;
    },
    setCurrentChannelId: (state, action) => {
      const channelId = action.payload;
      state.currentChannelId = channelId;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(storeChannelsThunk.fulfilled, (state, action) => {
        const channels = action.payload.data.map((channel) => channel.attributes);
        state.channels = channels;
        const channelIds = channels.map((channel) => channel.id);
        if (!channelIds.includes(state.currentChannelId)) {
          const defaultChannelId = first(state.channels)?.id;
          state.currentChannelId = defaultChannelId;
        }
      });
  },
});

export const {
  addChannel,
  removeChannel,
  renameChannel,
  setCurrentChannelId,
} = channelsSlice.actions;
export const channelsSelector = (state) => state.channelsData.channels;
export const currentChannelIdSelector = (state) => state.channelsData.currentChannelId;
export default channelsSlice.reducer;
