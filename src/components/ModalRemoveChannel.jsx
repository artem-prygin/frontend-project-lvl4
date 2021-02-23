import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { closeModal, modalSelector } from '../slices/modalSlice';
import routes from '../routes';
import { MODAL_REMOVE } from '../slices/constants';

const ModalRemoveChannel = () => {
  const dispatch = useDispatch();
  const { modalType, data } = useSelector(modalSelector);
  const isRemoveModalActive = (modalType === MODAL_REMOVE);
  const channelId = +data?.channelId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removingError, setRemovingError] = useState(false);

  const handleModalClose = () => {
    setRemovingError(false);
    setIsSubmitting(false);
    dispatch(closeModal());
  };

  const handleChannelRemove = async () => {
    try {
      setRemovingError(false);
      setIsSubmitting(true);
      await axios.delete(routes
        .channelPath(channelId));
      setIsSubmitting(false);
      dispatch(closeModal());
    } catch (e) {
      setRemovingError(true);
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={isRemoveModalActive} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Remove channel</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h5 className="mb-2">Are you sure to remove channel and all its messages?</h5>
        {isSubmitting && <div className="d-block valid-feedback">Removing the channel, please wait...</div>}
        {removingError && <div className="d-block invalid-feedback">Sorry, something went wrong. Try again later</div>}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          className="mr-2"
          onClick={handleModalClose}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          disabled={isSubmitting}
          onClick={handleChannelRemove}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRemoveChannel;
