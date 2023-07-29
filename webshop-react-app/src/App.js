import './App.css';
import ShopComponent from './components/ShopComponent'
import AccountComponent from "./components/AccountComponent";
import HomeComponent from "./components/HomeComponent";
import SignUpComponent from "./components/SignUpComponent";
import LoginComponent from "./components/LoginComponent";
import MyItemsComponent from "./components/MyItemsComponent";
import {BrowserRouter, Route, Link, NavLink, Routes} from "react-router-dom";
import './menu.css';
import {useState} from "react";
import axios from "axios";

function App() {

    const [loginToken, setLoginToken] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")

    const updateUsername = (name) => {
        setUsername(name);
    }

    const updateEmail = (email) => {
        setEmail(email);
    }

    const handleLogin = async (token) => {
        setLoginToken(token);
        // update username and email by getting the user by token from API
        try {
            const response = await axios.post('http://localhost:8000/api/v1/auth/users/', {
                token
            });

            setUsername(response.data.username);
            setEmail(response.data.username);

        } catch (error) {
            console.log("error logging in (APP): ", error)
        }
    }

    const handleLogout = () => {
        setLoginToken(null);
        setUsername(null)
        setEmail(null)
    }

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
                      <Route path="/" element={<HomeComponent token={loginToken}/>}/>
                      <Route path="/shop" element={<ShopComponent username={username}/>}/>
                      <Route path="/signup" element={<SignUpComponent/>}/>
                      <Route path="/login" element={<LoginComponent handleLogin={handleLogin} />}/>
                      <Route path="/account" element={<AccountComponent token={loginToken}/>}/>
                      <Route path="/myitems" element={<MyItemsComponent token={loginToken}/>}/>
                  </Routes>
              </BrowserRouter>
          </div>
      );
}

export default App;
