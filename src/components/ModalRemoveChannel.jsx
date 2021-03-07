import React, { useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { unwrapResult } from '@reduxjs/toolkit';
import Feedback from 'react-bootstrap/Feedback';

const ModalRemoveChannel = ({ handleQuery, handleModalClose, id }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removingError, setRemovingError] = useState(false);

  const handleChannelRemove = async () => {
    try {
      setRemovingError(false);
      setIsSubmitting(true);
      const result = await handleQuery(id);
      unwrapResult(result);
      setRemovingError(false);
      setIsSubmitting(false);
      handleModalClose();
    } catch (e) {
      console.log(e);
      setRemovingError(true);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h5 className="mb-2">Are you sure to remove channel and all its messages?</h5>
      {removingError
      && <Feedback className="d-block invalid-feedback">Sorry, something went wrong. Try again later</Feedback>}
      <hr />
      <ButtonGroup className="d-flex justify-content-between mt-2">
        <Button
          variant="secondary"
          className="mr-2 flex-grow-0"
          onClick={handleModalClose}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          className="flex-grow-0"
          disabled={isSubmitting}
          onClick={handleChannelRemove}
        >
          Submit
        </Button>
      </ButtonGroup>
    </>
  );
};

export default ModalRemoveChannel;
