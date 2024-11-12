import PropTypes from 'prop-types';
import FormatDate from '../helpers/FormatDate';
import ParcelView from './ParcelView';
import { useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import '../styles/ParcelTable.css';
import { message } from 'antd';
import axios from 'axios';
import Confirmation from './Confirmation';
import host from '../APIRoute/APIRoute';
import { useSelector } from 'react-redux';

const ParcelTable = ({ data, trigger, setTrigger }) => {
  const [id, setId] = useState(null);
  const [open, setOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [updatedData, setUpdatedData] = useState(data);
  const {user}=useSelector((state)=>state.user);
  const [searchTerm,setSearchTerm]=useState('');
  const handleView = (id) => {
    setId(id);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setId(id);
    setIsConfirm(true);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Item Accepted By Courier':
        return 'status status-accepted';
      case 'Collected':
        return 'status status-collected';
      case 'Shipped':
        return 'status status-shipped';
      case 'In-Transit':
        return 'status status-intransit';
      case 'Arrived At Destination':
        return 'status status-arrived';
      case 'Out for Delivery':
        return 'status status-outfordelivery';
      case 'Delivered':
        return 'status status-delivered';
      case 'Picked Up':
        return 'status status-pickedup';
      case 'Unsuccessful Delivery Attempt':
        return 'status status-unsuccessful';
      default:
        return '';
    }
  };

  const getTransportTypeClass = (type) => {
    switch (type) {
      case 'COURIER IMPORT':
        return 'badge transport-courier-import';
      case 'COURIER EXPORT':
        return 'badge transport-courier-export';
      case 'COURIER OUTGOING':
        return 'badge transport-courier-outgoing';
      case 'COURIER INCOMING':
        return 'badge transport-courier-incoming';
      case 'BY HAND INCOMING':
        return 'badge transport-by-hand-incoming';
      case 'BY HAND OUTGOING':
        return 'badge transport-by-hand-outgoing';
      default:
        return 'badge';
    }
  };

  const deleteParcel = async () => {
    try {
      const { data } = await axios.delete(`${host}/shipping/delete-parcel/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (data.success) {
        message.success(data.message);
        setTrigger(!trigger);
      }
    } catch (error) {
      message.error('An error occured');
    }
    setIsConfirm(false);
  };

  const getPartyDetails = async (id) => {
    try {
      const res = await axios.post(`${host}/party/get-all-party`, { id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (res.data.success) {
        const partyList = res.data.party;
        console.log(partyList);
  
        const updatedDataWithNames = data.map((item) => {
          const matchingParty = partyList.find((party) => party?._id === item?.item?.supplierParty);
          return matchingParty
            ? { ...item, item: { ...item.item, partyName: matchingParty.companyName,
              gstNo:matchingParty.gstNo || matchingParty.transGstNo, city:matchingParty.city,state:matchingParty.state,country:matchingParty.country } }
            : item;
        });
        setUpdatedData(updatedDataWithNames);
        console.log(updatedDataWithNames);
      }
    } catch (error) {
      // message.error('Something went wrong', error.message);
    }
  };
  const filteredData = searchTerm
  ? updatedData.filter((item) =>
      item?.item?.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item?.item?.gstNo && item?.item?.gstNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.item?.transGstNo && item?.item?.transGstNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.item?.city && item?.item?.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.item?.state && item?.item?.state.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.item?.country && item?.item?.country.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  : updatedData;

  useEffect(() => {
    if (user?.role === 'User') {
      getPartyDetails(user?._id);
    } else if (user?.role === 'Staff') {
      getPartyDetails(user?.userId);
    }
  
  }, [data,user]); // Run this whenever `data` changes

  return (
    <>
      {updatedData ? (
        <div className="container">
          {isConfirm && <Confirmation isConfirm={isConfirm} setIsConfirm={setIsConfirm} onConfirm={deleteParcel} />}
          {open && <ParcelView id={id} open={open} setOpen={setOpen} />}
          <div className="row">
          <input
          type="text"
          placeholder="🔍 Search by Company Name, GST No, or Trans GST No"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar" // Add custom styling in CSS
        />
            <div className="col-12">
              {filteredData.length === 0 ? (
                <div className="no-items-message">No items to show.</div>
              ) : (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Tracking Number</th>
                      <th scope="col">Party Name</th>
                      <th scope="col">Transport Type</th>
                      <th scope="col">Status</th>
                      <th scope="col">Dispatch Date</th>
                      <th scope="col">Documents</th>
                      <th scope="col">Actions</th>
                      <th scope="col">Print</th>
                    </tr>
                  </thead>
                  <tbody>
                  {filteredData.slice().reverse().map(({ item, pending }) => (
                    <tr key={item?._id}>
                      <td><strong>{item?._id}</strong></td>
                      <td>{item?.partyName}</td>
                      <td>
                        <span className={getTransportTypeClass(item?.transportType)}>
                          {item?.transportType}
                        </span>
                      </td>
                      <td>
                        <span className={getStatusClass(item?.currentStatus)}>
                          {item?.currentStatus || 'N/A'}
                        </span>
                      </td>
                      <td>{FormatDate(item?.dispatchDate)}</td>
                      <td>{pending ? 'Pending' : 'Completed'}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => handleView(item?._id)}
                        >
                          <i className="far fa-eye"></i>
                        </button>
                        <Link to={`/parcel-detail/${item?._id}`} className="btn btn-success">
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleDelete(item?._id)}
                        >
                          <i className="far fa-trash-alt"></i>
                        </button>
                      </td>
                      <td>
                        <Link to={`/print/${item?._id}`}>
                          <i className="fa-solid fa-print"></i>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>

                </table>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="loader-container">
          <PulseLoader color="#36d7b7" />
        </div>
      )}
    </>
  );
};

ParcelTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      item: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        partyName: PropTypes.string,
        courierNo: PropTypes.string.isRequired,
        dispatchDate: PropTypes.string.isRequired,
        currentStatus: PropTypes.string,
      }).isRequired,
      pending: PropTypes.bool.isRequired,
    })
  ).isRequired,
  trigger: PropTypes.bool.isRequired,
  setTrigger: PropTypes.func.isRequired,
};

export default ParcelTable;
