import './App.css';
import ShopComponent from './components/ShopComponent'
import AccountComponent from "./components/AccountComponent";
import HomeComponent from "./components/HomeComponent";
import SignUpComponent from "./components/SignUpComponent";
import LoginComponent from "./components/LoginComponent";
import MyItemsComponent from "./components/MyItemsComponent";
import {BrowserRouter, Route, Link, NavLink, Routes} from "react-router-dom";
import './menu.css';

function App() {
      return (
          <div style={{margin: '10px'}}>
              <h1 style={{textAlign: 'center'}}>
                      Welcome to my shop!
              </h1>
              <BrowserRouter>
                  <div>
                      <div className={"menu"}>
                          <NavLink className={"menu-item"} to="/">Home</NavLink>
                          <NavLink className={"menu-item"} to="/shop">Shop</NavLink>
                          <NavLink className={"menu-item"} to="/signup">Sign Up</NavLink>
                          <NavLink className={"menu-item"} to="/login">Login</NavLink>
                          <NavLink className={"menu-item"} to="/account">Account</NavLink>
                          <NavLink className={"menu-item"} to="/myitems">My items</NavLink>
                      </div>
                  </div>
                  <Routes>
                      <Route path="/" element={<HomeComponent/>}/>
                      <Route path="/shop" element={<ShopComponent/>}/>
                      <Route path="/signup" element={<SignUpComponent/>}/>
                      <Route path="/login" element={<LoginComponent/>}/>
                      <Route path="/account" element={<AccountComponent/>}/>
                      <Route path="/myitems" element={<MyItemsComponent/>}/>
                  </Routes>
              </BrowserRouter>
          </div>
      );
}

export default App;
