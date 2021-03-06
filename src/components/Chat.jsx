import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { animateScroll } from 'react-scroll';
import { messagesSelector } from '../slices/messagesSlice';

const ChatMessage = ({ message }) => (
  <div className="text-break">
    <b>{message.username}</b>
    {': '}
    {message.body}
  </div>
);

const Chat = () => {
  const messages = useSelector(messagesSelector);

  useEffect(() => {
    animateScroll.scrollToBottom({
      duration: 300,
      containerId: 'chat-box',
    });
  }, [messages]);

  return (
    <div id="chat-box" className="chat-messages overflow-auto mb-3">
      {!messages.length && <div className="text-muted">This chat is empty for now. Write your first message!</div>}
      {messages.map((message) => <ChatMessage message={message} key={message.id} />)}
    </div>
  );
};

export default Chat;
