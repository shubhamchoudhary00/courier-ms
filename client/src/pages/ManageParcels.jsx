import Layout from "../components/Layout";
import host from '../APIRoute/APIRoute';
import axios from 'axios';
import { message } from 'antd';
import { useEffect, useState } from "react";
import ParcelTable from "../components/ParcelTable";
import { useSelector } from "react-redux";
import { Select } from 'antd'; // Import Select component
import '../styles/Home.css';

const { Option } = Select; // Destructure Option from Select

const ManageParcels = () => {
  const [parcels, setParcels] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [addedByFilter, setAddedByFilter] = useState(null);
  const [modifiedByFilter, setModifiedByFilter] = useState(null);
  const [branchFilter, setBranchFilter] = useState(null);
  const { user } = useSelector((state) => state.user);
  const [addedByUsers, setAddedByUsers] = useState([]);
  const [modifiedByUsers, setModifiedByUsers] = useState([]);
  const [branches, setBranches] = useState([]);

  const getAllParcels = async (id) => {
    try {
      const res = await axios.post(`${host}/shipping/get-all-shipment`, { id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        console.log(res.data);
        setParcels(res.data.shippings);
        const shippings = res.data.shippings;
  
        // Get unique addedBy and modifiedBy IDs
        const addedByIds = [...new Set(shippings.map(item => item?.item?.addedBy))].filter(id => id);
        const modifiedByIds = [...new Set(shippings.map(item => item?.item?.modifiedBy))].filter(id => id);
        const branchNames = [...new Set(shippings.map(item => item?.item?.branch))].filter(name => name);
  
        // Fetch user details for addedBy and modifiedBy if IDs exist
        if (addedByIds.length) {
          await fetchAddedByUsers(addedByIds);
        }
        if (modifiedByIds.length) {
          await fetchModifiedByUsers(modifiedByIds);
        }
        if (branchNames.length) {
          await fetchBranches(branchNames);
        }
        console.log(branchNames)
      }
    } catch (error) {
      console.log(error.message);
      message.error('Something went wrong');
    }
  };
  
  const fetchAddedByUsers = async (ids) => {
    const uniqueIds = [...new Set(ids)];
    const userPromises = uniqueIds.map(id => getUsers(id));
    const users = await Promise.all(userPromises);
    setAddedByUsers(users.filter(user => user)); // Filter out any undefined responses
  };

  const fetchModifiedByUsers = async (ids) => {
    const uniqueIds = [...new Set(ids)];
    const userPromises = uniqueIds.map(id => getUsers(id));
    const users = await Promise.all(userPromises);
    setModifiedByUsers(users.filter(user => user)); // Filter out any undefined responses
  };

  const fetchBranches = async (names) => {
    const uniqueBranches = [...new Set(names)];
    const branchPromises = uniqueBranches.map(name => getBranch(name));
    const fetchedBranches = await Promise.all(branchPromises);
    setBranches(fetchedBranches.filter(branch => branch)); // Filter out any undefined responses
    console.log(branches)
  };

  const getUsers = async (id) => {
    try {
      const { data } = await axios.get(`${host}/user/get-user-details/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (data.success) {
        return data.user; // Return user data to be processed in fetch functions
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const getBranch = async (id) => {
    try {
      const { data } = await axios.post(`${host}/branch/get-branch`, { id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (data.success) {
        return data.branch; // Return branch data to be processed
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (user?.role === 'User') {
      getAllParcels(user?._id);
    } else if (user?.role === 'Staff') {
      getAllParcels(user?.userId);
    }
  }, [trigger, user]);

  // Filter parcels based on selected filters
  const filteredParcels = parcels.filter(parcel => {
    const item = parcel.item;
    const addedByMatch = addedByFilter ? item.addedBy === addedByFilter : true;
    const modifiedByMatch = modifiedByFilter ? item.modifiedBy === modifiedByFilter : true;
    const branchMatch = branchFilter ? item.branch === branchFilter : true;

    return addedByMatch && modifiedByMatch && branchMatch;
  });

  return (
    <Layout>
      <div className="main">
        <h2>Manage Parcels</h2>
        
        {/* Filter Options */}
        <div className="filters">
          <Select
            placeholder="Added By"
            style={{ width: 150, marginRight: 10 }}
            onChange={(value) => {
              setAddedByFilter(value === 'none' ? null : value);
            }}
          >
            <Option value="none">None</Option>
            {addedByUsers.map(user => (
              <Option key={user._id} value={user._id}>{user.name}</Option>
            ))}
          </Select>

          <Select
            placeholder="Modified By"
            style={{ width: 150, marginRight: 10 }}
            onChange={(value) => {
              setModifiedByFilter(value === 'none' ? null : value);
            }}
          >
            <Option value="none">None</Option>
            {modifiedByUsers.map(user => (
              <Option key={user._id} value={user._id}>{user.name}</Option>
            ))}
          </Select>

          <Select
            placeholder="Branch"
            style={{ width: 150, marginRight: 10 }}
            onChange={(value) => {
              setBranchFilter(value === 'none' ? null : value);
            }}
          >
            <Option value="none">None</Option>
            {branches.map(branch => (
              <Option key={branch._id} value={branch._id}>{branch.branchName},{branch?.city}</Option>
            ))}
          </Select>
        </div>

        <ParcelTable data={filteredParcels} trigger={trigger} setTrigger={setTrigger} />
      </div>
    </Layout>
  );
}

export default ManageParcels;
