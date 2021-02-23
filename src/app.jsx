import React from 'react';
import ReactDOM from 'react-dom';
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import io from '../node_modules/socket.io/client-dist/socket.io.js';
import faker from 'faker';
import cookies from 'js-cookie';
import reducer from './slices'
import App from './components/App';
import Context from "./Context";
import { addMessage } from "./slices/messagesSlice";
import { addChannel, removeChannel, renameChannel } from "./slices/channelsSlice";

export default (gon) => {
  if (!cookies.get('username')) {
    cookies.set('username', faker.name.findName());
  }
  const username = cookies.get('username');

  const preloadedState = JSON.parse(JSON.stringify(gon));
  const store = configureStore({ reducer, preloadedState });

  const socket = io();
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
    });

  ReactDOM.render(
    <Provider store={store}>
      <Context.Provider value={username}>
        <App />
      </Context.Provider>
    </Provider>,
    document.getElementById('chat'),
  );
}
