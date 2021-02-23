import React from 'react';
import Channels from './Channels.jsx';
import Chat from './Chat.jsx';
import MessageInput from './MessageInput.jsx';

const App = () => (
  <div className="row h-100 pb-3">
    <Channels />
    <div className="col h-100">
      <div className="d-flex flex-column h-100">
        <Chat />
        <MessageInput />
      </div>
    </div>
  </div>
);

export default App;
