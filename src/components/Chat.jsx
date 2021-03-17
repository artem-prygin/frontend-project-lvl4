import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { animateScroll } from 'react-scroll';
import { getMessages } from '../slices/messagesData';
import MessageInput from './MessageInput';
import { getCurrentChannel } from '../slices/channelsData';

const ChatMessage = ({ message }) => (
  <div className="text-break">
    <b>{message.username}</b>
    {': '}
    {message.body}
  </div>
);

const Chat = () => {
  const messages = useSelector(getMessages);
  const currentChannel = useSelector(getCurrentChannel);

  useEffect(() => {
    animateScroll.scrollToBottom({
      duration: 0,
      containerId: 'chat-box',
    });
  }, [messages.length]);

  return (
    <div className="col-12 h-100 col-md">
      <div className="d-flex flex-column h-100">
        <div id="chat-box" className="chat-messages overflow-auto mb-3">
          {!messages.length && <div className="text-muted">This chat is empty for now. Write your first message!</div>}
          {messages.map((message) => (
            <ChatMessage
              message={message}
              key={message.id}
            />
          ))}
        </div>
        <div className="mt-auto">
          <MessageInput channel={currentChannel} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
