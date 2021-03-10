import React from 'react';
import Channels from './Channels.jsx';
import Chat from './Chat.jsx';
import MessageInput from './MessageInput.jsx';
import Modal from './Modal';

const App = () => (
  <>
    <div className="row h-100 pb-3">
      <Channels />
      <div className="col-12 h-100 col-md">
        <div className="d-flex flex-column h-100">
          <Chat />
          <div className="mt-auto">
            <MessageInput />
          </div>
        </div>
      </div>
    </div>
    <Modal />
  </>
);

export default App;
