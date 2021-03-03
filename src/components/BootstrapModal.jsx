import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import ModalAddRenameChannel from './ModalAddRenameChannel';
import ModalRemoveChannel from './ModalRemoveChannel';
import { MODAL_ADD, MODAL_REMOVE, MODAL_RENAME } from '../constants';
import { addChannelThunk, removeChannelThunk, renameChannelThunk } from '../slices/channelsSlice';
import { closeModal, modalSelector } from '../slices/modalSlice';

const BootstrapModal = () => {
  const dispatch = useDispatch();
  const { modalType, data } = useSelector(modalSelector);
  const currentChannelId = data?.channelId;
  const addRenameModalTypes = [MODAL_ADD, MODAL_RENAME];
  const modalMapping = {
    [MODAL_ADD]: {
      title: 'Add channel',
      query: async (name) => dispatch(addChannelThunk(name)),
    },
    [MODAL_RENAME]: {
      title: 'Rename channel',
      query: async (name) => dispatch(renameChannelThunk([name, currentChannelId])),
    },
    [MODAL_REMOVE]: {
      title: 'Remove channel',
      query: async (channelId) => dispatch(removeChannelThunk(channelId)),
    },
  };

  const handleModalClose = () => {
    dispatch(closeModal());
  };

  return (
    <Modal show={!!modalType} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalMapping[modalType]?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {addRenameModalTypes.includes(modalType) && (
          <ModalAddRenameChannel
            query={modalMapping[modalType].query}
            id={currentChannelId}
            handleModalClose={handleModalClose}
          />
        )}
        {modalType === MODAL_REMOVE && (
          <ModalRemoveChannel
            query={modalMapping[MODAL_REMOVE].query}
            id={currentChannelId}
            handleModalClose={handleModalClose}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default BootstrapModal;
