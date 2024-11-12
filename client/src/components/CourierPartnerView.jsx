import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import host from '../APIRoute/APIRoute';

import '../styles/ParcelView.css';

const CourierPartnerView = ({ id, open, setOpen }) => {
  const [courier, setCourier] = useState({});
  const [loading, setLoading] = useState(false);

  const handleCloseView = () => {
    setOpen(false);
  };

  const getCourierDetails = async () => {
    setLoading(true); // Show loading state while fetching data
    try {
      const { data } = await axios.get(`${host}/courier/get-courier/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (data.success) {
        console.log(data)
        setCourier(data.courier);
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
        getCourierDetails();
    }
  }, [id, open]);

  return (
    <>
      {open && (
        <div className='top-container'>
          <div className='black-container' onClick={handleCloseView}></div>
          <div className='main-container' style={{ maxHeight: '650px', overflow: 'scroll' }}>
            <div className="header-section">
              <h1 className='heading'>Courier Partner Details</h1>
              <span onClick={handleCloseView}>X</span>
            </div>

            {/* Conditional rendering for loading state */}
            {loading ? (
              <div className="loader-container">
                <span>Loading...</span> {/* Add a spinner or loader here */}
              </div>
            ) : (
              <div className="parcel-details-section">
                <div className="detail-item"><strong>Company Name:</strong> {courier?.companyName || 'N/A'}</div>
                <div className="detail-item"><strong>Address:</strong> {courier?.address || 'N/A'}</div>
                <div className="detail-item"><strong>City:</strong> {courier?.city || 'N/A'}</div>
                <div className="detail-item"><strong>State:</strong> {courier?.state || 'N/A'}</div>
                <div className="detail-item"><strong>Pincode:</strong> {courier?.pincode || 'N/A'}</div>
                <div className="detail-item"><strong>Country:</strong> {courier?.country || 'N/A'}</div>
                <div className="detail-item"><strong>Gst No:</strong> {courier?.gstNo || 'N/A'}</div>
                <div className="detail-item"><strong>Trans Gst No:</strong> {courier?.transGstNo || 'N/A'}</div>
                <div className="detail-item"><strong>Pan:</strong> {courier?.pan || 'N/A'}</div>
                <div className="detail-item"><strong>Bank Account No:</strong> {courier?.bankAccountNo || 'N/A'}</div>
                <div className="detail-item"><strong>Bank Name:</strong> {courier?.bankName || 'N/A'}</div>
                <div className="detail-item"><strong>IFSC Code:</strong> {courier?.ifscCode || 'N/A'}</div>
                <div className="detail-item"><strong>Aadhar No:</strong> {courier?.aadharNo || 'N/A'}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CourierPartnerView;
