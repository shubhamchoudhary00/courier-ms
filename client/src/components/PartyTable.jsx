import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import '../styles/ParcelTable.css';
import { message } from 'antd';
import axios from 'axios';
import Confirmation from './Confirmation';
import host from '../APIRoute/APIRoute';
import PartyView from './PartyView';
import UpdateParty from './UpdateParty';

const PartyTable = ({ data, trigger, setTrigger }) => {
  const [id, setId] = useState(null);
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);

  const handleView = (id) => {
    setId(id);
    setOpen(true);
  };
  const handleEdit = (id) => {
    setId(id);
    setUpdateOpen(true);
  };

  const handleDelete = (id) => {
    setId(id);
    setIsConfirm(true);
  };

  const deleteParcel = async () => {
    setIsConfirm(true)
    try {
      const res = await axios.delete(`${host}/party/delete-party/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        message.success(res.data.message);
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
        { updateOpen && <UpdateParty id={id} open={updateOpen} setOpen={setUpdateOpen}/>  }
          {isConfirm && <Confirmation isConfirm={isConfirm} setIsConfirm={setIsConfirm} onConfirm={deleteParcel} />}
          {open && <PartyView id={id} open={open} setOpen={setOpen} />}
          <div className="row">
            <div className="col-12">
              {data.length === 0 ? (
                <div className="no-items-message">No items to show.</div>
              ) : (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Party Name</th>
                      <th scope="col">Address</th>
                      <th scope="col">City/State/Pincode</th>
                      <th scope="col">Country</th>
                      <th scope="col">GST/Trans GST</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item?._id}>
                        <td>{item?.companyName}</td>
                        <td>{item?.address}</td>
                        <td>{item?.city}/{item?.state}/{item?.pincode}</td>
                        <td>{item?.country}</td>
                        <td>{item?.gstNo || item?.transGstNo}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-primary mx-1"
                            onClick={() => handleView(item?._id)}
                            aria-label="View Party"
                          >
                            <i className="far fa-eye"></i>
                          </button>
                          <Link
                           onClick={() => handleEdit(item?._id)}
                            className="btn btn-success mx-1"
                            aria-label="Edit Party"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button
                            type="button"
                            className="btn btn-danger mx-1"
                            onClick={() => handleDelete(item?._id)}
                            aria-label="Delete Party"
                          >
                            <i className="far fa-trash-alt"></i>
                          </button>
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

PartyTable.propTypes = {
  data: PropTypes.array.isRequired,
  trigger: PropTypes.bool.isRequired,
  setTrigger: PropTypes.func.isRequired,
};

export default PartyTable;
