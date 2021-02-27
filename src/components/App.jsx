import React from 'react';
import Channels from './Channels.jsx';
import Chat from './Chat.jsx';
import MessageInput from './MessageInput.jsx';
import Modals from './Modals';

const App = () => (
  <>
    <div className="row h-100 pb-3">
      <Channels />
      <div className="col-12 h-100 col-md">
        <div className="d-flex flex-column h-100">
          <Chat />
          <MessageInput />
        </div>
      </div>
    </div>
    <Modals />
  </>
);

export default App;
