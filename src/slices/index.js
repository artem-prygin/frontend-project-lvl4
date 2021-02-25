import channelsReducer from './channelsSlice';
import messagesReducer from './messagesSlice';
import modalReducer from './modalSlice';

export default {
  channelsData: channelsReducer,
  messages: messagesReducer,
  modal: modalReducer,
};
