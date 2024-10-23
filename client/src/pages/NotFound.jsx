// src/pages/NotFound.js

import { Link } from 'react-router-dom';
import '../styles/NotFound.css'; // Assuming you'll create a custom CSS for styling

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-message">Oops! The page you are looking for doesn't exist.</p>
      <Link to="/" className="notfound-home-link">Go Back to Home</Link>
    </div>
  );
};

export default NotFound;
