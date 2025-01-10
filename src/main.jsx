import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router here
import App from './App'; // Your main app

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root') // Assuming your root element is id="root"
);
