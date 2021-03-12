import channelsReducer from './channelsSlice';
import messagesReducer from './messagesSlice';
import modalReducer from './modalSlice';

export default {
  channelsData: channelsReducer,
  messagesData: messagesReducer,
  modal: modalReducer,
};
