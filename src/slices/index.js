import channelsReducer from './channelsSlice';
import messagesReducer from './messagesSlice';
import currentChannelIdReducer from './currentChannelIdSlice';
import modalReducer from './modalSlice';

export default {
  channels: channelsReducer,
  currentChannelId: currentChannelIdReducer,
  messages: messagesReducer,
  modal: modalReducer,
};
