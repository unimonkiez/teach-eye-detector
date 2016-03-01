import React from 'react';
import ReactDOM from 'react-dom';
import Sandbox from './sandbox.js';

window.onload = () => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  ReactDOM.render(React.createElement(Sandbox), div);
};
