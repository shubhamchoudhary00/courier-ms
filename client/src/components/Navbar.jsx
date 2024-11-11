import { useState } from "react";
import { HiArrowSmRight, HiChartPie, HiUser, HiOutlineMail, HiOfficeBuilding, HiUserGroup } from "react-icons/hi";
import { FiChevronDown, FiChevronUp, FiSearch, FiTruck } from "react-icons/fi";
import { FaBoxes, FaBoxOpen, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/features/userSlice";
import '../styles/Navbar.css';

const Sidebar = () => {
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [isStaffOpen, setIsStaffOpen] = useState(false);
  const [isParcelOpen, setIsParcelOpen] = useState(false);
  const [isCourierOpen, setIsCourierOpen] = useState(false);
  const [isPartyOpen, setTsPartyOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleBranchDropdown = () => setIsBranchOpen(!isBranchOpen);
  const toggleStaffDropdown = () => setIsStaffOpen(!isStaffOpen);
  const toggleParcelDropdown = () => setIsParcelOpen(!isParcelOpen);
  const toggleCourierDropdown = () => setIsCourierOpen(!isCourierOpen);
  const togglePartyDropdown = () => setTsPartyOpen(!isPartyOpen);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(setUser(null));
    navigate('/login')
  };

  return (
    <div className="custom-sidebar">
      <div className="sidebar-item" onClick={() => navigate('/')}>
        <img src="/images/logo.png" alt="Logo" />
      </div>
      <div className="sidebar-item" onClick={() => navigate('/')}>
        <HiChartPie className="sidebar-icon" />
        <span>Dashboard</span>
      </div>

      {user?.role === 'User' && (
        <>
          <div className="sidebar-item sidebar-collapse" onClick={toggleBranchDropdown}>
            <HiOfficeBuilding className="sidebar-icon" />
            <span>Branch</span>
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
            {isStaffOpen ? <FiChevronUp className="dropdown-icon" /> : <FiChevronDown className="dropdown-icon" />}
          </div>
          {isStaffOpen && (
            <div className="sidebar-dropdown">
              <div className="dropdown-item" onClick={() => navigate('/new-staff')}>New Staff</div>
              <div className="dropdown-item" onClick={() => navigate('/branch-staff')}>Manage Staff</div>
            </div>
          )}
        </>
      )}

      <div className="sidebar-item" onClick={toggleCourierDropdown}>
        <FiTruck className="sidebar-icon" />
        <span>Courier Master</span>
        {isCourierOpen ? <FiChevronUp className="dropdown-icon" /> : <FiChevronDown className="dropdown-icon" />}

      </div>
       {isCourierOpen && (
        <div className="sidebar-dropdown">
          <div className="dropdown-item" onClick={() => navigate('/courier-master')}>Add Courier Partner</div>
          <div className="dropdown-item" onClick={() => navigate('/manage-courier')}>Manage Courier Partners</div>
          
        </div>
      )}

      <div className="sidebar-item" onClick={togglePartyDropdown}>
        <FaUsers className="sidebar-icon" />
        <span>Party Master</span>
        {isPartyOpen ? <FiChevronUp className="dropdown-icon" /> : <FiChevronDown className="dropdown-icon" />}

      </div>
       {isPartyOpen && (
        <div className="sidebar-dropdown">
          <div className="dropdown-item" onClick={() => navigate('/party-master')}>Add Party</div>
          <div className="dropdown-item" onClick={() => navigate('/manage-party')}>Manage Party</div>
          
        </div>
      )}

      <div className="sidebar-item" onClick={() => navigate('/new-parcel')}>
        <FaBoxOpen className="sidebar-icon" />
        <span>New Parcel</span>
      </div>

      <div className="sidebar-item sidebar-collapse" onClick={toggleParcelDropdown}>
        <FaBoxes className="sidebar-icon" />
        <span>Parcels</span>
        {isParcelOpen ? <FiChevronUp className="dropdown-icon" /> : <FiChevronDown className="dropdown-icon" />}
      </div>
      {isParcelOpen && (
        <div className="sidebar-dropdown">
          <div className="dropdown-item" onClick={() => navigate('/manage-parcels')}>Manage Parcels</div>
          <div className="dropdown-item" onClick={() => navigate('/accepted')}>Item Accepted By Courier</div>
          <div className="dropdown-item" onClick={() => navigate('/arrived')}>Arrived Items</div>
          <div className="dropdown-item" onClick={() => navigate('/collected')}>Collected Items</div>
          <div className="dropdown-item" onClick={() => navigate('/delivered')}>Delivered Items</div>
          <div className="dropdown-item" onClick={() => navigate('/in-transit')}>In Transit Items</div>
          <div className="dropdown-item" onClick={() => navigate('/out-for-delivery')}>Out for Delivery Items</div>
          <div className="dropdown-item" onClick={() => navigate('/pickup')}>Picked Up Items</div>
          <div className="dropdown-item" onClick={() => navigate('/shipped')}>Shipped Items</div>
          <div className="dropdown-item" onClick={() => navigate('/unsuccessful')}>Unsuccessful Items</div>
        </div>
      )}

      <div className="sidebar-item" onClick={() => navigate(`/user-profile/${user?._id}`)}>
        <HiUser className="sidebar-icon" />
        <span>Users</span>
      </div>

      <div className="sidebar-item" onClick={() => navigate(`/track`)}>
        <FiSearch className="sidebar-icon" />
        <span>Track Parcel</span>
      </div>

      <div className="sidebar-item" onClick={() => navigate('/contact-us')}>
        <HiOutlineMail className="sidebar-icon" />
        <span>Contact Us</span>
      </div>

      <div className="sidebar-item" onClick={handleLogout}>
        <HiArrowSmRight className="sidebar-icon" />
        <span>Sign Out</span>
      </div>
    </div>
  );
};

export default Sidebar;
