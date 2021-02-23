import React from 'react';
import { useSelector } from 'react-redux';
import { messagesSelector } from '../slices/messagesSlice';

const Chat = () => {
  const messages = useSelector(messagesSelector);

  return (
    <>
      <div id="messages-box" className="chat-messages overflow-auto mb-3">
        {!messages.length && <div className="text-muted">This chat is empty for now. Write your first message!</div>}
        {messages.map(({ username, body, id }) => (
          <div className="text-break" key={id}>
            <b>{username}</b>
            :&nbsp;
            {body}
          </div>
        ))}
      </div>
    </>
  );
};

export default Chat;
