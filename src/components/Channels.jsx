import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { channelsSelector } from '../slices/channelsSlice';
import { currentChannelIdSelector, setCurrentChannelId } from '../slices/currentChannelIdSlice';
import { openModal } from '../slices/modalSlice';
import ModalAddRenameChannel from './ModalAddRenameChannel';
import ModalRemoveChannel from './ModalRemoveChannel';

const Channels = () => {
  const channels = useSelector(channelsSelector);
  const currentChannelId = useSelector(currentChannelIdSelector);
  const dispatch = useDispatch();

  const handleSetCurrentChannelId = (id) => () => {
    dispatch(setCurrentChannelId(id));
  };

  const handleOpenModal = (e) => {
    const { modalType, channelId } = e.target?.dataset;
    dispatch(openModal({ modalType, data: { channelId } }));
  };

  const getBtnVariant = (id) => (id === currentChannelId ? 'primary' : 'light');
  const btnClassList = 'nav-link btn-block flex-grow-1 text-left';

  const renderDefaultChannel = ({ id, name }) => (
    <li className="nav-item mb-2" key={id}>
      <Button
        variant={getBtnVariant(id)}
        className={btnClassList}
        onClick={handleSetCurrentChannelId(id)}
      >
        {name}
      </Button>
    </li>
  );

  const renderRemovableChannel = ({ id, name }) => (
    <li className="nav-item mb-2" key={id}>
      <Dropdown className="d-flex" as={ButtonGroup}>
        <Button
          variant={getBtnVariant(id)}
          className={btnClassList}
          onClick={handleSetCurrentChannelId(id)}
        >
          {name}
        </Button>
        <Dropdown.Toggle className="flex-grow-0" variant={getBtnVariant(id)} />
        <Dropdown.Menu>
          <Dropdown.Item
            data-modal-type="rename"
            data-channel-id={id}
            onClick={handleOpenModal}
          >
            Rename
          </Dropdown.Item>
          <Dropdown.Item
            data-modal-type="remove"
            data-channel-id={id}
            onClick={handleOpenModal}
          >
            Remove
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </li>
  );

  return (
    <div className="col-3 border-right overflow-auto h-100">
      <div className="d-flex mb-2">
        <span>Channels</span>
        <button
          type="button"
          className="ml-auto p-0 btn btn-link"
          data-modal-type="add"
          onClick={handleOpenModal}
        >
          +
        </button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill">
        {channels.map((channel) => {
          if (!channel.removable) {
            return renderDefaultChannel(channel);
          }
          return renderRemovableChannel(channel);
        })}
      </ul>
      <ModalAddRenameChannel />
      <ModalRemoveChannel />
    </div>
  );
};

export default Channels;