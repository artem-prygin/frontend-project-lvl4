import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import ModalAddRenameChannel from './ModalAddRenameChannel';
import ModalRemoveChannel from './ModalRemoveChannel';
import { MODAL_TYPE } from '../constants';
import { postChannel, deleteChannel, patchChannel } from '../slices/channelsSlice';
import { closeModal, modalSelector } from '../slices/modalSlice';

const BootstrapModal = () => {
  const dispatch = useDispatch();
  const { modalType, data } = useSelector(modalSelector);
  const currentChannelId = data?.channelId;

  const handleModalClose = () => {
    dispatch(closeModal());
  };

  const modalMapping = {
    [MODAL_TYPE.add]: {
      title: 'Add channel',
      component: (
        <ModalAddRenameChannel
          query={async (name) => dispatch(postChannel(name))}
          id={currentChannelId}
          handleModalClose={handleModalClose}
        />
      ),
    },
    [MODAL_TYPE.rename]: {
      title: 'Rename channel',
      component: (
        <ModalAddRenameChannel
          query={async (name) => dispatch(patchChannel({ name, currentChannelId }))}
          id={currentChannelId}
          handleModalClose={handleModalClose}
        />
      ),
    },
    [MODAL_TYPE.remove]: {
      title: 'Remove channel',
      component: (
        <ModalRemoveChannel
          query={async (channelId) => dispatch(deleteChannel(channelId))}
          id={currentChannelId}
          handleModalClose={handleModalClose}
        />
      ),
    },
  };

  return (
    <Modal show={!!modalType} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalMapping[modalType]?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modalMapping[modalType]?.component}
      </Modal.Body>
    </Modal>
  );
};

export default BootstrapModal;
