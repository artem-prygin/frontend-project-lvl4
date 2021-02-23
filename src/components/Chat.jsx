import React from 'react';
import { messagesSelector } from '../slices/messagesSlice';
import { useSelector } from 'react-redux';

const Chat = () => {
  const messages = useSelector(messagesSelector);

  return (
    <div id="messages-box" className="chat-messages overflow-auto mb-3">
      {messages.map(({ username, body, id }) => (
        <div className="text-break" key={id}>
          <b>{username}</b>: {body}
        </div>
      ))}
    </div>
  );
};

export default Chat;
