import { Modal, Button, Select, Input, message } from "antd";
import { useState } from "react";
import axios from "axios";
import PropTypes from 'prop-types';
import host from "../APIRoute/APIRoute";

const { Option } = Select;




const UpdateStatus = ({ open, onClose, currentStatus, trackingNumber }) => {
    const [updatedStatus, setUpdatedStatus] = useState(currentStatus);

    const handleStatusChange = (value) => {
        setUpdatedStatus(value);
        console.log(value)
    };
    const updateCurrentStatus=async()=>{
        if(trackingNumber){
            try{
                const {data}=await axios.post(`${host}/shipping/update-status/${trackingNumber}`,{value:updatedStatus},{headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }});
                if(data.success){
                    message.success(data.message)
                    onClose();
                }
            }catch(error){
                message.error(error.message)
            }
        }
    }

    return (
        <Modal
            title="Update Parcel Status"
            open={open}
            onCancel={onClose}
            footer={null}
        >
            <div className="update-status-container">
                <div className="detail-item">
                    <strong>Tracking Number:</strong>
                    <Input value={trackingNumber} disabled />
                </div>

                <div className="detail-item">
                    <strong>Current Status:</strong>
                    <Select defaultValue={currentStatus} style={{ width: '100%' }}  onChange={handleStatusChange}>
                        <Option value="Item Accepted By Courier">Item Accepted By Courier</Option>
                        <Option value="Collected">Collected</Option>
                        <Option value="Shipped">Shipped</Option>
                        <Option value="In-Transit">In-Transit</Option>
                        <Option value="Arrived At Destination">Arrived At Destination</Option>
                        <Option value="Out for Delivery">Out for Delivery</Option>
                        <Option value="Delivered">Delivered</Option>
                        <Option value="Picked Up">Picked Up</Option>
                        <Option value="Unsuccessful Delivery Attempt">Unsuccessful Delivery Attempt</Option>
                    </Select>
                </div>

                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <Button type="primary" onClick={updateCurrentStatus}>Update Status</Button>
                </div>
            </div>
        </Modal>
    );
};

UpdateStatus.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    currentStatus: PropTypes.string.isRequired,
    trackingNumber: PropTypes.string.isRequired
};

export default UpdateStatus;
