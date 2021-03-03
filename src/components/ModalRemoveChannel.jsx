import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { unwrapResult } from '@reduxjs/toolkit';

const ModalRemoveChannel = ({ query, id, handleModalClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removingError, setRemovingError] = useState(false);

  const handleChannelRemove = async () => {
    try {
      setRemovingError(false);
      setIsSubmitting(true);
      const result = query(id);
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
      && <div className="d-block invalid-feedback">Sorry, something went wrong. Try again later</div>}
      <hr />
      <div className="d-flex justify-content-between mt-2">
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
      </div>
    </>
  );
};

export default ModalRemoveChannel;
