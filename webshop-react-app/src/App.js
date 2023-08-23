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
import {useEffect, useState} from "react";

export const SERVER_URL = 'http://localhost:8011'  // Edit this depending on which port the server runs on

function App() {

    const handleLogout = () => {
        localStorage.removeItem('csrfToken')
        localStorage.removeItem('authToken')
        localStorage.removeItem('username')

        setUsername(null)
        setCSRFToken(null)
        setAuthToken(null)
    }

    const fetchCSRFToken = () => {
        return fetch(SERVER_URL + '/api/v1/csrfToken/')
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

        setUsername(localStorage.getItem('username'))
        setAuthToken(localStorage.getItem('authToken'))
        setCSRFToken(localStorage.getItem('csrfToken'))
    }

    const [csrfToken, setCSRFToken] = useState(null);
    const [username, setUsername] = useState(null);
    const [authToken, setAuthToken] = useState(null)


    useEffect(() => {
        console.log("App state update")
        setUsername(localStorage.getItem('username'))
        setAuthToken(localStorage.getItem('authToken'))
        setCSRFToken(localStorage.getItem('csrfToken'))
        // TODO: validate login token
        if (username && authToken) {
            console.log("Validating user token from local storage...")
            fetch(SERVER_URL + '/api/v1/auth/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  // Auth token hopefully set in App.js
                },
                body: JSON.stringify({token: authToken})
            }).then(
                response => {
                    if (!response.ok) {
                        throw new Error("API posting error: " + response.statusCode);
                    }
                    return response.json();
                }
            ).then(data => {
                console.log("DATA: ", data)
                if (data.username === username) {
                    console.log("User found!")
                } else {
                    console.log("User not found, logging out...")
                    localStorage.removeItem('csrfToken')
                    localStorage.removeItem('authToken')
                    localStorage.removeItem('username')
                }
            })
        }

        console.log("Username from storage: ", username)
        console.log("CSRF from storage: ", csrfToken)
        console.log("AUTH from storage: ", authToken)

        if (authToken && csrfToken && username) {
            console.log("Setting tokens for headers!")
            // set tokens to request headers for all API calls
            axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
            axios.defaults.headers.common['Authorization'] = 'Token ' + authToken;
        }
    }, [authToken, csrfToken, username])

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
                          {!username &&
                              <NavLink className={"menu-item"} to="/signup">Sign Up</NavLink>

                          }
                          {!username &&
                                <NavLink className={"menu-item"} to="/login">Login</NavLink>
                          }
                          {username &&
                              <div style={{display: 'flex'}}>
                                  <h4 className={"menu-item"}>
                                      {username}
                                  </h4>

                                  <NavLink className={"menu-item"} to="/account">Account</NavLink>
                                  <NavLink className={"menu-item"} to="/myitems">My items</NavLink>
                                  <NavLink className={"menu-item"} to="/login" onClick={handleLogout}>Log out</NavLink>
                              </div>
                          }
                      </div>
                  </div>
                  <Routes>
                      <Route path="/" element={<HomeComponent handleLogout={handleLogout}/>}/>
                      <Route path="/shop" element={<ShopComponent username={username} authToken={authToken}/>}/>
                      <Route path="/signup" element={<SignUpComponent/>}/>
                      <Route path="/login" element={<LoginComponent handleLogin={handleLogin}/>}/>
                      <Route path="/account" element={<AccountComponent/>}/>
                      <Route path="/myitems" element={<MyItemsComponent username={username} authToken={authToken}/>}/>
                  </Routes>
              </BrowserRouter>
          </div>
      );
}

export default App;
