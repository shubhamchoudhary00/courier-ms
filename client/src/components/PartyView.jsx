import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import host from '../APIRoute/APIRoute';

import '../styles/ParcelView.css';

const PartyView = ({ id, open, setOpen }) => {
  const [party, setParty] = useState({});
  const [loading, setLoading] = useState(false);

  const handleCloseView = () => {
    setOpen(false);
  };

  const getPartyDetails = async () => {
    setLoading(true); // Show loading state while fetching data
    try {
      const { data } = await axios.get(`${host}/party/get-party/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (data.success) {
        console.log(data)
        setParty(data.party);
      }
    } catch (error) {
      // console.log(error.message);
      // message.error('Something went wrong');
    } finally {
      setLoading(false); // Hide loading after request completes
    }
  };

  useEffect(() => {
    console.log(id)
    if (id && open) {
      getPartyDetails();
    }
  }, [id, open]);

  return (
    <>
      {open && (
        <div className='top-container'>
          <div className='black-container' onClick={handleCloseView}></div>
          <div className='main-container' style={{ maxHeight: '650px', overflow: 'scroll' }}>
            <div className="header-section">
              <h1 className='heading'>Party Details</h1>
              <span onClick={handleCloseView}>X</span>
            </div>

            {/* Conditional rendering for loading state */}
            {loading ? (
              <div className="loader-container">
                <span>Loading...</span> {/* Add a spinner or loader here */}
              </div>
            ) : (
              <div className="parcel-details-section">
                <div className="detail-item"><strong>Company Name:</strong> {party?.companyName || 'N/A'}</div>
                <div className="detail-item"><strong>Address:</strong> {party?.address || 'N/A'}</div>
                <div className="detail-item"><strong>City:</strong> {party?.city || 'N/A'}</div>
                <div className="detail-item"><strong>State:</strong> {party?.state || 'N/A'}</div>
                <div className="detail-item"><strong>Pincode:</strong> {party?.pincode || 'N/A'}</div>
                <div className="detail-item"><strong>Country:</strong> {party?.country || 'N/A'}</div>
                <div className="detail-item"><strong>Gst No:</strong> {party?.gstNo || 'N/A'}</div>
                <div className="detail-item"><strong>Trans Gst No:</strong> {party?.transGstNo || 'N/A'}</div>
                <div className="detail-item"><strong>Pan:</strong> {party?.pan || 'N/A'}</div>
                <div className="detail-item"><strong>Bank Account No:</strong> {party?.bankAccountNo || 'N/A'}</div>
                <div className="detail-item"><strong>Bank Name:</strong> {party?.bankName || 'N/A'}</div>
                <div className="detail-item"><strong>IFSC Code:</strong> {party?.ifscCode || 'N/A'}</div>
                <div className="detail-item"><strong>Aadhar No:</strong> {party?.aadharNo || 'N/A'}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PartyView;
