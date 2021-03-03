import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { animateScroll } from 'react-scroll';
import { messagesSelector } from '../slices/messagesSlice';
import ChatMessage from './ChatMessage';

const Chat = () => {
  const messages = useSelector(messagesSelector);
  const chatBox = useRef(null);
  useEffect(() => {
    animateScroll.scrollToBottom({
      duration: 300,
      containerId: 'chat-box',
    });
  });

  return (
    <div id="chat-box" className="chat-messages overflow-auto mb-3" ref={chatBox}>
      {!messages.length && <div className="text-muted">This chat is empty for now. Write your first message!</div>}
      {messages.map((message) => <ChatMessage message={message} key={message.id} />)}
    </div>
  );
};

export default Chat;
