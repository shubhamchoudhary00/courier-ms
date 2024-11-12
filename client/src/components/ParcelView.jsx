import { message, Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { DownloadOutlined } from '@ant-design/icons'; // Importing the download icon from Ant Design
import host from '../APIRoute/APIRoute';
import PropTypes from 'prop-types';
import '../styles/ParcelView.css';
import PdfViewer from "../helpers/PdfViewer";
import UpdateStatus from "./UpdateStatus";

const ParcelView = ({ id, open, setOpen }) => {
    const [parcel, setParcel] = useState({});
    const [filePreview, setFilePreview] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileType, setFileType] = useState('');
    const [addedBy, setAddedBy] = useState({});
    const [modifiedBy, setModifiedBy] = useState(null);
    const [edit,setEdit]=useState(false);
    const [deliveryParty,setDeliveryParty]=useState({})
    const [supplierParty,setSupplierParty]=useState({})
    const [courierParty,setCourierParty]=useState({})

    const handleCloseView = () => {
        setOpen(false);
    };

    const handleFileClick = (url) => {
        const cleanUrl = url.split('?')[0]; // Get the URL before any query parameters
        const fileExtension = cleanUrl.split('.').pop().toLowerCase(); // Extract the file extension
        setFileType(fileExtension);
        setFilePreview(url);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setFilePreview(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
    };

    const formatBoolean = (value) => {
        return value ? 'Yes' : 'No';
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Item Accepted By Courier":
                return "status status-accepted";
            case "Collected":
                return "status status-collected";
            case "Shipped":
                return "status status-shipped";
            case "In-Transit":
                return "status status-intransit";
            case "Arrived At Destination":
                return "status status-arrived";
            case "Out for Delivery":
                return "status status-outfordelivery";
            case "Delivered":
                return "status status-delivered";
            case "Picked Up":
                return "status status-pickedup";
            case "Unsuccessful Delivery Attempt":
                return "status status-unsuccessful";
            default:
                return "";
        }
    };

    const getParcelDetails = async () => {
        try {
            const { data } = await axios.get(`${host}/shipping/get-parcel-details/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (data.success) {
                setParcel(data.shipping);
                const delivery=await getPartyDetails(data?.shipping?.deliveryParty)
                const supplier=await getPartyDetails(data?.shipping?.supplierParty)
                const courier=await getCourierPartyDetails(data?.shipping?.courierCompanyName)

                // Fetch user details for addedBy and modifiedBy
                const addedByUser = await getUserDetails(data.shipping?.addedBy);
                const modifiedByUser = await getUserDetails(data.shipping?.modifiedBy);

                // Set state after user details are fetched
                setAddedBy(addedByUser);
                setModifiedBy(modifiedByUser);
                setDeliveryParty(delivery)
                setSupplierParty(supplier)
                setCourierParty(courier)

              
            }
        } catch (error) {
            // console.log(error.message);
            // message.error('Something went wrong');
        }
    };

    const getPartyDetails=async(id)=>{
        if(id){
            try{
                const res=await axios.get(`${host}/party/get-party/${id}`,{
                    headers:{
                        Authorization:`Bearer ${localStorage.getItem('token')}`
                    }
                });
                if(res.data.success){
                    return res.data.party;
                }
            }catch(error){
                // console.log(error.message)
                // message.error('Something went wrong')
            }
        }
        return null;
    }
   
   
    const getCourierPartyDetails=async(id)=>{
       if(id){
        try{
            const res=await axios.get(`${host}/courier/get-courier/${id}`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            });
            if(res.data.success){
                return res.data.courier
            }
        }catch(error){
            // console.log(error.message)
            // message.error('Something went wrong')
        }
       }
       return null;
    }

    const getUserDetails = async (id) => {
        if (id) {
            try {
                const { data } = await axios.get(`${host}/user/get-user-details/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (data.success) {
                    return data.user;
                }
            } catch (error) {
                // console.log(error.message);
                // message.error('Something went wrong');
            }
        }
        return null;
    };

    const handleUpdateClick = () => {
        setEdit(true); // Open the update modal
    };

  

    const handleUpdateModalClose = () => {
        setEdit(false); // Close the update modal
        getParcelDetails();
    };
    useEffect(() => {
        if (id) {
            getParcelDetails();
        }
    }, [id]);

    return (
        <>
            {open ? (
                <div className='top-container'>
               {edit && <UpdateStatus  open={edit} onClose={handleUpdateModalClose} currentStatus={parcel.currentStatus}
               trackingNumber={parcel._id} /> } 
                    <div className='black-container' onClick={handleCloseView}></div>
                    <div className='main-container' style={{ maxHeight: '650px', overflow: 'scroll' }}>
                        <div className="header-section">
                            <h1 className='heading'>Parcel Details</h1>
                            <span onClick={handleCloseView}>X</span>
                        </div>

                        <div className="parcel-details-section">
                            {/* Parcel Information */}
                            <div className="detail-item"><strong>Party Name:</strong> {deliveryParty?.companyName || 'N/A'}</div>
                            <div className="detail-item"><strong>Courier No:</strong> {parcel?.courierNo || 'N/A'}</div>
                            <div className="detail-item"><strong>Transport Type:</strong> {parcel?.transportType || 'N/A'}</div>
                            <div className="detail-item"><strong>Mode of Transport:</strong> {parcel?.modeOfTransport || 'N/A'}</div>
                            <div className="detail-item"><strong>Dispatch Date:</strong> {formatDate(parcel?.dispatchDate)}</div>
                            <div className="detail-item"><strong>Delivered Date:</strong> {formatDate(parcel?.deliveredDate)}</div>
                            <div className="detail-item"><strong>Account With:</strong> {courierParty?.bankName || 'N/A'}</div>
                            <div className="detail-item"><strong>Account No:</strong> {courierParty?.bankAccountNo || 'N/A'}</div>
                            <div className="detail-item"><strong>Actual Weight:</strong> {parcel?.actualWeight || 'N/A'} kg</div>
                            <div className="detail-item"><strong>Volumetric Weight:</strong> {parcel?.volumetricWeight || 'N/A'} kg</div>
                            <div className="detail-item"><strong>Charges:</strong> ${parcel?.charges || 'N/A'}</div>
                            <div className="detail-item " ><strong>Current Status:</strong> <span className={getStatusClass(parcel.currentStatus)}>{parcel?.currentStatus || 'N/A'}</span> <i onClick={handleUpdateClick} className="fa-solid fa-pen-to-square"></i> </div>
                            <div className="detail-item"><strong>Vehicle No:</strong> {parcel?.vehicleNo || 'N/A'}</div>
                            <div className="detail-item"><strong>GST Refund Status:</strong> {parcel?.gstRefundStatus || 'N/A'}</div>
                            <div className="detail-item"><strong>BOA Date:</strong> {formatDate(parcel?.boaDate)}</div>
                            <div className="detail-item"><strong>BOA Submitted to Bank:</strong> {formatBoolean(parcel?.boaSubmittedToBank)}</div>
                            <div className="detail-item"><strong>Shipping Bill No:</strong> {parcel?.shippingBillNo || 'N/A'}</div>
                            <div className="detail-item"><strong>Shipping Bill Date:</strong> {formatDate(parcel?.shippingBillDate)}</div>
                            <div className="detail-item"><strong>Shipping Bill Submitted to Bank:</strong> {formatBoolean(parcel?.shippingBillSubmittedToBank)}</div>
                        </div>

                        <h2 className='subheading'>Documents</h2>
                        <div className="documents-preview-section">
                            {parcel?.documents && (
                                <>
                                    {Object.entries(parcel.documents).map(([key, value]) => (
                                        value ? (
                                            <div className="document-item" key={key} style={{ display: 'flex', alignItems: 'center' }}>
                                                <span onClick={() => handleFileClick(value)} style={{ cursor: 'pointer' }}>
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </span>
                                                <a
                                                    href={value}
                                                    download
                                                    style={{ marginLeft: '10px', color: '#1890ff', cursor: 'pointer' }}
                                                >
                                                    <DownloadOutlined />
                                                </a>
                                            </div>
                                        ) : null
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Added By and Modified By Section */}
                        <div className="user-details" style={{ position: 'absolute', bottom: '20px', right: '20px', background: '#f0f0f0', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                            <div><strong>Added By:</strong> {addedBy?.name || 'N/A'}</div>
                            <div><strong>Modified By:</strong> {modifiedBy?.name || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Modal for File Preview */}
            <Modal
                title="Document Preview"
                open={isModalOpen}
                onCancel={handleModalClose}
                footer={null}
                width="80%"
                styles={{
                    body: { height: '80vh' } // Use styles.body instead of bodyStyle
                }}
            >
                {fileType === 'pdf' ? (
                    <PdfViewer fileUrl={filePreview} />
                ) : ['png', 'jpg', 'jpeg', 'gif'].includes(fileType) ? (
                    <img
                        src={filePreview}
                        alt="Image Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <h3>Preview not available for this file type.</h3>
                        <p>
                            <a href={filePreview} target="_blank" rel="noopener noreferrer">
                                Click here to download the file.
                            </a>
                        </p>
                    </div>
                )}
            </Modal>
        </>
    );
};

ParcelView.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired
};

export default ParcelView;
