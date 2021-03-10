import React from 'react';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { MODAL_TYPE } from '../constants';

const DefaultChannelItem = ({ channel, handleSetCurrentChannelId, btnVariant }) => {
  const { name, id } = channel;
  return (
    <Button
      variant={btnVariant}
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
  btnVariant,
}) => {
  const { id: channelId } = channel;
  return (
    <Dropdown className="d-flex" as={ButtonGroup}>
      <DefaultChannelItem
        channel={channel}
        handleSetCurrentChannelId={handleSetCurrentChannelId}
        btnVariant={btnVariant}
      />
      <Dropdown.Toggle className="flex-grow-0" variant={btnVariant} />
      <Dropdown.Menu>
        <Dropdown.Item onClick={handleOpenModal(MODAL_TYPE.RENAME, channelId)}>
          Rename
        </Dropdown.Item>
        <Dropdown.Item onClick={handleOpenModal(MODAL_TYPE.REMOVE, channelId)}>
          Remove
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const ChannelItem = ({
  handleOpenModal,
  handleSetCurrentChannelId,
  channel,
  currentChannelId,
}) => {
  const btnVariant = channel.id === currentChannelId ? 'primary' : 'light';

  return (
    <li className="nav-item mb-2 mr-1">
      {channel.removable
        ? (
          <RemovableChannelItem
            channel={channel}
            handleSetCurrentChannelId={handleSetCurrentChannelId}
            handleOpenModal={handleOpenModal}
            btnVariant={btnVariant}
          />
        )
        : (
          <DefaultChannelItem
            channel={channel}
            handleSetCurrentChannelId={handleSetCurrentChannelId}
            btnVariant={btnVariant}
          />
        )}
    </li>
  );
};

export default ChannelItem;
