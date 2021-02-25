// @ts-check

import ReactDOM from 'react-dom';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import io from 'socket.io-client';
import gon from 'gon';
import '../assets/application.scss';
import runApp from './app.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}
const socket = io(window.location.href);

runApp(gon, socket);

ReactDOM.render(
  runApp(gon, socket),
  document.getElementById('chat'),
);
