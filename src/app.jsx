import React from 'react';
import ReactDOM from 'react-dom';
import Channels from './Channels.jsx';

export default (gon) => {
  ReactDOM.render(
    <Channels channels={gon.channels} />,
    document.getElementById('chat'),
  );
}
