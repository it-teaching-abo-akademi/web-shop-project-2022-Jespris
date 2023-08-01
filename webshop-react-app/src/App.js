import './App.css';
import ShopComponent from './components/ShopComponent'
import AccountComponent from "./components/AccountComponent";
import HomeComponent from "./components/HomeComponent";
import SignUpComponent from "./components/SignUpComponent";
import LoginComponent from "./components/LoginComponent";
import MyItemsComponent from "./components/MyItemsComponent";
import {BrowserRouter, Route, NavLink, Routes} from "react-router-dom";
import './menu.css';
import axios from "axios";

function App() {

    const handleLogout = () => {
        localStorage.removeItem('csrfToken')
        localStorage.removeItem('authToken')
        localStorage.removeItem('username')
    }

    const fetchCSRFToken = () => {
        return fetch('http://localhost:8000/api/v1/csrfToken/')
            .then(response => response.json())
            .then(data => data.csrfToken);
    }

    const handleLogin = (username, token) => {
        localStorage.setItem('username', username)
        localStorage.setItem('authToken', token)
        fetchCSRFToken().then(csrfToken => {
            console.log("CSRF Token: ", csrfToken);
            localStorage.setItem('csrfToken', csrfToken);
        }).catch(error => {
            console.error("Error fetching CSRF token", error);
        });
    }

    const csrfToken= localStorage.getItem('csrfToken')
    const authToken = localStorage.getItem('authToken')
    const username = localStorage.getItem('username')
    console.log("Username from local storage", username)
    console.log("Token from local storage", authToken)

    if (authToken && csrfToken && username) {
        console.log("Setting tokens for headers!")
        // set tokens to request headers for all API calls
        axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
        axios.defaults.headers.common['Authorization'] = 'Token ' + authToken;
    }



      return (
          <div style={{margin: '10px', fontFamily: "Comic Sans MS"}}>
              <h1 style={{textAlign: 'center', }}>
                      Welcome to my shop!
              </h1>
              <BrowserRouter>
                  <div>
                      <div className={"menu"}>
                          <NavLink className={"menu-item"} to="/">Home</NavLink>
                          <NavLink className={"menu-item"} to="/shop">Shop</NavLink>
                          <NavLink className={"menu-item"} to="/signup">Sign Up</NavLink>
                          <NavLink className={"menu-item"} to="/login">Login</NavLink>
                          {username &&
                              <div style={{display: 'flex'}}>
                                  <NavLink className={"menu-item"} to="/account">Account</NavLink>
                                  <NavLink className={"menu-item"} to="/myitems">My items</NavLink>
                                  <NavLink className={"menu-item"} to="/login" onClick={handleLogout}>Log out</NavLink>
                              </div>
                          }
                      </div>
                  </div>
                  <Routes>
                      <Route path="/" element={<HomeComponent/>}/>
                      <Route path="/shop" element={<ShopComponent/>}/>
                      <Route path="/signup" element={<SignUpComponent/>}/>
                      <Route path="/login" element={<LoginComponent handleLogin={handleLogin}/>}/>
                      <Route path="/account" element={<AccountComponent/>}/>
                      <Route path="/myitems" element={<MyItemsComponent/>}/>
                  </Routes>
              </BrowserRouter>
          </div>
      );
}

export default App;
