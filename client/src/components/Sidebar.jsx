import { Collapse, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="" style={{position:'fixed'}}>
      <div className="row flex-nowrap" style={{width:'100%'}}>
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark" style={{width:'100%'}}>
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
              <span className="fs-5 d-none d-sm-inline">Menu</span>
            </a>
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              <li className="nav-item">
                <a href="#" className="nav-link align-middle px-0">
                  <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Home</span>
                </a>
              </li>
              <li>
                <a href="#submenu1" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
                  <i className="fs-4 bi-speedometer2"></i> <span className="ms-1 d-none d-sm-inline">Branch</span>
                </a>
                <Collapse in={true}>
                  <ul className="collapse show nav flex-column ms-1" id="submenu1" data-bs-parent="#menu">
                    <li className="w-100">
                      <a href="#" className="nav-link px-0"><span className="d-none d-sm-inline"><Link to='/newBranch'>New Branch</Link> </span> </a>
                    </li>
                    <li>
                      <a href="#" className="nav-link px-0"><span className="d-none d-sm-inline"><Link to='/manage-branch'>Manage Branch</Link> </span> </a>
                    </li>
                    <li>
                      <a href="#" className="nav-link px-0"><span className="d-none d-sm-inline"><Link to='/branch-staff'>Branch Staff</Link> </span> </a>
                    </li>
                  </ul>
                </Collapse>
              </li>
              <li>
                <a href="#" className="nav-link px-0 align-middle">
                  <i className="fs-4 bi-table"></i> <span className="ms-1 d-none d-sm-inline">Orders</span>
                </a>
              </li>
              <li>
                <a href="#submenu2" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
                  <i className="fs-4 bi-bootstrap"></i> <span className="ms-1 d-none d-sm-inline">Parcels</span>
                </a>
                <Collapse in={true}>
                  <ul className="collapse nav flex-column ms-1" id="submenu2" data-bs-parent="#menu">
                    <li className="w-100">
                      <a href="#" className="nav-link px-0"><span className="d-none d-sm-inline"><Link to='/manage-parcels'>Manage Parcels</Link> </span> </a>
                    </li>
                    <li>
                      <a href="#" className="nav-link px-0"><span className="d-none d-sm-inline">Item</span> 2</a>
                    </li>
                  </ul>
                </Collapse>
              </li>
              <li>
                <a href="#submenu3" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
                  <i className="fs-4 bi-grid"></i> <span className="ms-1 d-none d-sm-inline">Products</span>
                </a>
                <Collapse in={true}>
                  <ul className="collapse nav flex-column ms-1" id="submenu3" data-bs-parent="#menu">
                    <li className="w-100">
                      <a href="#" className="nav-link px-0"><span className="d-none d-sm-inline">Product</span> 1</a>
                    </li>
                    <li>
                      <a href="#" className="nav-link px-0"><span className="d-none d-sm-inline">Product</span> 2</a>
                    </li>
                    <li>
                      <a href="#" className="nav-link px-0"><span className="d-none d-sm-inline">Product</span> 3</a>
                    </li>
                    <li>
                      <a href="#" className="nav-link px-0"><span className="d-none d-sm-inline">Product</span> 4</a>
                    </li>
                  </ul>
                </Collapse>
              </li>
              <li>
                <a href="#" className="nav-link px-0 align-middle">
                  <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Customers</span>
                </a>
              </li>
            </ul>
            <hr />
            <Dropdown className="pb-4">
              <Dropdown.Toggle id="dropdownUser1" className="d-flex align-items-center text-white text-decoration-none">
                <img src="https://github.com/mdo.png" alt="User" width="30" height="30" className="rounded-circle" />
                <span className="d-none d-sm-inline mx-1">loser</span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-dark text-small shadow">
                <Dropdown.Item href="#">New project...</Dropdown.Item>
                <Dropdown.Item href="#">Settings</Dropdown.Item>
                <Dropdown.Item href="#">Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="#">Sign out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
  
      </div>
    </div>
  );
}

export default Sidebar;
