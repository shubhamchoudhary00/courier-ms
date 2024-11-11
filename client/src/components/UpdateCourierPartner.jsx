import { message } from "antd";
import host from "../APIRoute/APIRoute";
import axios from "axios";
import "../styles/UpdateParty.css";
import { useEffect, useState } from "react";
import Confirmation from "./Confirmation";

const UpdateCourierPartner = ({ open, setOpen, onClose, id }) => {
  const [isConfirm, setIsConfirm] = useState(false);

  const [courierData, setCourierData] = useState({
    companyName: "",
    address: "",
    pincode: "",
    city: "",
    country: "",
    state: "",
    personName: "",
    personNo: "",
    bankAccountNo: "",
    bankName: "",
    ifscCode: "",
    aadharNo: "",
    gstNo: "",
    transGstNo: "",
    pan: "",
    email: "",
    active: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourierData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getCourierData = async () => {
    if (id) {
      try {
        const { data } = await axios.get(`${host}/courier/get-courier/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (data.success) {
          const res = data.courier;
          setCourierData({
            companyName: res.companyName,
            address: res.address,
            pincode: res.pincode,
            city: res.city,
            state: res.state,
            country: res.country,
            personName: res.personName,
            personNo: res.personNo,
            bankAccountNo: res.bankAccountNo,
            bankName: res.bankName,
            ifscCode: res.ifscCode,
            aadharNo: res.aadharNo,
            gstNo: res.gstNo,
            transGstNo: res.transGstNo,
            pan: res.pan,
            email: res.email,
            active: res.active,
          });
        }
      } catch (error) {
        message.error(error.message);
      }
    }
  };

  const handleSubmit = async () => {
    setIsConfirm(true);
    try {
      const { data } = await axios.post(
        `${host}/courier/update-courier/${id}`,
        { courierData },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (data.success) {
        message.success("Updated Successfully");
        setCourierData({
          companyName: data.courier.companyName,
          address: data.courier.address,
          pincode: data.courier.pincode,
          city: data.courier.city,
          state: data.courier.state,
          country: data.courier.country,
          personName: data.courier.personName,
          personNo: data.courier.personNo,
          bankAccountNo: data.courier.bankAccountNo,
          bankName: data.courier.bankName,
          ifscCode: data.courier.ifscCode,
          aadharNo: data.courier.aadharNo,
          gstNo: data.courier.gstNo,
          transGstNo: data.courier.transGstNo,
          pan: data.courier.pan,
          email: data.courier.email,
          active: data.courier.active,
        });
      }
    } catch (error) {
      message.error(error.message);
    }
    setIsConfirm(false);
  };

  useEffect(() => {
    if (id) {
      getCourierData();
    }
  }, [id]);

  return (
    open && (
      <div className="modal-overlay" onClick={() => {
        setOpen(false);
        onClose();
      }}>
     
        {isConfirm && (
          <Confirmation
            isConfirm={isConfirm}
            setIsConfirm={setIsConfirm}
            onConfirm={handleSubmit}
          />
        )}
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-center mb-4" style={{ color: "#344f7d" }}>Update Courier Partner</h2>
          <form>
            <div className="col">
              <div className="row mb-3">
                <div className="col-4">
                  <label htmlFor="companyName" className="form-label">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="companyName"
                    name="companyName"
                    value={courierData.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div className="col-4">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={courierData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                    required
                  />
                </div>
                <div className="col-4">
                  <label htmlFor="pincode" className="form-label">
                    Pincode
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="pincode"
                    name="pincode"
                    value={courierData.pincode}
                    onChange={handleChange}
                    placeholder="Enter pincode"
                    required
                  />
                </div>
              </div>
  
              <div className="row mb-3">
                <div className="col-4">
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    name="city"
                    value={courierData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div className="col-4">
                  <label htmlFor="state" className="form-label">
                    State
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="state"
                    name="state"
                    value={courierData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    required
                  />
                </div>
                <div className="col-4">
                  <label htmlFor="country" className="form-label">
                    Country
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="country"
                    name="country"
                    value={courierData.country}
                    onChange={handleChange}
                    placeholder="Enter country"
                    required
                  />
                </div>
              </div>
  
              <div className="row mb-3">
                <div className="col-4">
                  <label htmlFor="personName" className="form-label">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="personName"
                    name="personName"
                    value={courierData.personName}
                    onChange={handleChange}
                    placeholder="Enter contact person name"
                    required
                  />
                </div>
  
                <div className="col-4">
                  <label htmlFor="personNo" className="form-label">
                    Contact Person Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="personNo"
                    name="personNo"
                    value={courierData.personNo}
                    onChange={handleChange}
                    placeholder="Enter contact person number"
                    required
                  />
                </div>
                <div className="col-4">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={courierData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </div>
              </div>
  
              <div className="row mb-3">
                <div className="col-4">
                  <label htmlFor="bankName" className="form-label">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="bankName"
                    name="bankName"
                    value={courierData.bankName}
                    onChange={handleChange}
                    placeholder="Enter bank name"
                    required
                  />
                </div>
                <div className="col-4">
                  <label htmlFor="bankAccountNo" className="form-label">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="bankAccountNo"
                    name="bankAccountNo"
                    value={courierData.bankAccountNo}
                    onChange={handleChange}
                    placeholder="Enter bank account number"
                    required
                  />
                </div>
                <div className="col-4">
                  <label htmlFor="ifscCode" className="form-label">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="ifscCode"
                    name="ifscCode"
                    value={courierData.ifscCode}
                    onChange={handleChange}
                    placeholder="Enter IFSC code"
                    required
                  />
                </div>
              </div>
  
              <div className="row mb-3">
                <div className="col-4">
                  <label htmlFor="aadharNo" className="form-label">
                    Aadhar Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="aadharNo"
                    name="aadharNo"
                    value={courierData.aadharNo}
                    onChange={handleChange}
                    placeholder="Enter Aadhar number"
                    required
                  />
                </div>
                <div className="col-4">
                  <label htmlFor="gstNo" className="form-label">
                    GST Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="gstNo"
                    name="gstNo"
                    value={courierData.gstNo}
                    onChange={handleChange}
                    placeholder="Enter GST number"
                    required
                  />
                </div>
                <div className="col-4">
                  <label htmlFor="transGstNo" className="form-label">
                    Transporter GST Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="transGstNo"
                    name="transGstNo"
                    value={courierData.transGstNo}
                    onChange={handleChange}
                    placeholder="Enter transporter GST number"
                    required
                  />
                </div>
              </div>
  
              <div className="row mb-3">
                <div className="col-4">
                  <label htmlFor="pan" className="form-label">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="pan"
                    name="pan"
                    value={courierData.pan}
                    onChange={handleChange}
                    placeholder="Enter PAN number"
                    required
                  />
                </div>
                {/*
                <div className="col-4">
                  <label htmlFor="active" className="form-label">
                    Active Status
                  </label>
                  <select
                    className="form-control"
                    id="active"
                    name="active"
                    value={courierData.active}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div> */}
              </div>
            <div className="btn-container">
            <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={handleSubmit}
          >
            Update
          </button>
          <button
          type="button"
          className="btn btn-danger mt-3"
          style={{ fontSize: "0.9rem", padding: "10px 20px" }}
          onClick={() => {
            setOpen(false);
            onClose();
          }}
        >
          Cancel
        </button>
            </div>
              
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default UpdateCourierPartner;
