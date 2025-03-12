import React from "react";
import "./App.css"; // Import the updated CSS file
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// User side
import HomePage from "./screens/Homepage";
import InventoryUser from "./screens/InventoryUser";
import Cart from "./screens/Cart"; // Import the Cart component

// Chathula (Admin side)
import Inventory from "./component/Inventory";
import AddItem from "./component/AddItem";
import NewOrder from "./component/NewOrder";
import ViewOrder from "./component/ViewOrders";
import EditItem from "./component/EditItem";

// podi dilki
import Homescreen from "./screens/Homescreen";
import Bookingscreen from "./screens/Bookingscreen";
import Loginscreen from "./screens/Loginscreen";
import Profilescreen from "./screens/Profilescreen";
import Landingscreen from "./screens/Landingscreen";
import Adminscreen from "./screens/Adminscreen";
import MainPage from "./screens/MainPage";
import ReservationDetails from "./screens/ReservationDetails";
import UpdateBookingScreen from "./screens/UpdateBookingScreen";


//lokudilki
import Navbar from './component/Navbar';
import Logind from "./component/lokudilki/logind";
import SupplierList from './component/lokudilki/SupplierList';
import InsertSupplier from './component/lokudilki/InsertSupplier';
import ShowDetails from './component/lokudilki/ShowDetails';
import UpdateSupplier from './component/lokudilki/UpdateSupplier';
import SupDetails from './component/lokudilki/SupDetails';  
import Dashboardp from './component/lokudilki/Dashboardp';
import Order from './component/lokudilki/order';
import PlaceOrder from './component/lokudilki/PlaceOder';
import OrderForm from './component/lokudilki/OrderForm';
import OrdersTable from './component/lokudilki/OrdersTable';

//praweena
import EmployeeList from './component/praweena/EmployeeList';
import InsertEmployee from './component/praweena/InsertEmployee';
import ShowEmployeeDetails from './component/praweena/ShowEmployeeDetails';
import UpdateEmployee from './component/praweena/UpdateEmployee';
import AssignSalary from './component/praweena/AssignSalary'; // Import the new component
import EmployeeProfile from './component/praweena/EmployeeProfile'; // Import the new component
import LeaveRequest from './component/praweena/LeaveRequest';
import Dashboard from './component/praweena/Dashboard'; // Import the Dashboard component

//imeshi
import { AdminPage } from './screens/imeshi/AdminPage';
import UpdateEvent from './screens/imeshi/UpdateEvent';
import AddEvents from './screens/imeshi/AddEvents';
import EventPage from './screens/imeshi/EventPage';
import AddDetails from './screens/imeshi/AddDetails';
import Details from './screens/imeshi/Details';
import DetailPage from './screens/imeshi/DetailPage'; 
import AddDetailsForm from './screens/imeshi/AddDetails';
import UpdateDetails from './screens/imeshi/UpdateDetails';


//pavi
import Register from './screens/pavithra/Register';
import Login from './screens/pavithra/Login';
import Home from './screens/pavithra/Home';
import ForgotPassword from './screens/pavithra/ForgotPass';
import ResetPassword from './screens/pavithra/PassReset';
import InquiryForm from './screens/pavithra/InquiryForm';
import Profile from './screens/pavithra/Profile';
import Admin from './screens/pavithra/Admin';

//nilu
import Navigation from './component/nilu/Navigation';
import AddPackage from './component/nilu/AddPackage';
import Packages from './component/nilu/Packages';
import EditPackage from './component/nilu/EditPackage';
import PackagesUser from './screens/nilu/PackagesUser';

//rumeth
import Newguide from './component/rumeth/Newguide';
import Guidetable from './component/rumeth/Guidetable';
import GuideUser from './screens/rumeth/GuideUser';


import CampZipDashboard from './screens/CampZipDashboard';





