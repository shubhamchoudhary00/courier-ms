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

const ParcelTable = ({ data, trigger, setTrigger }) => {
  const [id, setId] = useState(null);
  const [open, setOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);

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

  const deleteParcel = async () => {
    try {
      const { data } = await axios.delete(`${host}/shipping/delete-parcel/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (data.success) {
        message.success(data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
    setIsConfirm(false);
    setTrigger(!trigger);
  };

  return (
    <>
      {data ? (
        <div className="container">
          {isConfirm && <Confirmation isConfirm={isConfirm} setIsConfirm={setIsConfirm} onConfirm={deleteParcel} />}
          {open && <ParcelView id={id} open={open} setOpen={setOpen} />}
          <div className="row">
            <div className="col-12">
              {data.length === 0 ? (
                <div className="no-items-message">No items to show.</div> // Message when no items
              ) : (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Tracking Number</th>
                      <th scope="col">Party Name</th>
                      <th scope="col">Courier No</th>
                      <th scope="col">Status</th>
                      <th scope="col">Dispatch Date</th>
                      <th scope="col">Documents</th>
                      <th scope="col">Actions</th>
                      <th scope="col">Print</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(({ item, pending }) => (
                      <tr key={item?._id}>
                        <td><strong>{item?._id}</strong></td>
                        <td>{item?.partyName}</td>
                        <td>{item?.courierNo}</td>
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
        partyName: PropTypes.string.isRequired,
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
