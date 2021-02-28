import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import faker from 'faker';
import cookies from 'js-cookie';
import axios from 'axios';
import reducer from './slices';
import App from './components/App';
import Context from './Context';
import { addMessage, storeMessages } from './slices/messagesSlice';
import {
  storeChannels,
  addChannel,
  removeChannel,
  renameChannel,
} from './slices/channelsSlice';
import routes from './routes';

export default (gon, socket) => {
  if (!cookies.get('username')) {
    cookies.set('username', faker.name.findName());
  }
  const username = cookies.get('username');

  const preloadedState = {
    channelsData: {
      channels: gon.channels,
      currentChannelId: gon.currentChannelId,
    },
    messages: gon.messages,
  };
  const store = configureStore({
    reducer,
    preloadedState,
  });

  socket
    .on('newMessage', (data) => {
      const { data: { attributes: newMessage } } = data;
      store.dispatch(addMessage(newMessage));
    })
    .on('newChannel', (data) => {
      const { data: { attributes: newChannel } } = data;
      store.dispatch(addChannel(newChannel));
    })
    .on('removeChannel', (data) => {
      const { data: { id: channelId } } = data;
      store.dispatch(removeChannel(channelId));
    })
    .on('renameChannel', (data) => {
      const { data: { attributes: renamedChannel } } = data;
      store.dispatch(renameChannel(renamedChannel));
    })
    .on('reconnect', async () => {
      const { data: { data: channelsData } } = await axios.get(routes.channelsPath());
      const channels = channelsData.map((data) => data.attributes);
      store.dispatch(storeChannels(channels));
      const { data: { data: messagesData } } = await axios.get(routes.messagesPath());
      const messages = messagesData.map((data) => data.attributes);
      store.dispatch(storeMessages(messages));
    });

  return (
    <Provider store={store}>
      <Context.Provider value={{ username }}>
        <App />
      </Context.Provider>
    </Provider>
  );
};