function App() {
  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route path = "/event" element={<div className="user-content-container"><EventPage/></div>}/>
          <Route path = "/inqp" element={<div className="user-content-container"><InquiryForm/></div>}/>
          <Route path="/logout" element={<div className="user-content-container"><Login /></div>} />


          {/* Inventory manager (Chathula - Admin Side) */}
          <Route path="/inventory" element={<div className="content-container"><Inventory /></div>} />
          <Route path="/add-item" element={<div className="content-container"><AddItem /></div>} />
          <Route path="/new-order" element={<div className="content-container"><NewOrder /></div>} />
          <Route path="/" element={<div className="content-container"><Inventory /></div>} />
          <Route path="/view-orders" element={<div className="content-container"><ViewOrder /></div>} />
          <Route path="/inventory/edit/:id" element={<div className="content-container"><EditItem /></div>} />
          
          {/* User Side (Without Sidebar) */}
          <Route path="/homepage" element={<div className="user-content-container"><HomePage /></div>} />
          <Route path="/inventoryuser" element={<div className="user-content-container"><InventoryUser /></div>} />
          <Route path="/cart" element={<div className="user-content-container"><Cart /></div>} />

          {/* podi dilki */}
          <Route path="/home" element={<div className="user-content-container"><Homescreen /></div>} />
          <Route path="/book/:camplocationid/:fromdate/:todate/:bookingid?" element={<div className="user-content-container"><Bookingscreen /></div>} />
          <Route path="/profile" element={<div className="user-content-container"><Profilescreen /></div>} />
          <Route path="/la" element={<div className="user-content-container"><Landingscreen /></div>} />
          <Route path="/mainpage" element={<div className="user-content-container"><MainPage /></div>} />
          <Route path="/update-reservation" element={<div className="user-content-container"><UpdateBookingScreen /></div>} />
          <Route path="/reservation-details" element={<div className="user-content-container"><ReservationDetails /></div>} />
          <Route path="/booking" element={<div className="user-content-container"><Homescreen /></div>} />


          {/* Admin route where only Navigation should be displayed */}
          <Route path="/admin" element={<div className="user-content-container"><Adminscreen /></div>} />

          //lokudilki
          <Route path='/l' element={<div className="content-container"><Logind/></div>} />
          <Route path='/supdetails/:id' element={<div className="content-container"><SupDetails/></div>} />
          <Route path='/supplierlist' element={<div className="content-container"><SupplierList/></div>} />
          <Route path='/insert' element={<div className="content-container"><InsertSupplier/></div>} />
          <Route path='/showdetails/:id' element={<div className="content-container"><ShowDetails/></div>} />
          <Route path='/updatedetails/:id' element={<div className="content-container"><UpdateSupplier/></div>} />
          <Route path="/dashboard" element={<div className="content-container"><Dashboardp/></div>} />
          <Route path="/place-order" element={<div className="content-container"><PlaceOrder/></div>} />
          <Route path="/order" element={<div className="content-container"><Order/></div>} />
          <Route path="/order-form" element={<div className="content-container"><OrderForm/></div>} />
          <Route path="/ordertable" element={<div className="content-container"><OrdersTable/></div>} />

          //praweena
          <Route path="/dashbordp" element={<div className="content-container"><Dashboard/></div>} />
            <Route path="/employeelist" element={<div className="content-container"><EmployeeList /></div>} />
            <Route path="/insertemployee" element={<div className="content-container"><InsertEmployee /></div>} />
            <Route path="/showdetails/:id" element={<div className="content-container"><ShowEmployeeDetails /></div>} />
            <Route path="/updatedetails/:id" element={<div className="content-container"><UpdateEmployee /></div>} />
            <Route path="/assignsalary/:id" element={<div className="content-container"><AssignSalary /></div>} />
            <Route path="/employeeprofile/:id" element={<div className="user-content-container"><EmployeeProfile /></div>} />
            <Route path="/leave-request/:id" element={<div className="user-content-container"><LeaveRequest /></div>} />
          //imeshi
          <Route path = "/admin" element={<div className="content-container"><AdminPage/></div>}/>
          <Route path = "/add" element={<div className="content-container"><AddEvents/></div>}/>
          <Route path="/add-details" element={<div className="content-container"><AddDetails/></div>}/>
          <Route path="/details/:id" element={<div className="content-container"><Details /></div>} />
          <Route path="/update-details/:id" element={<div className="content-container"><UpdateDetails /></div>} />
          <Route path="/detail-page/:id" element={<div className="user-content-container"><DetailPage /></div>} /> 
          <Route path = "/event" element={<div className="user-content-container"><EventPage/></div>}/>

          //pavi
          <Route path='/ho' element={<Home/>} />
          <Route path='/login' element={<div className="user-content-container"><Login/></div>} />
          <Route path='/register' element={<div className="user-content-container"><Register/></div>} />
          <Route path="/forgot-password" element={<div className="user-content-container"><ForgotPassword /></div>} />
          <Route path="/reset-password/:token" element={<div className="user-content-container"><ResetPassword /></div>} />
          <Route path='/inquiry' element={<div className="user-content-container"><InquiryForm/></div>}/>
          <Route path='/proo' element={<div className="user-content-container"><Profile/></div>} />
          <Route path='/admins' element={<div className="user-content-container"><Admin/></div>}/>
          <Route path='/pr' element={<div className="user-content-container"><Profile/></div>}/>
          

          //nilu
            <Route path="/ni" element={<div className="content-container"><Packages /></div>} />
            <Route path="/addni" element={<div className="content-container"><AddPackage /></div>}/>
            <Route path="/edit/:id" element={<div className="content-container"><EditPackage /></div>} />
            <Route path="/Packageni" element={<div className="user-content-container"><PackagesUser /></div>} />


          //rumeth
          <Route path="/guser" element={<div className="user-content-container"><GuideUser /></div>} />
          <Route path="/guids" element={<div className="content-container"><Guidetable /></div>} />
          <Route path="/addru" element={<div className="content-container"><Newguide /></div>} />

          //link 8 funtion in dashboard
          <Route path='/dashadmin' element={<div className="user-content-container"><CampZipDashboard/></div>}/>
          <Route path='/Emplo' element={<div className="content-container"><Dashboard/></div>}/>
          <Route path='/camp-packages' element={<div className="content-container"><AddPackage/></div>}/>
          <Route path='/tour-guides' element={<div className="content-container"><Newguide/></div>}/>
          <Route path='/camp-events' element={<div className="content-container"><CampZipDashboard/></div>}/>
          <Route path='/inv-management' element={<div className="content-container"><Inventory/></div>}/>
          <Route path='/feedback-management' element={<div className="user-content-container"><Admin/></div>}/>
          <Route path='/supman' element={<div className="user-content-container"><Dashboardp/></div>}/>
          <Route path='/addE' element={<div className="content-container"><AddEvents/></div>}/>
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
