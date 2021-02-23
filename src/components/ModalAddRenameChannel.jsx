import React, { useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import DOMPurify from 'dompurify';
import axios from 'axios';
import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import routes from '../routes';
import { closeModal, modalSelector } from '../slices/modalSlice';
import { channelsSelector } from '../slices/channelsSlice';

const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 30;
const MODAL_ADD = 'add';
const MODAL_RENAME = 'rename';
const modalTypes = [MODAL_ADD, MODAL_RENAME];

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
        await axios
          .post(routes.channelsPath(), { data: { attributes: { name } } });
      },
    },
    [MODAL_RENAME]: {
      title: 'Rename channel',
      query: async (name) => {
        await axios
          .patch(routes.channelPath(currentChannelId), { data: { attributes: { name } } });
      },
    },
  };

  useEffect(() => {
    if (channelInput.current) {
      channelInput.current.select();
    }
  });

  const isModalActive = modalTypes.includes(modalType);

  const handleModalClose = () => {
    dispatch(closeModal());
  };

  return (
    <Modal show={isModalActive} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalMapping[modalType]?.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Formik
          initialValues={{ channelName: currentChannelName }}
          validate={(values) => {
            const errors = {};
            const channelName = values.channelName.trim();
            if (channelName.length === 0) {
              errors.channelName = 'This field is required';
            }
            if (channelName.length < NAME_MIN_LENGTH || channelName.length > NAME_MAX_LENGTH) {
              errors.channelName = `Name should be between ${NAME_MIN_LENGTH} and ${NAME_MAX_LENGTH} symbols`;
            }
            if (allChannels.includes(channelName)) {
              errors.channelName = 'This name is already taken';
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            const { channelName } = values;
            const name = DOMPurify.sanitize(channelName);
            if (modalType === MODAL_RENAME && channelName === currentChannelName) {
              dispatch(closeModal());
              return;
            }
            try {
              await modalMapping[modalType].query(name);
              setSubmitting(false);
              dispatch(closeModal());
            } catch (e) {
              setFieldError('channelName', 'Network error');
              channelInput.current.focus();
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, errors }) => {
            const inputClassList = cn('form-control', { 'is-invalid': errors.channelName });
            return (
              <Form>
                <div className="form-group">
                  <div className="input-group mb-2">
                    <Field type="text" name="channelName" aria-label="body" className={inputClassList} innerRef={channelInput} />
                    <div className="d-block invalid-feedback">{errors.channelName}</div>
                  </div>
                  <div className="d-flex justify-content-end">
                    <Button variant="secondary" className="mr-2" onClick={handleModalClose}>Cancel</Button>
                    <Button variant="primary" type="submit" disabled={isSubmitting || errors.channelName}>Submit</Button>
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
