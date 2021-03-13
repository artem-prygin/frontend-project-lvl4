/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { remove, first } from 'lodash';
import axios from 'axios';
import routes from '../routes';

export const getChannels = (state) => state.channelsData.channels;
export const getCurrentChannelId = (state) => state.channelsData.currentChannelId;
export const getCurrentChannel = (id) => (state) => state.channelsData.channels
  .find((channel) => channel.id === id);
export const getChannelNames = (state) => state.channelsData.channels
  .map((channel) => channel.name);

export const createChannelAsync = createAsyncThunk(
  'channels/createChannelAsync',
  async ({ name }) => {
    const route = routes.channelsPath();
    await axios.post(route, { data: { attributes: { name } } });
  },
);

export const renameChannelAsync = createAsyncThunk(
  'channels/renameChannelAsync',
  async ({ name, currentChannelId }) => {
    const route = routes.channelPath(currentChannelId);
    await axios.patch(route, { data: { attributes: { name } } });
  },
);

export const removeChannelAsync = createAsyncThunk(
  'channels/removeChannelAsync',
  async ({ channelId }) => {
    const route = routes.channelPath(channelId);
    await axios.delete(route);
  },
);

export const fetchAllChannelsAsync = createAsyncThunk(
  'channels/fetchAllChannelsAsync',
  async () => {
    const route = routes.channelsPath();
    const response = await axios.get(route);
    const channels = response.data.data.map((channel) => channel.attributes);
    return { channels };
  },
);

export const channelsSlice = createSlice({
  name: 'channelsData',
  initialState: {
    channels: [],
    currentChannelId: null,
  },
  reducers: {
    addChannel: (state, action) => {
      const { newChannel } = action.payload;
      state.channels.push(newChannel);
    },
    removeChannel: (state, action) => {
      const { channelId } = action.payload;
      remove(state.channels, (channel) => channel.id === channelId);
      if (channelId === state.currentChannelId) {
        const defaultChannelId = first(state.channels)?.id;
        state.currentChannelId = defaultChannelId;
      }
    },
    renameChannel: (state, action) => {
      const { id, name } = action.payload.renamedChannel;
      const channelToRename = state.channels.find((channel) => channel.id === id);
      channelToRename.name = name;
    },
    setCurrentChannelId: (state, action) => {
      const { channelId } = action.payload;
      state.currentChannelId = channelId;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllChannelsAsync.fulfilled, (state, action) => {
        const { channels } = action.payload;
        console.log(action.payload);
        state.channels = channels;
        if (!channels.some((channel) => channel.id === state.currentChannelId)) {
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

export default channelsSlice.reducer;
