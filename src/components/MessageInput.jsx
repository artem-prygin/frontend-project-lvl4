import React, { useContext, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  Form,
  Button,
  FormControl,
  FormGroup,
} from 'react-bootstrap';
import Feedback from 'react-bootstrap/Feedback';
import * as yup from 'yup';
import { useFormik } from 'formik';
import cn from 'classnames';
import Context from '../Context';
import { NETWORK_ERROR } from '../constants';
import { createMessageAsync } from '../slices/messagesData';

const MESSAGE_MAX_LENGTH = 400;
const getValidationSchema = yup.object()
  .shape({
    message: yup
      .string()
      .required('')
      .trim()
      .max(MESSAGE_MAX_LENGTH, `Maximum ${MESSAGE_MAX_LENGTH} symbols`),
  });

const handleSubmit = (
  dispatch,
  username,
  currentChannelId,
  messageInput,
) => async (values, handlers) => {
  const { resetForm, setSubmitting, setFieldError } = handlers;
  const { message: body } = values;
  try {
    const payload = { currentChannelId, body, username };
    const result = await dispatch(createMessageAsync(payload));
    setSubmitting(false);
    unwrapResult(result);
    resetForm();
    messageInput.current.focus();
  } catch (e) {
    console.log(e);
    messageInput.current.focus();
    setFieldError('message', NETWORK_ERROR);
  }
};

const MessageInput = ({ channel }) => {
  const dispatch = useDispatch();
  const { username } = useContext(Context);
  const currentChannelId = channel.id;
  const messageInput = useRef(null);

  useEffect(() => {
    messageInput?.current?.focus();
  }, [channel]);

  const formik = useFormik({
    initialValues: { message: '' },
    validationSchema: getValidationSchema,
    onSubmit: handleSubmit(dispatch, username, currentChannelId, messageInput),
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <FormGroup
        className="input-group"
        controlId="message"
      >
        <FormControl
          type="text"
          aria-label="body"
          disabled={formik.isSubmitting}
          onChange={formik.handleChange}
          value={formik.values.message}
          ref={messageInput}
          placeholder="Type message..."
          autoComplete="off"
          isInvalid={!formik.isValid && formik.errors.message === NETWORK_ERROR}
          className="mr-2"
        />
        <Button
          variant="primary"
          type="submit"
          disabled={(!formik.isValid && formik.errors.message !== NETWORK_ERROR) || formik.isSubmitting || formik.values.message === ''}
        >
          Submit
        </Button>
        {formik.errors.message && (
          <Feedback
            className={cn('d-block position-absolute feedback w-100 mt-1 start-0 small', {
              'text-muted': !formik.isValid && formik.errors.message !== NETWORK_ERROR,
              'invalid-feedback': !formik.isValid && formik.errors.message === NETWORK_ERROR,
            })}
          >
            {formik.errors.message}
          </Feedback>
        )}
      </FormGroup>
    </Form>
  );
};

export default MessageInput;
