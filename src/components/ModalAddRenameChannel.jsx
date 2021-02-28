import React, { useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import DOMPurify from 'dompurify';
import * as yup from 'yup';
import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import { closeModal, modalSelector } from '../slices/modalSlice';
import { addChannelThunk, channelsSelector, renameChannelThunk } from '../slices/channelsSlice';
import {
  NAME_MIN_LENGTH as MIN,
  NAME_MAX_LENGTH as MAX,
  MODAL_ADD,
  MODAL_RENAME, NETWORK_ERROR,
} from '../constants';

const componentModalTypes = [MODAL_ADD, MODAL_RENAME];

const ModalAddRenameChannel = () => {
  const dispatch = useDispatch();
  const { modalType, data } = useSelector(modalSelector);
  const currentChannelId = +data?.channelId;
  const currentChannelName = useSelector(channelsSelector)
    .find((channel) => channel.id === currentChannelId)?.name || '';
  const allChannels = useSelector(channelsSelector)
    .filter((channel) => channel.id !== currentChannelId)
    .map((channel) => channel.name);
  const channelInput = useRef(null);

  const modalMapping = {
    [MODAL_ADD]: {
      title: 'Add channel',
      query: async (name) => {
        dispatch(addChannelThunk(name));
      },
    },
    [MODAL_RENAME]: {
      title: 'Rename channel',
      query: async (name) => {
        dispatch(renameChannelThunk([name, currentChannelId]));
      },
    },
  };

  useEffect(() => {
    if (channelInput.current) {
      channelInput.current.select();
    }
  });

  const isModalActive = componentModalTypes.includes(modalType);

  const handleModalClose = () => {
    dispatch(closeModal());
  };

  const validationSchema = yup.object().shape({
    channelName: yup.string()
      .required('This field is required')
      .min(`${MIN}`, `Name should be between ${MIN} and ${MAX} symbols`)
      .max(`${MAX}`, `Name should be between ${MIN} and ${MAX} symbols`)
      .notOneOf(allChannels, 'This name is already taken'),
  });

  return (
    <Modal show={isModalActive} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalMapping[modalType]?.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Formik
          initialValues={{ channelName: currentChannelName }}
          validationSchema={validationSchema}
          validateOnMount
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            const { channelName } = values;
            const name = DOMPurify
              .sanitize(channelName)
              .trim()
              .replace(/\s+/g, ' ');
            if (modalType === MODAL_RENAME && channelName === currentChannelName) {
              dispatch(closeModal());
              return;
            }
            try {
              await modalMapping[modalType].query(name);
              setSubmitting(false);
              dispatch(closeModal());
            } catch (e) {
              setFieldError('channelName', NETWORK_ERROR);
              channelInput.current.focus();
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, errors }) => {
            const inputClassList = cn('form-control', { 'is-invalid': errors.channelName === NETWORK_ERROR });
            const feedbackClassList = cn('d-block feedback', {
              'text-muted': errors?.channelName !== NETWORK_ERROR,
              'invalid-feedback': errors?.channelName === NETWORK_ERROR,
            });

            return (
              <Form>
                <div className="form-group">
                  <div className="input-group mb-2">
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
      </Modal.Body>
    </Modal>
  );
};

export default ModalAddRenameChannel;
