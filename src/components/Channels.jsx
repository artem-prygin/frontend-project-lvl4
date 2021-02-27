import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { channelsSelector } from '../slices/channelsSlice';
import { openModal } from '../slices/modalSlice';
import { MODAL_ADD } from '../constants';
import ChannelItem from './ChannelItem';

const Channels = () => {
  const channels = useSelector(channelsSelector);
  const dispatch = useDispatch();

  const handleOpenModal = (e) => {
    const { modalType, channelId } = e.target?.dataset;
    dispatch(openModal({ modalType, data: { channelId } }));
  };

  return (
    <div className="col-12 border-right channels-container col-md-3">
      <div className="d-flex mb-2">
        <span>Channels</span>
        <Button
          variant="link"
          className="ml-auto p-0 text-decoration-none outline-none"
          data-modal-type={MODAL_ADD}
          onClick={handleOpenModal}
        >
          +
        </Button>
      </div>
      <ul className="nav flex-md-column nav-pills nav-fill">
        {channels.map((channel) => <ChannelItem channel={channel} key={channel.id} />)}
      </ul>
    </div>
  );
};

export default Channels;
