import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { currentChannelIdSelector, setCurrentChannelId } from '../slices/channelsSlice';
import { MODAL_TYPE } from '../constants';

const ChannelItem = ({ handleOpenModal, channel }) => {
  const currentChannelId = useSelector(currentChannelIdSelector);
  const dispatch = useDispatch();

  const handleSetCurrentChannelId = (id) => () => {
    dispatch(setCurrentChannelId(id));
  };

  const getBtnVariant = (id) => (id === currentChannelId ? 'primary' : 'light');
  const btnClassList = 'nav-link btn-block flex-grow-1 text-left';
  const itemClassList = 'nav-item mb-2 mr-1';

  const renderDefaultChannel = ({ id, name }) => (
    <li className={itemClassList}>
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
    <li className={itemClassList}>
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
            onClick={() => handleOpenModal(MODAL_TYPE.rename, id)}
          >
            Rename
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => handleOpenModal(MODAL_TYPE.remove, id)}
          >
            Remove
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </li>
  );

  if (channel.removable) {
    return renderRemovableChannel(channel);
  }
  return renderDefaultChannel(channel);
};

export default ChannelItem;
