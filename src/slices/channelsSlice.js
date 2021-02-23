import { createSlice } from '@reduxjs/toolkit';

export const channelsSlice = createSlice({
  name: 'channels',
  initialState: null,
  reducers: {
    addChannel: (state, action) => {
      state.push(action.payload);
    },
    removeChannel: (state, action) => {
      const channelId = action.payload;
      return state.filter((channel) => channel.id !== channelId);
    },
    renameChannel: (state, action) => {
      const { id, name } = action.payload;
      const channelToRemove = state.find((channel) => channel.id === id);
      channelToRemove.name = name;
    },
  },
});

export const { addChannel, removeChannel, renameChannel } = channelsSlice.actions;
export const channelsSelector = (state) => state.channels;
export default channelsSlice.reducer;
