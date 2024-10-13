import PropTypes from 'prop-types';
import FormatDate from '../helpers/FormatDate';
import ParcelView from './ParcelView';
import { useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { Link } from 'react-router-dom';

const ParcelTable = ({ data }) => {
    const [id, setId] = useState(null); // Default to null
    const [open, setOpen] = useState(false);

    const handleView = (id) => {
        setId(id);
        setOpen(true); // Open the view modal when a parcel is clicked
    };

    const handleEdit = (day) => {
        alert(`Editing article for Day ${day}`);
    };

    const handleDelete = (day) => {
        if (window.confirm(`Are you sure you want to delete the article for Day ${day}?`)) {
            alert(`Article for Day ${day} deleted`);
        }
    };

    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <>
            {data ? (
                <div className="container">
                    {open && <ParcelView id={id} open={open} setOpen={setOpen} />} {/* Only render when open */}
                    <div className="row">
                        <div className="col-12">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">Party Name</th>
                                        <th scope="col">Courier No</th>
                                        <th scope="col">Shipping Bill No</th>
                                        <th scope="col">Dispatch Date</th>
                                        <th scope="col">Documents</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.map((item) => (
                                        <tr key={item?.item?._id}>
                                            <th scope="row">{item?.item?.partyName}</th>
                                            <td>{item?.item?.courierNo}</td>
                                            <td>{item?.item?.shippingBillNo}</td>
                                            <td>{FormatDate(item?.item?.dispatchDate)}</td>
                                            <td>{item?.pending ? 'Pending' : 'Completed'}</td>
                                            <td>
                                                <button type="button" className="btn btn-primary" onClick={() => handleView(item?.item?._id)}>
                                                    <i className="far fa-eye"></i>
                                                </button>
                                                <button type="button" className="btn btn-success" >
                                                   <Link to={`/parcel-detail/${item?.item?._id}`}><i className="fas fa-edit"></i></Link>
                                                </button>
                                                <button type="button" className="btn btn-danger" onClick={() => handleDelete(1)}>
                                                    <i className="far fa-trash-alt"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                shippingBillNo: PropTypes.string.isRequired,
                dispatchDate: PropTypes.string.isRequired,
            }).isRequired,
            pending: PropTypes.bool.isRequired,
        })
    ).isRequired,
};

export default ParcelTable;
