import {useState} from "react";
import {Navigate} from "react-router-dom";
import axios from 'axios';

function LoginComponent(props) {

    const [usernameValue, setUsernameValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [logged, setLogged] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const loginContainer = {
        margin: '10px',
        border: '2px solid black',
    }

    const loginFormStyle = {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '10px',
        marginBottom: '10px',
        border: '1px solid black',
        width: '400px',
        height: '150px'
    }

    const updateUsernameValue = (e) => {
        console.log(e);
        setUsernameValue(e.target.value);
    }

    const updatePasswordValue = (e) => {
        console.log(e);
        setPasswordValue(e.target.value);
    }

    const onFormSubmit = (username, password) => {
        loginFormHandler(username, password);
    }

    const loginFormHandler = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8000/api/v1/auth/login/', {
                username,
                password,
            });

            const token = response.data.token;
            props.handleLogin(username, token)
            setLogged(true)

        } catch (error) {
            console.log("error logging in: ", error)
            setPasswordValue("");
            setShowAlert(true);
        }
    }

    if (logged) return <Navigate replace to={"/shop"}></Navigate>

    const handleKeyPress = (event) => {
        console.log(event);
        if (event.key === 'Enter' && usernameValue && passwordValue) {
            loginFormHandler(usernameValue, passwordValue);
        }
    }

    return (
        <div style={loginContainer}>
            <div style={loginFormStyle}>
                <div style={{margin: '10px'}}>
                    <div style={{display: 'flex'}}>
                        <h3>
                            Log in
                        </h3>
                        {showAlert &&
                            <div style={{margin: 'auto', color: 'red'}}>
                                Wrong username or password! Try again.
                            </div>
                        }
                    </div>
                    <div style={{display: 'flex'}}>
                        Username:
                        <div style={{marginRight: '10px', marginLeft: 'auto'}}>
                            <input style={{width: '200px'}} type='text' value={usernameValue} onChange={updateUsernameValue}/>
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        Password:
                        <div style={{marginRight: '10px', marginLeft: 'auto'}}>
                            <input style={{width: '200px'}} type='password' value={passwordValue} onChange={updatePasswordValue} onKeyDown={handleKeyPress}/>
                        </div>
                    </div>
                    <button onClick={() => onFormSubmit(usernameValue, passwordValue)}>
                        log in
                    </button>
                </div>
            </div>
        </div>

    )
}

export default LoginComponent;