import { useState,useEffect } from "react";
import ManageStaff from "./ManageStaff";
import UpdateBranch from "./UpdateBranch";
const TableGrid = ({data,editable,onClose}) => {
    const [id,setId]=useState();
    const [open,setOpen]=useState(false);
    const [branchId,setBranchId]=useState();
    const [branchOpen,setBranchOpen]=useState(false);
    // Handler for viewing an article
    const handleView = (id) => {
        setId(id);
        setOpen(!open);
    };

    // Handler for editing an article
    const handleEdit = (id) => {
        setBranchId(id);
        setBranchOpen(!branchOpen)
        alert(`Editing article for Day ${day}`);
    };

    // Handler for deleting an article
    const handleDelete = (day) => {
        if (window.confirm(`Are you sure you want to delete the article for Day ${day}?`)) {
            alert(`Article for Day ${day} deleted`);
        }
    };

 

    return (
        <div className="container">
        {!editable && open && <ManageStaff id={id} open={open} setOpen={setOpen}/>  }
        {editable && branchOpen && <UpdateBranch id={branchId} open={branchOpen} setOpen={setBranchOpen} onClose={onClose} />}
      
            <div className="row">
                <div className="col-12">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Branch Name</th>
                                <th scope="col">City/State/Pincode</th>
                                <th scope="col">Country</th>
                                <th scope="col">Contact Person</th>
                                <th scope="col">Contact Number</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {data?.map((item) => (
                            <tr key={item?._id}>
                                <th scope="row">{item?.branchName}</th>
                                <td>{item?.city}/{item?.state}/{item?.pincode}</td>
                                <td>{item?.country}</td>
                                <td>{item?.contactPersonName}</td>
                                <td>{item?.contactPersonNumber}</td>
                                <td>
                                    <button type="button" className="btn btn-primary" onClick={() => handleView(item?._id)}>
                                        <i className="far fa-eye"></i>
                                    </button>
                                    {editable && <>
                                    <button type="button" className="btn btn-success" onClick={() => handleEdit(item?._id)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={() => handleDelete(item?._id)}>
                                        <i className="far fa-trash-alt"></i>
                                    </button> </>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TableGrid;
