import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal as BootstrapModal } from 'react-bootstrap';
import ModalEditChannel from './ModalEditChannel';
import ModalRemoveChannel from './ModalRemoveChannel';
import { MODAL_TYPE } from '../constants';
import { postChannelAsync, deleteChannelAsync, patchChannelAsync } from '../slices/channelsSlice';
import { closeModal, modalSelector } from '../slices/modalSlice';

const modalMapping = (dispatch) => ({
  [MODAL_TYPE.ADD]: {
    title: 'Add channel',
    handleQuery: (name) => dispatch(postChannelAsync(name)),
    component: ModalEditChannel,
  },
  [MODAL_TYPE.RENAME]: {
    title: 'Rename channel',
    handleQuery: (name, currentChannelId) => (
      dispatch(patchChannelAsync({ name, currentChannelId }))
    ),
    component: ModalEditChannel,
  },
  [MODAL_TYPE.REMOVE]: {
    title: 'Remove channel',
    handleQuery: (channelId) => dispatch(deleteChannelAsync(channelId)),
    component: ModalRemoveChannel,
  },
});

const Modal = () => {
  const { modalType, data } = useSelector(modalSelector);
  const dispatch = useDispatch();
  if (!modalType || !modalMapping(dispatch)[modalType]) {
    return null;
  }

  const currentChannelId = data?.channelId;

  const handleModalClose = () => {
    dispatch(closeModal());
  };

  const { component: ModalComponent, title, handleQuery } = modalMapping(dispatch)[modalType];

  return (
    <BootstrapModal show={!!modalType} onHide={handleModalClose}>
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
