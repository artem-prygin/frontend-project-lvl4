import React from 'react';
import Channels from './Channels.jsx';
import Chat from './Chat.jsx';
import Modal from './Modal';

const App = () => (
  <>
    <div className="row h-100 pb-3">
      <Channels />
      <Chat />
    </div>
    <Modal />
  </>
);

export default App;
