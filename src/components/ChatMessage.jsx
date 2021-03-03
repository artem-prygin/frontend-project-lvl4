import React from 'react';

const ChatMessage = ({ message }) => (
  <div className="text-break">
    <b>{message.username}</b>
    {': '}
    {message.body}
  </div>
);

export default ChatMessage;
