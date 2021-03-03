import React, { useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import DOMPurify from 'dompurify';
import * as yup from 'yup';
import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import { channelsSelector } from '../slices/channelsSlice';
import { NETWORK_ERROR } from '../constants';

const MIN_LENGTH = 3;
const MAX_LENGTH = 30;
const validationSchema = (allChannels, currentChannelName) => yup.object()
  .shape({
    channelName: yup.string()
      .required('This field is required')
      .min(MIN_LENGTH, `Name should be between ${MIN_LENGTH} and ${MAX_LENGTH} symbols`)
      .max(MAX_LENGTH, `Name should be between ${MIN_LENGTH} and ${MAX_LENGTH} symbols`)
      .notOneOf(allChannels, 'This name is already taken')
      .notOneOf([currentChannelName], 'This is current channel name'),
  });

const ModalAddRenameChannel = ({ query, id, handleModalClose }) => {
  const currentChannelName = useSelector(channelsSelector)
    .find((channel) => channel.id === id)?.name || '';
  const allChannels = useSelector(channelsSelector)
    .map((channel) => channel.name);
  const channelInput = useRef(null);

  useEffect(() => {
    channelInput?.current?.select();
  });

  return (
    <Formik
      initialValues={{ channelName: currentChannelName }}
      validationSchema={validationSchema(allChannels, currentChannelName)}
      validateOnMount
      onSubmit={async (values, { setSubmitting, setFieldError }) => {
        const { channelName } = values;
        const name = DOMPurify
          .sanitize(channelName)
          .trim()
          .replace(/\s+/g, ' ');
        try {
          const result = await query(name);
          unwrapResult(result);
          setSubmitting(false);
          handleModalClose();
        } catch (e) {
          console.log(e);
          setFieldError('channelName', NETWORK_ERROR);
          channelInput.current.focus();
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, errors }) => {
        const inputClassList = cn('form-control', { 'is-invalid': errors.channelName === NETWORK_ERROR });
        const feedbackClassList = cn('d-block feedback position-absolute', {
          'text-muted': errors?.channelName !== NETWORK_ERROR,
          'invalid-feedback': errors?.channelName === NETWORK_ERROR,
        });

        return (
          <Form>
            <div className="form-group">
              <div className="input-group position-relative mb-2">
                <Field
                  type="text"
                  name="channelName"
                  aria-label="body"
                  autoComplete="off"
                  className={inputClassList}
                  innerRef={channelInput}
                />
                <div className={feedbackClassList}>{errors.channelName}</div>
              </div>
              <div className="d-flex justify-content-end">
                <Button
                  variant="secondary"
                  className="mr-2"
                  onClick={handleModalClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || errors.channelName}
                >
                  Submit
                </Button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ModalAddRenameChannel;
