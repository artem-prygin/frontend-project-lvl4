import React, { useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { Formik, Form, Field } from 'formik';
import cn from 'classnames';
import { currentChannelIdSelector } from '../slices/channelsSlice';
import Context from '../Context';
import routes from '../routes';
import { NETWORK_ERROR } from '../constants';

const MessageInput = () => {
  const { username } = useContext(Context);
  const currentChannelId = useSelector(currentChannelIdSelector);
  const messageInput = useRef(null);

  useEffect(() => {
    if (messageInput.current) {
      messageInput.current.focus();
    }
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
            await axios.post(routes
              .channelMessagesPath(currentChannelId), { data: { attributes: { body, username } } });
            resetForm();
            messageInput.current.focus();
          } catch (e) {
            setFieldError('message', NETWORK_ERROR);
            messageInput.current.focus();
          }
          setSubmitting(false);
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
