import React, { useContext, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import cn from 'classnames';
import { currentChannelIdSelector} from '../slices/currentChannelIdSlice';
import Context from '../Context';
import routes from '../routes';
import {Button} from "react-bootstrap";

const MessageInput = () => {
  const username = useContext(Context);
  const currentChannelId = useSelector(currentChannelIdSelector);
  const messageInput = useRef(null);

  return (
    <div className="mt-auto">
      <Formik
        initialValues={{message: ''}}
        validateOnBlur={false}
        validate={values => {
          const errors = {};
          if (values.message.trim().length === 0) {
            errors.message = 'This field is required';
          }
          return errors;
        }}
        onSubmit={async (values, {resetForm, setSubmitting, setFieldError}) => {
          const { message } = values;
          const body = DOMPurify.sanitize(message);
          try {
            await axios.post(routes
              .channelMessagesPath(currentChannelId), { data: { attributes: { body, username } } });
            messageInput.current.focus();
            resetForm();
          } catch (e) {
            setFieldError('message', 'Network error');
            messageInput.current.focus();
          }
          setSubmitting(false);
        }}>
        {({isSubmitting, errors}) => {
          const inputClassList = cn('mr-2 form-control', {'is-invalid': errors.message});
          return (
            <Form>
              <div className="form-group">
                <div className="input-group">
                  <Field type="text" name="message" aria-label="body" className={inputClassList} innerRef={messageInput}/>
                  <Button variant="primary" type="submit" disabled={isSubmitting || errors.message}>Submit</Button>
                  <div className="d-block invalid-feedback">{errors.message}</div>
                </div>
              </div>
            </Form>
          )}}
      </Formik>
    </div>
  )
};

export default MessageInput;
