/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { remove, first } from 'lodash';

export const channelsSlice = createSlice({
  name: 'channelsData',
  initialState: { channels: [], currentChannelId: null },
  reducers: {
    getChannels: (state, action) => {
      const channels = action.payload;
      state.channels = channels;
      const channelIds = channels.map((channel) => channel.id);
      if (!channelIds.includes(state.currentChannelId)) {
        const defaultChannelId = first(state.channels)?.id;
        state.currentChannelId = defaultChannelId;
      }
    },
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
      const { id, name } = action.payload;
      const channelToRename = state.channels.find((channel) => channel.id === id);
      channelToRename.name = name;
    },
    setCurrentChannelId: (state, action) => {
      const channelId = action.payload;
      state.currentChannelId = channelId;
    },
  },
});

export const {
  getChannels,
  addChannel,
  removeChannel,
  renameChannel,
  setCurrentChannelId,
} = channelsSlice.actions;
export const channelsSelector = (state) => state.channelsData.channels;
export const currentChannelIdSelector = (state) => state.channelsData.currentChannelId;
export default channelsSlice.reducer;
