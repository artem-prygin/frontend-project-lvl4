/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { remove, first } from 'lodash';
import axios from 'axios';
import routes from '../routes';

export const postChannelAsync = createAsyncThunk(
  'channels/addChannelAsync',
  async (name) => {
    const route = routes.channelsPath();
    await axios.post(route, { data: { attributes: { name } } });
  },
);

export const patchChannelAsync = createAsyncThunk(
  'channels/renameChannelAsync',
  async ({ name, currentChannelId }) => {
    const route = routes.channelPath(currentChannelId);
    await axios.patch(route, { data: { attributes: { name } } });
  },
);

export const deleteChannelAsync = createAsyncThunk(
  'channels/removeChannelAsync',
  async (channelId) => {
    const route = routes.channelPath(channelId);
    await axios.delete(route);
  },
);

export const fetchAllChannelsAsync = createAsyncThunk(
  'channels/storeChannelsAsync',
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
      const newChannel = action.payload;
      state.channels.push(newChannel);
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
        name,
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
      .addCase(fetchAllChannelsAsync.fulfilled, (state, action) => {
        const { channels } = action.payload;
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
export const currentChannelNameByIdSelector = (id) => (state) => state.channelsData.channels
  .find((channel) => channel.id === id)?.name || '';
export const channelNamesSelector = (state) => state.channelsData.channels
  .map((channel) => channel.name);
export default channelsSlice.reducer;
