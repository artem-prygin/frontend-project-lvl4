import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal as BootstrapModal } from 'react-bootstrap';
import ModalEditChannel from './ModalEditChannel';
import ModalRemoveChannel from './ModalRemoveChannel';
import { MODAL_TYPE } from '../constants';
import { createChannelAsync, removeChannelAsync, renameChannelAsync } from '../slices/channelsData';
import { closeModal, getModal } from '../slices/modal';

const modalMapping = (dispatch) => ({
  [MODAL_TYPE.ADD]: {
    title: 'Add channel',
    handleQuery: (name) => dispatch(createChannelAsync({ name })),
    component: ModalEditChannel,
  },
  [MODAL_TYPE.RENAME]: {
    title: 'Rename channel',
    handleQuery: (name, currentChannelId) => (
      dispatch(renameChannelAsync({ name, currentChannelId }))
    ),
    component: ModalEditChannel,
  },
  [MODAL_TYPE.REMOVE]: {
    title: 'Remove channel',
    handleQuery: (channelId) => dispatch(removeChannelAsync({ channelId })),
    component: ModalRemoveChannel,
  },
});

const Modal = () => {
  const { modalType, data, isOpened } = useSelector(getModal);
  const dispatch = useDispatch();
  if (!isOpened || !modalMapping(dispatch)[modalType]) {
    return null;
  }

  const currentChannelId = data?.channelId;

  const handleModalClose = () => {
    dispatch(closeModal());
  };

  const { component: ModalComponent, title, handleQuery } = modalMapping(dispatch)[modalType];

  return (
    <BootstrapModal show={isOpened} onHide={handleModalClose}>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>{title}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        {ModalComponent && (
          <ModalComponent
            handleQuery={handleQuery}
            handleModalClose={handleModalClose}
            id={currentChannelId}
          />
        )}
      </BootstrapModal.Body>
    </BootstrapModal>
  );
};

export default Modal;
