import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { currentChannelIdSelector, setCurrentChannelId } from '../slices/channelsSlice';
import { openModal } from '../slices/modalSlice';
import { MODAL_REMOVE, MODAL_RENAME } from '../constants';

const ChannelItem = ({ channel }) => {
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
            data-modal-type={MODAL_RENAME}
            data-channel-id={id}
            onClick={handleOpenModal}
          >
            Rename
          </Dropdown.Item>
          <Dropdown.Item
            data-modal-type={MODAL_REMOVE}
            data-channel-id={id}
            onClick={handleOpenModal}
          >
            Remove
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </li>
  );

  if (!channel.removable) {
    return renderDefaultChannel(channel);
  }
  return renderRemovableChannel(channel);
};

export default ChannelItem;
