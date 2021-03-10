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
import DOMPurify from 'dompurify';
import * as yup from 'yup';
import cn from 'classnames';
import { useFormik } from 'formik';
import {
  channelNamesSelector,
  channelsSelector,
  currentChannelNameByIdSelector,
} from '../slices/channelsSlice';
import { NETWORK_ERROR } from '../constants';

const MIN_LENGTH = 3;
const MAX_LENGTH = 30;
const validationSchema = (currentChannelName, channelNames) => yup.object()
  .shape({
    channelName: yup.string()
      .required('')
      .min(MIN_LENGTH, `Name should be between ${MIN_LENGTH} and ${MAX_LENGTH} symbols`)
      .max(MAX_LENGTH, `Name should be between ${MIN_LENGTH} and ${MAX_LENGTH} symbols`)
      .notOneOf(channelNames, 'This name is already taken'),
  });

const onSubmit = (
  handleQuery,
  handleModalClose,
  id,
  channelInput,
) => async (values, handlers) => {
  const { setSubmitting, setFieldError } = handlers;
  const { channelName } = values;
  const sanitizedChannelName = DOMPurify
    .sanitize(channelName)
    .trim()
    .replace(/\s+/g, ' ');
  try {
    const result = await handleQuery(sanitizedChannelName, id);
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
  const channels = useSelector(channelsSelector);
  const currentChannelName = useSelector(currentChannelNameByIdSelector(id));
  const channelNames = useSelector(channelNamesSelector);
  const channelInput = useRef(null);

  useEffect(() => {
    channelInput?.current?.select();
  }, [channels]);

  const formik = useFormik({
    initialValues: { channelName: currentChannelName },
    validationSchema: validationSchema(currentChannelName, channelNames),
    onSubmit: onSubmit(handleQuery, handleModalClose, id, channelInput),
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
              className={cn('d-block position-absolute feedback', {
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
