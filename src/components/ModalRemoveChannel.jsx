import React, { useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { unwrapResult } from '@reduxjs/toolkit';
import Feedback from 'react-bootstrap/Feedback';

const ModalRemoveChannel = ({ handleQuery, handleModalClose, id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [removingError, setRemovingError] = useState(false);

  const handleChannelRemove = async () => {
    try {
      setRemovingError(false);
      setIsLoading(true);
      const result = await handleQuery(id);
      unwrapResult(result);
      setIsLoading(false);
      handleModalClose();
    } catch (e) {
      console.log(e);
      setRemovingError(true);
      setIsLoading(false);
    }
  };

  return (
    <>
      <p className="mb-3">Are you sure to remove channel and all its messages?</p>
      {removingError
        && <Feedback className="d-block invalid-feedback mb-2">Sorry, something went wrong. Try again later</Feedback>}
      <ButtonGroup className="d-flex justify-content-between mt-2">
        <Button
          variant="secondary"
          className="mr-2 flex-grow-0 border-radius"
          disabled={isLoading}
          onClick={handleModalClose}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          className="flex-grow-0 border-radius"
          disabled={isLoading}
          onClick={handleChannelRemove}
        >
          Submit
        </Button>
      </ButtonGroup>
    </>
  );
};

export default ModalRemoveChannel;
