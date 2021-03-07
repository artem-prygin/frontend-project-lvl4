import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { currentChannelIdSelector, setCurrentChannelId } from '../slices/channelsSlice';
import { MODAL_TYPE } from '../constants';

const DefaultChannelItem = ({ channel, handleSetCurrentChannelId, getBtnVariant }) => {
  const { name, id } = channel;
  return (
    <Button
      variant={getBtnVariant(id)}
      className="nav-link btn-block flex-grow-1 text-left"
      onClick={handleSetCurrentChannelId(id)}
    >
      {name}
    </Button>
  );
};

const RemovableChannelItem = ({
  channel,
  handleSetCurrentChannelId,
  handleOpenModal,
  getBtnVariant,
}) => {
  const { id: channelId } = channel;
  return (
    <Dropdown className="d-flex" as={ButtonGroup}>
      <DefaultChannelItem
        channel={channel}
        handleSetCurrentChannelId={handleSetCurrentChannelId}
        getBtnVariant={getBtnVariant}
      />
      <Dropdown.Toggle className="flex-grow-0" variant={getBtnVariant(channelId)} />
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleOpenModal(MODAL_TYPE.rename, channelId)}>
          Rename
        </Dropdown.Item>
        <Dropdown.Item onClick={() => handleOpenModal(MODAL_TYPE.remove, channelId)}>
          Remove
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const ChannelItem = ({ handleOpenModal, channel }) => {
  const dispatch = useDispatch();
  const handleSetCurrentChannelId = (id) => () => {
    dispatch(setCurrentChannelId(id));
  };

  const currentChannelId = useSelector(currentChannelIdSelector);
  const getBtnVariant = (id) => (id === currentChannelId ? 'primary' : 'light');

  return (
    <li className="nav-item mb-2 mr-1">
      {channel.removable
        ? (
          <RemovableChannelItem
            channel={channel}
            handleSetCurrentChannelId={handleSetCurrentChannelId}
            handleOpenModal={handleOpenModal}
            getBtnVariant={getBtnVariant}
          />
        )
        : (
          <DefaultChannelItem
            channel={channel}
            handleSetCurrentChannelId={handleSetCurrentChannelId}
            getBtnVariant={getBtnVariant}
          />
        )}
    </li>
  );
};

export default ChannelItem;
