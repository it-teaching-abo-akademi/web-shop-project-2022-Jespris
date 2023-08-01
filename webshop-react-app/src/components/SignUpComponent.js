import {useState} from "react";
import {Navigate} from "react-router-dom";
import exitedCat from '../assets/exitedCat.gif';
import keyBoardCat from '../assets/keyboardCat.gif';


function SignUpComponent() {
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [usernameValue, setUsernameValue] = useState("");
    const [signedUp, setSignedUp] = useState(false);

    const signUpContainer = {
        margin: '10px',
        border: '2px solid black',
        display: 'flex'
    }

    const signUpFormStyle = {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '10px',
        marginBottom: '10px',
        border: '1px solid black',
        width: '400px',
        height: '200px',
        position: 'relative'
    }

    const decorationStyle = {
        margin: 'auto',
        width: '30%',
        height: '200px'
    }

    const updateEmailValue = (e) => {
        console.log(e);
        setEmailValue(e.target.value);
    }

    const updatePasswordValue = (e) => {
        console.log(e);
        setPasswordValue(e.target.value);
    }

    const updateUserNameValue = (e) => {
        console.log(e);
        setUsernameValue(e.target.value);
    }

    const signUpFormHandler = (email, password, username) => {
        fetch("http://127.0.0.1:8000/api/v1/auth/register/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: username, email: email, password: password})
        }).then(r => {
            if (!r.ok){
                throw new Error("Error POSTing user to API: " + r.statusCode);
            } else {
                setSignedUp(true);
            return r.json();
            }
        });

    }

    const onFormSubmit = (email, password, username) => {
        signUpFormHandler(email, password, username);
        setPasswordValue("");
        setEmailValue("");
        setUsernameValue("");
    }

    if (signedUp) return <Navigate replace to={"/login"}></Navigate>

    return (
        <div style={signUpContainer}>
            <div style={decorationStyle}>
                <img src={exitedCat} alt="Exited cat" style={{width: '100%', height: '100%'}}/>
            </div>
            <div style={signUpFormStyle}>
                <div style={{margin: '10px'}}>
                   <h2>Sign up:</h2>

                    <InputField label="Username" type="text" value={usernameValue} onChange={updateUserNameValue}></InputField>
                    <InputField label="Email" type="text" value={emailValue} onChange={updateEmailValue}></InputField>
                    <InputField label="Password" type="password" value={passwordValue} onChange={updatePasswordValue}></InputField>

                    <div style={{position: 'absolute', bottom: 0, right: 0, margin: '10px'}}>
                        <button onClick={() => onFormSubmit(emailValue, passwordValue, usernameValue)}>
                            sign me up!
                        </button>
                    </div>
                </div>
            </div>
            <div style={decorationStyle}>
                <img src={keyBoardCat} alt="Cat typing on keyboard" style={{width: '100%', height: '100%'}}/>
            </div>
        </div>

    )
}

function InputField({label, type, value, onChange}){
    return (
        <div style={{display: 'flex'}}>
            {label}
            <div style={{marginRight: '10px', marginLeft: 'auto'}}>
                <input style={{width: '200px'}} type={type} value={value} onChange={onChange}/>
            </div>
        </div>
    )
}

export default SignUpComponent;