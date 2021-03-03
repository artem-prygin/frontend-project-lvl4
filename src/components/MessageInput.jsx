import React, { useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { Button } from 'react-bootstrap';
import DOMPurify from 'dompurify';
import { Formik, Form, Field } from 'formik';
import cn from 'classnames';
import { currentChannelIdSelector } from '../slices/channelsSlice';
import Context from '../Context';
import { NETWORK_ERROR } from '../constants';
import { addMessageThunk } from '../slices/messagesSlice';

const MessageInput = () => {
  const dispatch = useDispatch();
  const { username } = useContext(Context);
  const currentChannelId = useSelector(currentChannelIdSelector);
  const messageInput = useRef(null);

  useEffect(() => {
    messageInput?.current?.focus();
  });

  return (
    <div className="mt-auto">
      <Formik
        initialValues={{ message: '' }}
        validateOnBlur={false}
        onSubmit={async (values, { resetForm, setSubmitting, setFieldError }) => {
          const { message } = values;
          const body = DOMPurify.sanitize(message);
          try {
            const result = await dispatch(addMessageThunk([currentChannelId, body, username]));
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
        }}
      >
        {({ isSubmitting, values, errors }) => {
          const inputClassList = cn('mr-2 form-control', { 'is-invalid': errors.message });
          return (
            <Form>
              <div className="form-group">
                <div className="input-group">
                  <Field
                    type="text"
                    name="message"
                    aria-label="body"
                    autoComplete="off"
                    disabled={isSubmitting}
                    className={inputClassList}
                    innerRef={messageInput}
                  />
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting || values.message.trim().length === 0 || errors.message}
                  >
                    Submit
                  </Button>
                  <div className="d-block invalid-feedback">{errors.message}</div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default MessageInput;
