import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import {
  channelsSelector,
  currentChannelIdSelector,
  setCurrentChannelId,
} from '../slices/channelsSlice';
import { openModal } from '../slices/modalSlice';
import { MODAL_TYPE } from '../constants';
import ChannelItem from './ChannelItem';

const Channels = () => {
  const channels = useSelector(channelsSelector);
  const dispatch = useDispatch();
  const currentChannelId = useSelector(currentChannelIdSelector);

  const handleSetCurrentChannelId = (id) => () => {
    dispatch(setCurrentChannelId(id));
  };

  const handleOpenModal = (modalType, channelId = null) => () => {
    dispatch(openModal({ modalType, data: { channelId } }));
  };

  return (
    <div className="col-12 border-right channels-container col-md-3">
      <div className="d-flex mb-2">
        <span>Channels</span>
        <Button
          variant="link"
          className="ml-auto p-0 text-decoration-none outline-none"
          onClick={handleOpenModal(MODAL_TYPE.ADD)}
        >
          +
        </Button>
      </div>
      <ul className="nav flex-md-column nav-pills nav-fill">
        {channels.map((channel) => (
          <ChannelItem
            handleOpenModal={handleOpenModal}
            handleSetCurrentChannelId={handleSetCurrentChannelId}
            currentChannelId={currentChannelId}
            channel={channel}
            key={channel.id}
          />
        ))}
      </ul>
    </div>
  );
};

export default Channels;
