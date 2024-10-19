import { lazy, Suspense } from 'react';
import './App.css';
import { BeatLoader } from 'react-spinners';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectedRoutes from './Auth/ProtectedRoutes';
import AWBBarcodePrint from './components/AWBBarcodePrint';
import Tracking from './pages/Tracking';
import UnsuccessfulItem from './pages/UnsuccessfulItem';
import ShippedItem from './pages/ShippedItem';
import PickedUpItem from './pages/PickedUpItem';
import OutforDeliveryItem from './pages/OutforDeliveryItem';
import InTransitItem from './pages/InTransitItem';
import DeliveredItem from './pages/DeliveredItem';
import CollectedItem from './pages/CollectedItem';
import ArrivedItem from './pages/ArrivedItem';
import AcceptedItem from './pages/AcceptedItem';
// import PublicRoute from './helpers/PublicRoute';

const Home = lazy(() => import('./pages/Home'));
const NewBranch = lazy(() => import('./pages/NewBranch'));
const ShippingLabelForm = lazy(() => import('./pages/ShippingLabelForm'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const ManageBranch = lazy(() => import('./pages/ManageBranch'));
const BranchStaff = lazy(() => import('./pages/BranchStaff'));
const ManageParcels = lazy(() => import('./pages/ManageParcels'));
const ParcelDetails = lazy(() => import('./pages/ParcelDetails'));

const App = () => {
  return (
      <div className="App">
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="loader-container">
                <BeatLoader color="#36d7b7" />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/newBranch" element={<ProtectedRoutes><NewBranch /></ProtectedRoutes>} />
              <Route path="/manage-branch" element={<ProtectedRoutes><ManageBranch /></ProtectedRoutes>} />
              <Route path="/branch-staff" element={<ProtectedRoutes><BranchStaff /></ProtectedRoutes>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shippingLabel" element={<ProtectedRoutes> <ShippingLabelForm /></ProtectedRoutes>} />
              <Route path="/manage-parcels" element={<ProtectedRoutes> <ManageParcels /></ProtectedRoutes>} />
              <Route path="/parcel-detail/:id" element={<ProtectedRoutes> <ParcelDetails /></ProtectedRoutes>} />
              <Route path="/print/:id" element={ <AWBBarcodePrint />} />
              <Route path="/track" element={<ProtectedRoutes><Tracking /></ProtectedRoutes> } />
              <Route path="/unsuccessful" element={<ProtectedRoutes><UnsuccessfulItem /></ProtectedRoutes> } />
              <Route path="/shipped" element={<ProtectedRoutes><ShippedItem /></ProtectedRoutes> } />
              <Route path="/pickup" element={<ProtectedRoutes><PickedUpItem /></ProtectedRoutes> } />
              <Route path="/out-for-delivery" element={<ProtectedRoutes><OutforDeliveryItem /></ProtectedRoutes> } />
              <Route path="/in-transit" element={<ProtectedRoutes><InTransitItem /></ProtectedRoutes> } />
              <Route path="/delivered" element={<ProtectedRoutes><DeliveredItem /></ProtectedRoutes> } />
              <Route path="/collected" element={<ProtectedRoutes><CollectedItem /></ProtectedRoutes> } />
              <Route path="/arrived" element={<ProtectedRoutes><ArrivedItem /></ProtectedRoutes> } />
              <Route path="/accepted" element={<ProtectedRoutes><AcceptedItem /></ProtectedRoutes> } />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </div>
  );
};

export default App;
