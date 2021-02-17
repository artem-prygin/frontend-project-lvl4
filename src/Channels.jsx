import React from 'react';

const Channels = ({ channels }) => (
  <ul className="nav flex-column nav-pills nav-fill">
    {channels.map(({ id, name }) => <li className="nav-item" key={id}>{name}</li>)}
  </ul>
);

export default Channels;
