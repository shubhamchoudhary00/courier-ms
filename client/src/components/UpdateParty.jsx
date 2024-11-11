import { message } from "antd";
import host from "../APIRoute/APIRoute";
import axios from "axios";
import "../styles/UpdateParty.css";
import { useEffect, useState } from "react";
import Confirmation from "./Confirmation";

const UpdateParty = ({ open, setOpen, onClose, id }) => {
  const [isConfirm, setIsConfirm] = useState(false);

  const [partyData, setPartyData] = useState({
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
    email:'',
    active: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPartyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getPartyData = async () => {
    if (id) {
      try {
        const { data } = await axios.get(`${host}/party/get-party/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (data.success) {
          const res = data.party;
          setPartyData({
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
            email:res.email,
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
        `${host}/party/update-party/${id}`,
        { partyData },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (data.success) {
        message.success("Updated Successfully");
        setPartyData({
          companyName: data.party.companyName,
          address: data.party.address,
          pincode: data.party.pincode,
          city: data.party.city,
          state: data.party.state,
          country: data.party.country,
          personName: data.party.personName,
          personNo: data.party.personNo,
          bankAccountNo: data.party.bankAccountNo,
          bankName: data.party.bankName,
          ifscCode: data.party.ifscCode,
          aadharNo: data.party.aadharNo,
          gstNo: data.party.gstNo,
          transGstNo: data.party.transGstNo,
          pan: data.party.pan,
          email:data.party.email,
          active: data.party.active,
        });
      }
    } catch (error) {
      message.error(error.message);
    }
    setIsConfirm(false);
  };

  useEffect(() => {
    if (id) {
      getPartyData();
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
          <h2 className="text-center mb-4" style={{ color: "#344f7d" }}>Update Party</h2>
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
                    value={partyData.companyName}
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
                    value={partyData.address}
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
                    value={partyData.pincode}
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
                    value={partyData.city}
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
                    value={partyData.state}
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
                    value={partyData.country}
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
                    value={partyData.personName}
                    onChange={handleChange}
                    placeholder="Enter contact person's name"
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
                    value={partyData.personNo}
                    onChange={handleChange}
                    placeholder="Enter contact number"
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
                    value={partyData.email}
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
                    value={partyData.bankName}
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
                    value={partyData.bankAccountNo}
                    onChange={handleChange}
                    placeholder="Enter account number"
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
                    value={partyData.ifscCode}
                    onChange={handleChange}
                    placeholder="Enter IFSC code"
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-4">
                  <label htmlFor="gstNo" className="form-label">
                    GST No
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="gstNo"
                    name="gstNo"
                    value={partyData.gstNo}
                    onChange={handleChange}
                    placeholder="Enter GST No"
                    required
                  />
                </div>
                <div className="col-4">
                  <label htmlFor="transGstNo" className="form-label">
                    Transport GST No
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="transGstNo"
                    name="transGstNo"
                    value={partyData.transGstNo}
                    onChange={handleChange}
                    placeholder="Enter Trans GSt No"
                    required
                  />
                </div>
                <div className="col-4">
                  <label htmlFor="pan" className="form-label">
                    PAN No
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="pan"
                    name="pan"
                    value={partyData.pan}
                    onChange={handleChange}
                    placeholder="Enter PAN No"
                    required
                  />
                </div>
                
              </div>
              <div className="row mb-3">
                <div className="col-4">
                  <label htmlFor="aadharNo" className="form-label">
                    Aadhar No
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="aadharNo"
                    name="aadharNo"
                    value={partyData.aadharNo}
                    onChange={handleChange}
                    placeholder="Enter aadhar No"
                    required
                  />
                </div>
               
                
              </div>
            </div>
  
            <button type="button" className="btn btn-primary" onClick={()=>setIsConfirm(true)}>Update</button>
            <button
            type="button"
            className="btn btn-danger"
            style={{ fontSize: "0.9rem", padding: "10px 20px" }}
            onClick={() => {
              setOpen(false);
              onClose();
            }}
          >
            Cancel
          </button>
          </form>
        </div>
      </div>
    )
  );
};
  
export default UpdateParty;
