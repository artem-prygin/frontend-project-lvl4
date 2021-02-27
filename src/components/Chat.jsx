import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { messagesSelector } from '../slices/messagesSlice';

const Chat = () => {
  const messages = useSelector(messagesSelector);
  const chatBox = useRef(null);
  useEffect(() => {
    if (chatBox.current) {
      chatBox.current.scrollTo(0, chatBox.current.scrollHeight);
    }
  });

  return (
    <div id="chat-box" className="chat-messages overflow-auto mb-3" ref={chatBox}>
      {!messages.length && <div className="text-muted">This chat is empty for now. Write your first message!</div>}
      {messages.map(({ username, body, id }) => (
        <div className="text-break" key={id}>
          <b>{username}</b>
          :&nbsp;
          {body}
        </div>
      ))}
    </div>
  );
};

export default Chat;
