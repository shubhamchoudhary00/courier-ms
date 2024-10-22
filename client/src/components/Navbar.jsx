import  { useState } from "react";
import { HiArrowSmRight, HiChartPie,  HiUser } from "react-icons/hi";
import { FiChevronDown, FiChevronUp,FiTruck } from "react-icons/fi"; // Add dropdown icons
import '../styles/Navbar.css';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HiOfficeBuilding, HiUserGroup } from 'react-icons/hi';
import { FaBoxes } from 'react-icons/fa'; // Add this import for the parcels icon
import { setUser } from "../redux/features/userSlice";


const Sidebar = () => {
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [isStaffOpen, setIsStaffOpen] = useState(false);
  const [isParcelOpen, setIsParcelOpen] = useState(false);
  const {user}=useSelector((state)=>state.user);
  const dispatch=useDispatch()
  const navigate=useNavigate();
  const toggleBranchDropdown = () => {
    setIsBranchOpen(!isBranchOpen);
  };
  const toggleStaffDropdown = () => {
    setIsStaffOpen(!isStaffOpen);
  };
  const toggleParcelDropdown = () => {
    setIsParcelOpen(!isParcelOpen);
  };

  const handleLogout=()=>{
    localStorage.clear()
    dispatch(setUser(null))
  }
  return (
    <div className="custom-sidebar">
      <div className="sidebar-item" onClick={()=>navigate('/')}>
       <img src="/images/logo.png" />
      </div>
      <div className="sidebar-item" onClick={()=>navigate('/')}>
        <HiChartPie className="sidebar-icon" />
        <span>Dashboard</span>
      </div>

     {/* E-commerce section with a toggle for dropdown */}
      <div className="sidebar-item sidebar-collapse" onClick={toggleBranchDropdown}>
      <HiOfficeBuilding className="sidebar-icon" />
      <span>Branch</span>
      {/* Dropdown icon to indicate collapse/expand */}
      {isBranchOpen ? <FiChevronUp className="dropdown-icon" /> : <FiChevronDown className="dropdown-icon" />}
      </div>

      {isBranchOpen && (
      <div className="sidebar-dropdown">
        <div className="dropdown-item" onClick={() => navigate('/new-branch')}>New Branch</div>
        <div className="dropdown-item" onClick={() => navigate('/manage-branch')}>Manage Branch</div>
      </div>
      )}

      <div className="sidebar-item sidebar-collapse" onClick={toggleStaffDropdown}>
      <HiUserGroup className="sidebar-icon" />
      <span>Staff</span>
      {/* Dropdown icon to indicate collapse/expand */}
      {isStaffOpen ? <FiChevronUp className="dropdown-icon" /> : <FiChevronDown className="dropdown-icon" />}
      </div>

      {isStaffOpen && (
      <div className="sidebar-dropdown">
        <div className="dropdown-item" onClick={() => navigate('/new-staff')}>New Staff</div>
        <div className="dropdown-item" onClick={() => navigate('/branch-staff')}>Manage Staff</div>
      </div>
      )}
      <div className="sidebar-item" onClick={()=>navigate('/shippingLabel')}>
      <FaBoxes className="sidebar-icon" />
      <span>New Parcel</span>
    </div>

      <div className="sidebar-item sidebar-collapse" onClick={toggleParcelDropdown}>
      <FaBoxes className="sidebar-icon" />
      <span>Parcels</span>
      {/* Dropdown icon to indicate collapse/expand */}
      {isParcelOpen ? <FiChevronUp className="dropdown-icon" /> : <FiChevronDown className="dropdown-icon" />}
      </div>


    {isParcelOpen && (
      <div className="sidebar-dropdown">
        <div className="dropdown-item" onClick={()=>navigate('/manage-parcels')}>Manage Parcels</div>
        <div className="dropdown-item" onClick={()=>navigate('/shippingLabel')}>New Parcel</div>
        <div className="dropdown-item" onClick={()=>navigate('/accepted')}>Item Accepted By Courier</div>
        <div className="dropdown-item" onClick={()=>navigate('/arrived')}>Arrived Items</div>
        <div className="dropdown-item" onClick={()=>navigate('/collected')}>Collected Items</div>
        <div className="dropdown-item" onClick={()=>navigate('/delivered')}>Delivered Items</div>
        <div className="dropdown-item" onClick={()=>navigate('/in-transit')}>In Transit Items</div>
        <div className="dropdown-item" onClick={()=>navigate('/out-for-delivery')}>Out for Delivery Items</div>
        <div className="dropdown-item" onClick={()=>navigate('/pickup')}>Picked Up Items</div>
        <div className="dropdown-item" onClick={()=>navigate('/shipped')}>Shipped Items</div>
        <div className="dropdown-item" onClick={()=>navigate('/unsuccessful')}>Unsuccessful Items</div>
   
      </div>
    )}

    <div className="sidebar-item" onClick={()=>navigate(`/user-profile/${user?._id}`)}>
        <HiUser className="sidebar-icon" />
        <span>Users</span>
      </div>

   <div className="sidebar-item" onClick={()=>navigate(`/track`)}>
    <FiTruck className="sidebar-icon" /> {/* Updated icon */}
    <span>Track Parcel</span>
  </div>

      

      {/* 
      <div className="sidebar-item">
        <HiShoppingBag className="sidebar-icon" />
        <span>Products</span>
      </div> */}

      <div className="sidebar-item" onClick={handleLogout}>
        <HiArrowSmRight className="sidebar-icon" />
        <span>Sign Out</span>
      </div>

    
    </div>
  );
};

export default Sidebar;
