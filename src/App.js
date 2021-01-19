import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import "react-toastify/dist/ReactToastify.css";
import {BrowserRouter as Router,Route} from "react-router-dom"
import Home from "./components/home"
import Login from "./components/login"
import Signup from "./components/signup"
import AddProduct from './components/addproduct';
import Billing from './components/billing';
import ShowBill from './components/showbill';
import EditProduct from './components/editproduct';
import Activate from './components/activation';
import BillHistory from './components/billhistory';
import CollapsibleTable from './components/customerbill';
import ViewBill from "./components/viewBill"

function App() {
  return (
    <Router>
      <Route exact path="/" component={Home}/>
      <Route exact path="/login" component={Login}/>
      <Route exact path="/signup" component={Signup}/>
      <Route exact path="/billing" component={Billing} />
      <Route exact path="/addproduct" component={AddProduct} />
      <Route exact path="/showBill" component={ShowBill} />
      <Route exact path='/editproduct' component={EditProduct} />
      <Route exact path='/activate/:token' component={Activate} />
      <Route exact path="/billhistory" component={BillHistory} />
      <Route exact path="/customerbill" component={CollapsibleTable} />
      <Route exact path="/ViewBill" component={ViewBill} />
    </Router>
  );
}

export default App;
