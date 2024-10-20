import React, { useState } from 'react';
import { PulseLoader } from 'react-spinners'; // Import the PulseLoader from react-spinners
import '../styles/Confirmation.css';

const Confirmation = ({ onConfirm, onCancel, isConfirm, setIsConfirm }) => {
  const [isLoading, setIsLoading] = useState(false); // State to track if loading spinner is needed

  const handleConfirm = async () => {
    console.log('itnit -a')
    try {
      setIsLoading(true); // Show loader when confirm is clicked
      console.log('init')
      await onConfirm(); // Call the confirm action
      console.log('init')

      // After successful confirmation, hide the confirmation modal
      setIsConfirm(false);
    } catch (error) {
      console.error("Error during confirmation:", error);
    } finally {
      // Reset loading state after confirmation or error
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {  // Allow cancel only if not loading
      setIsConfirm(false);
    }
  };

  return (
    isConfirm ? (
      <div className='confirmation-overlay'>
        <div className='confirmation-container'>
          <span className='confirmation-message'>Are You Sure?</span>
          <div className='confirmation-buttons'>
            {/* Disable the Confirm button when loading is true */}
            {isLoading ? (
              <PulseLoader size={10} color={'#007bff'} />
            ) : (
              <button 
                className='btn confirm-btn' 
                onClick={handleConfirm}
                disabled={isLoading} // Disable button when loading
              >
                Confirm
              </button>
            )}
            <button 
              className='btn cancel-btn' 
              onClick={handleCancel} 
              disabled={isLoading} // Disable cancel if loading is in progress
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    ) : null
  );
};

export default Confirmation;
