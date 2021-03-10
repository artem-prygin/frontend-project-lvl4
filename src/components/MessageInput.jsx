import React, { useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  Form,
  Button,
  FormControl,
  FormGroup,
} from 'react-bootstrap';
import Feedback from 'react-bootstrap/Feedback';
import DOMPurify from 'dompurify';
import * as yup from 'yup';
import { useFormik } from 'formik';
import cn from 'classnames';
import Context from '../Context';
import { NETWORK_ERROR } from '../constants';
import { postMessageAsync } from '../slices/messagesSlice';
import { currentChannelIdSelector } from '../slices/channelsSlice';

const MESSAGE_MAX_LENGTH = 400;
const validationSchema = yup.object()
  .shape({
    message: yup.string()
      .required('')
      .max(MESSAGE_MAX_LENGTH, `Maximum ${MESSAGE_MAX_LENGTH} symbols`),
  });

const onSubmit = (
  dispatch,
  username,
  currentChannelId,
  messageInput,
) => async (values, handlers) => {
  const { resetForm, setSubmitting, setFieldError } = handlers;
  const { message } = values;
  const body = DOMPurify.sanitize(message);
  try {
    const payload = { currentChannelId, body, username };
    const result = await dispatch(postMessageAsync(payload));
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

const MessageInput = () => {
  const dispatch = useDispatch();
  const { username } = useContext(Context);
  const currentChannelId = useSelector(currentChannelIdSelector);
  const messageInput = useRef(null);

  useEffect(() => {
    messageInput?.current?.focus();
  }, [currentChannelId]);

  const formik = useFormik({
    initialValues: { message: '' },
    validationSchema,
    onSubmit: onSubmit(dispatch, username, currentChannelId, messageInput),
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
            className={cn('d-block position-absolute feedback invalid-feedback', {
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
