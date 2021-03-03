import React, { useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { Button } from 'react-bootstrap';
import DOMPurify from 'dompurify';
import * as yup from 'yup';
import { Formik, Form, Field } from 'formik';
import cn from 'classnames';
import { currentChannelIdSelector } from '../slices/channelsSlice';
import Context from '../Context';
import { NETWORK_ERROR } from '../constants';
import { addMessageThunk } from '../slices/messagesSlice';

const MAX_LENGTH = 400;
const validationSchema = yup.object()
  .shape({
    message: yup.string()
      .required('This field is required')
      .max(MAX_LENGTH, `Maximum ${MAX_LENGTH} symbols`),
  });

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
        validationSchema={validationSchema}
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
        {({ isSubmitting, errors }) => {
          const inputClassList = cn('form-control mr-2', { 'is-invalid': errors.message === NETWORK_ERROR });
          const feedbackClassList = cn('d-block feedback position-absolute', {
            'text-muted': errors?.message !== NETWORK_ERROR,
            'invalid-feedback': errors?.message === NETWORK_ERROR,
          });
          return (
            <Form>
              <div className="form-group">
                <div className="input-group position-relative">
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
                    disabled={isSubmitting || errors.message}
                  >
                    Submit
                  </Button>
                  <div className={feedbackClassList}>{errors.message}</div>
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
