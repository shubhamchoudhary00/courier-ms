import '../styles/Confirmation.css'

const Confirmation = ({ onConfirm, onCancel,isConfirm,setIsConfirm }) => {

    const handleCancel=()=>{
        setIsConfirm(false);
    }

  return (
    isConfirm ? (
    <div className='confirmation-overlay'>
      <div className='confirmation-container'>
        <span className='confirmation-message'>Are You Sure?</span>
        <div className='confirmation-buttons'>
          <button className='btn confirm-btn' onClick={onConfirm}>Confirm</button>
          <button className='btn cancel-btn' onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>) :null
  );
};

export default Confirmation;