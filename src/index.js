// @ts-check

import ReactDOM from 'react-dom';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import io from 'socket.io-client';
import gon from 'gon';
import '../assets/application.scss';
import initApp from './app.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const url = window.location.href;
const socket = io(url);
const app = initApp(gon, socket);
const container = document.getElementById('chat');

ReactDOM.render(app, container);
