import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import faker from 'faker';
import cookies from 'js-cookie';
import reducer from './slices';
import App from './components/App';
import Context from './Context';
import { addMessage, fetchAllMessagesAsync } from './slices/messagesData';
import {
  addChannel,
  removeChannel,
  renameChannel,
  fetchAllChannelsAsync,
} from './slices/channelsData';

export default (preloadedData, socket) => {
  if (!cookies.get('username')) {
    cookies.set('username', faker.name.findName());
  }
  const username = cookies.get('username');
  const { channels, messages, currentChannelId } = preloadedData;

  const preloadedState = {
    channelsData: {
      channels,
      currentChannelId,
    },
    messagesData: {
      messages,
    },
  };
  const store = configureStore({
    reducer,
    preloadedState,
  });

  socket
    .on('newMessage', (data) => {
      const { data: { attributes: newMessage } } = data;
      store.dispatch(addMessage({ newMessage }));
    })
    .on('newChannel', (data) => {
      const { data: { attributes: newChannel } } = data;
      store.dispatch(addChannel({ newChannel }));
    })
    .on('removeChannel', (data) => {
      const { data: { id: channelId } } = data;
      store.dispatch(removeChannel({ channelId }));
    })
    .on('renameChannel', (data) => {
      const { data: { attributes: renamedChannel } } = data;
      store.dispatch(renameChannel({ renamedChannel }));
    })
    .on('connect', () => {
      store.dispatch(fetchAllChannelsAsync());
      store.dispatch(fetchAllMessagesAsync());
    });

  const contextValue = { username };

  return (
    <Provider store={store}>
      <Context.Provider value={contextValue}>
        <App />
      </Context.Provider>
    </Provider>
  );
};
