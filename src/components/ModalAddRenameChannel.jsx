import React, { useEffect, useRef } from 'react';
import { Button, FormControl, FormGroup } from 'react-bootstrap';
import Feedback from 'react-bootstrap/Feedback';
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
const validationSchema = (currentChannelName, channelNames) => yup.object()
  .shape({
    channelName: yup.string()
      .required('This field is required')
      .min(MIN_LENGTH, `Name should be between ${MIN_LENGTH} and ${MAX_LENGTH} symbols`)
      .max(MAX_LENGTH, `Name should be between ${MIN_LENGTH} and ${MAX_LENGTH} symbols`)
      .notOneOf(channelNames, 'This name is already taken'),
  });

const ModalAddRenameChannel = ({ query, id, handleModalClose }) => {
  const currentChannelName = useSelector(channelsSelector)
    .find((channel) => channel.id === id)?.name || '';
  const channelNames = useSelector(channelsSelector)
    .map((channel) => channel.name);
  const channelInput = useRef(null);

  useEffect(() => {
    channelInput?.current?.select();
  });

  const onSubmit = async (values, handlers) => {
    const { setSubmitting, setFieldError } = handlers;
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
  };

  return (
    <Formik
      initialValues={{ channelName: currentChannelName }}
      validationSchema={validationSchema(currentChannelName, channelNames)}
      validateOnBlur
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid, errors }) => (
        <Form>
          <Field
            name="channelName"
            type="text"
            aria-label="body"
            autoComplete="off"
            disabled={isSubmitting}
          >
            {({ field }) => (
              <FormGroup>
                <FormGroup
                  controlId="channelName"
                  className="position-relative"
                >
                  <FormControl
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                    ref={channelInput}
                    placeholder="Type channel name..."
                    autoComplete="off"
                    isInvalid={!isValid && errors.channelName === NETWORK_ERROR}
                    className="mr-2"
                  />
                  {errors.channelName && (
                    <Feedback
                      className={cn('d-block position-absolute feedback', {
                        'text-muted': !isValid && errors.channelName !== NETWORK_ERROR,
                        'invalid-feedback': !isValid && errors.channelName === NETWORK_ERROR,
                      })}
                    >
                      {errors.channelName}
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
                    onClick={handleModalClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={(!isValid && errors.channelName !== NETWORK_ERROR) || isSubmitting || field.value === ''}
                  >
                    Submit
                  </Button>
                </FormGroup>
              </FormGroup>
            )}
          </Field>
        </Form>
      )}
    </Formik>
  );
};

export default ModalAddRenameChannel;
