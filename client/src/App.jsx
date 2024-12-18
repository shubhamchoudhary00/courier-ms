import { lazy, Suspense } from 'react';
import './App.css';
import { BeatLoader } from 'react-spinners';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'flowbite/dist/flowbite.css';

import ProtectedRoutes from './Auth/ProtectedRoutes';
import PublicRoute from './Auth/PublicRoute';
import Home from './pages/Home'
// import PublicRoute from './helpers/PublicRoute';


const NewBranch = lazy(() => import('./pages/NewBranch'));
const ShippingLabelForm = lazy(() => import('./pages/ShippingLabelForm'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const ManageBranch = lazy(() => import('./pages/ManageBranch'));
const BranchStaff = lazy(() => import('./pages/BranchStaff'));
const ManageParcels = lazy(() => import('./pages/ManageParcels'));
const ParcelDetails = lazy(() => import('./pages/ParcelDetails'));
const AWBBarcodePrint=lazy(()=>import('./pages/AWBBarcodePrint'))
const Tracking=lazy(()=>import('./pages/Tracking'))
const UnsuccessfulItem=lazy(()=>import('./pages/UnsuccessfulItem'))
const PickedUpItem=lazy(()=>import('./pages/PickedUpItem'))
const ShippedItem=lazy(()=>import('./pages/ShippedItem'))
const OutforDeliveryItem=lazy(()=>import('./pages/OutforDeliveryItem'))
const InTransitItem=lazy(()=>import('./pages/InTransitItem'))
const DeliveredItem=lazy(()=>import('./pages/DeliveredItem'))
const CollectedItem=lazy(()=>import('./pages/CollectedItem'))
const ArrivedItem=lazy(()=>import('./pages/ArrivedItem'))
const AcceptedItem=lazy(()=>import('./pages/AcceptedItem'))
const NewStaff=lazy(()=>import('./pages/NewStaff'))
const UserProfile=lazy(()=>import('./pages/UserProfile'));
const ForgotPassword=lazy(()=>import('./pages/ForgotPassword'));
const ResetPassword=lazy(()=>import('./pages/ResetPassword'));
const ContactUs=lazy(()=>import('./pages/ContactUs'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const PartyMaster = lazy(() => import('./pages/PartyMaster'));
const CourierMaster = lazy(() => import('./pages/CourierMaster'));
const ManageParty = lazy(() => import('./pages/ManageParty'));
const ManageCourierPartner = lazy(() => import('./pages/ManageCourierPartner'));

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
              <Route path="/home" element={<ProtectedRoutes><Home /></ProtectedRoutes>} />
              {/* Branch Routes */}

              <Route path="/new-branch" element={<ProtectedRoutes><NewBranch /></ProtectedRoutes>} />
              <Route path="/manage-branch" element={<ProtectedRoutes><ManageBranch /></ProtectedRoutes>} />
              <Route path="/branch-staff" element={<ProtectedRoutes><BranchStaff /></ProtectedRoutes>} />
              {/*  End */}

              {/* Basic Routes */}
              <Route path="/" element={<PublicRoute><Login /></PublicRoute> } />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute> } />
              <Route path="/print/:id" element={<ProtectedRoutes><AWBBarcodePrint /></ProtectedRoutes> } />
              <Route path="/user-profile/:id" element={<ProtectedRoutes><UserProfile /></ProtectedRoutes> } />
              <Route path="/forgot-password" element={<ForgotPassword /> } />
              <Route path="/reset-password/:id" element={<ResetPassword /> } />
              <Route path="/contact-us" element={<ContactUs /> } />
              {/* End */}

              <Route path="/new-parcel" element={<ProtectedRoutes> <ShippingLabelForm /></ProtectedRoutes>} />
              
              <Route path="/track" element={<ProtectedRoutes><Tracking /></ProtectedRoutes> } />

              {/* Shipment Details */}
              <Route path="/manage-parcels" element={<ProtectedRoutes> <ManageParcels /></ProtectedRoutes>} />
              <Route path="/parcel-detail/:id" element={<ProtectedRoutes> <ParcelDetails /></ProtectedRoutes>} />
              {/* End */}

              {/* Shipment Routes */}
              <Route path="/unsuccessful" element={<ProtectedRoutes><UnsuccessfulItem /></ProtectedRoutes> } />
              <Route path="/shipped" element={<ProtectedRoutes><ShippedItem /></ProtectedRoutes> } />
              <Route path="/pickup" element={<ProtectedRoutes><PickedUpItem /></ProtectedRoutes> } />
              <Route path="/out-for-delivery" element={<ProtectedRoutes><OutforDeliveryItem /></ProtectedRoutes> } />
              <Route path="/in-transit" element={<ProtectedRoutes><InTransitItem /></ProtectedRoutes> } />
              <Route path="/delivered" element={<ProtectedRoutes><DeliveredItem /></ProtectedRoutes> } />
              <Route path="/collected" element={<ProtectedRoutes><CollectedItem /></ProtectedRoutes> } />
              <Route path="/arrived" element={<ProtectedRoutes><ArrivedItem /></ProtectedRoutes> } />
              <Route path="/accepted" element={<ProtectedRoutes><AcceptedItem /></ProtectedRoutes> } />
              {/*  End */}

              {/*  Masters */}
              <Route path="/party-master" element={<ProtectedRoutes><PartyMaster /></ProtectedRoutes> } />
              <Route path="/courier-master" element={<ProtectedRoutes><CourierMaster /></ProtectedRoutes> } />
              {/*  End */}

              <Route path="/manage-party" element={<ProtectedRoutes><ManageParty /></ProtectedRoutes> } />
              <Route path="/manage-courier" element={<ProtectedRoutes><ManageCourierPartner /></ProtectedRoutes> } />


              <Route path="/new-staff" element={<ProtectedRoutes><NewStaff /></ProtectedRoutes> } />
              <Route path="/port" element={<Portfolio />} />  
              <Route path="*" element={<NotFound />} />  
            
              
            </Routes>
          </Suspense>
        </BrowserRouter>
      </div>
  );
};

export default App;
