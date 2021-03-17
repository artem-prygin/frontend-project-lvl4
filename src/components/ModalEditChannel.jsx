import React, { useEffect, useRef } from 'react';
import {
  Form,
  Button,
  FormControl,
  FormGroup,
} from 'react-bootstrap';
import Feedback from 'react-bootstrap/Feedback';
import { useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import * as yup from 'yup';
import cn from 'classnames';
import { useFormik } from 'formik';
import { getChannelNames, getChannelById } from '../slices/channelsData';
import { NETWORK_ERROR } from '../constants';

const MIN_LENGTH = 3;
const MAX_LENGTH = 30;
const getValidationSchema = (channelNames) => yup.object()
  .shape({
    channelName: yup
      .string()
      .required('This field is required')
      .trim()
      .min(MIN_LENGTH, `Name should be between ${MIN_LENGTH} and ${MAX_LENGTH} symbols`)
      .max(MAX_LENGTH, `Name should be between ${MIN_LENGTH} and ${MAX_LENGTH} symbols`)
      .notOneOf(channelNames, 'This name is already taken'),
  });

const handleSubmit = (
  handleQuery,
  handleModalClose,
  id,
  channelInput,
) => async (values, handlers) => {
  const { setSubmitting, setFieldError } = handlers;
  const { channelName } = values;
  const trimmedChannelName = channelName
    .trim()
    .replace(/\s+/g, ' ');
  try {
    const result = await handleQuery(trimmedChannelName, id);
    unwrapResult(result);
    setSubmitting(false);
    handleModalClose();
  } catch (e) {
    console.log(e);
    setFieldError('channelName', NETWORK_ERROR);
    channelInput.current.focus();
    setSubmitting(false);
  }
};

const ModalEditChannel = ({ handleQuery, handleModalClose, id }) => {
  const currentChannel = useSelector(getChannelById(id));
  const currentChannelName = currentChannel?.name || '';
  const channelNames = useSelector(getChannelNames);
  const channelInput = useRef(null);

  useEffect(() => {
    channelInput?.current?.select();
  }, []);

  const formik = useFormik({
    initialValues: { channelName: currentChannelName },
    validationSchema: getValidationSchema(channelNames),
    onSubmit: handleSubmit(handleQuery, handleModalClose, id, channelInput),
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <FormGroup>
        <FormGroup
          controlId="channelName"
          className="position-relative"
        >
          <FormControl
            type="text"
            disabled={formik.isSubmitting}
            aria-label="body"
            onChange={formik.handleChange}
            value={formik.values.channelName}
            ref={channelInput}
            placeholder="Type channel name..."
            autoComplete="off"
            isInvalid={!formik.isValid && formik.errors.channelName === NETWORK_ERROR}
            className="mr-2"
          />
          {formik.errors.channelName && (
            <Feedback
              className={cn('d-block position-absolute feedback w-100 mt-1 small', {
                'text-muted': !formik.isValid && formik.errors.channelName !== NETWORK_ERROR,
                'invalid-feedback': !formik.isValid && formik.errors.channelName === NETWORK_ERROR,
              })}
            >
              {formik.errors.channelName}
            </Feedback>
          )}
        </FormGroup>
        <FormGroup
          className="d-flex justify-content-end mt-2"
          controlId="message"
        >
          <Button
            variant="secondary"
            className="mr-2"
            disabled={formik.isSubmitting}
            onClick={handleModalClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={(!formik.isValid && formik.errors.channelName !== NETWORK_ERROR)
            || formik.isSubmitting
            || formik.values.channelName === currentChannelName}
          >
            Submit
          </Button>
        </FormGroup>
      </FormGroup>
    </Form>
  );
};

export default ModalEditChannel;
