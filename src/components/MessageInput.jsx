import React, { useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { Button, FormControl, FormGroup } from 'react-bootstrap';
import Feedback from 'react-bootstrap/Feedback';
import DOMPurify from 'dompurify';
import * as yup from 'yup';
import { Formik, Field, Form } from 'formik';
import cn from 'classnames';
import { currentChannelIdSelector } from '../slices/channelsSlice';
import Context from '../Context';
import { NETWORK_ERROR } from '../constants';
import { postMessage } from '../slices/messagesSlice';

const MESSAGE_MAX_LENGTH = 400;
const validationSchema = yup.object()
  .shape({
    message: yup.string()
      .required('This field is required')
      .max(MESSAGE_MAX_LENGTH, `Maximum ${MESSAGE_MAX_LENGTH} symbols`),
  });

const MessageInput = () => {
  const dispatch = useDispatch();
  const { username } = useContext(Context);
  const currentChannelId = useSelector(currentChannelIdSelector);
  const messageInput = useRef(null);

  const onSubmit = async (values, handlers) => {
    const { resetForm, setSubmitting, setFieldError } = handlers;
    const { message } = values;
    const body = DOMPurify.sanitize(message);
    try {
      const payload = { currentChannelId, body, username };
      const result = await dispatch(postMessage(payload));
      unwrapResult(result);
      resetForm();
      messageInput.current.focus();
      setSubmitting(false);
    } catch (e) {
      console.log(e);
      setFieldError('message', NETWORK_ERROR);
      messageInput.current.focus();
      setSubmitting(false);
    }
  };

  useEffect(() => {
    messageInput?.current?.focus();
  });

  return (
    <div className="mt-auto">
      <Formik
        initialValues={{ message: '' }}
        validationSchema={validationSchema}
        className="mt-auto"
        onSubmit={onSubmit}
        render={({ isSubmitting, isValid, errors }) => (
          <Form>
            <Field name="message">
              {({ field }) => (
                <FormGroup
                  className="input-group"
                  controlId="message"
                >
                  <FormControl
                    type="text"
                    aria-label="body"
                    disabled={isSubmitting}
                    value={field.value}
                    onChange={field.onChange}
                    ref={messageInput}
                    placeholder="Type message..."
                    autoComplete="off"
                    isInvalid={!isValid && errors.message === NETWORK_ERROR}
                    className="mr-2"
                  />
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={(!isValid && errors.message !== NETWORK_ERROR) || isSubmitting || field.value === ''}
                  >
                    Submit
                  </Button>
                  {errors.message && (
                    <Feedback
                      className={cn('d-block position-absolute feedback', {
                        'text-muted': !isValid && errors.message !== NETWORK_ERROR,
                        'invalid-feedback': !isValid && errors.message === NETWORK_ERROR,
                      })}
                    >
                      {errors.message}
                    </Feedback>
                  )}
                </FormGroup>
              )}
            </Field>
          </Form>
        )}
      />
    </div>
  );
};

export default MessageInput;
