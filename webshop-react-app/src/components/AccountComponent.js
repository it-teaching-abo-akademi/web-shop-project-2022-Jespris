import {useEffect, useState} from "react";

function AccountComponent({token, password}) {

    const [oldPasswordValue, setOldPassword] = useState("");
    const [newPasswordValue, setNewPassword] = useState("");
    const [repeatedPasswordValue, setRepeatedPassword] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [success, setSuccess] = useState(false);

    const updateOldPassword = (e) => {
        console.log(e);
        setOldPassword(e.target.value)
    }

    const updateNewPassword = (e) => {
        console.log(e);
        setNewPassword(e.target.value)
    }

    const updateRepeatedPassword = (e) => {
        console.log(e);
        setRepeatedPassword(e.target.value)
    }

    const accountContainer = {
        margin: '10px',
        border: '2px solid black'
    }

    const changePasswordStyle = {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '10px',
        marginBottom: '10px',
        border: '1px solid black',
        width: '450px',
        height: '200px',
        display: 'flex',
        position: 'relative'
    }

    const onSavePassword = (oldP, newP, repP) => {
        // TODO ensure old password is correct
        if (oldP !== password){
            setShowAlert(true);
            setAlertText("Old password was incorrect!")
            return;
        }
        if ((newP !== repP) || (oldP === newP)){
            // new password isn't repeated correctly or new password is same as old password
            return;
        }
        // TODO fetch API update user password

        setRepeatedPassword("")
        setOldPassword("")
        setNewPassword("")
        setSuccess(true)
    }

    useEffect(() => {
        if (oldPasswordValue === newPasswordValue){
            setShowAlert(true);
            setAlertText("New password cannot be the same as old password")
        } else if (newPasswordValue !== repeatedPasswordValue && repeatedPasswordValue !== ""){
            setShowAlert(true);
            setAlertText("New password is not repeated correctly!")
        } else {
            setShowAlert(false);
        }
        if (oldPasswordValue === "" && newPasswordValue === "" && repeatedPasswordValue === ""){
            setShowAlert(false);
        }
    }, [oldPasswordValue, newPasswordValue, repeatedPasswordValue])

    return (
        <div style={accountContainer}>
            <div style={changePasswordStyle}>
                <div style={{margin: '10px', width: '400px'}}>
                    <h2>
                        Change password:
                    </h2>
                    <div style={{display: 'flex'}}>
                        Old password
                        <div style={{marginRight: '10px', marginLeft: 'auto'}}>
                            <input style={{width: '200px'}} type='password' value={oldPasswordValue} onChange={updateOldPassword}/>
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        New password
                        <div style={{marginRight: '10px', marginLeft: 'auto'}}>
                            <input style={{width: '200px'}} type='password' value={newPasswordValue} onChange={updateNewPassword}/>
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        New password again
                        <div style={{marginRight: '10px', marginLeft: 'auto'}}>
                            <input style={{width: '200px'}} type='password' value={repeatedPasswordValue} onChange={updateRepeatedPassword}/>
                        </div>
                    </div>
                    {showAlert &&
                        <div style={{marginRight: '10px', marginLeft: 'auto', color: 'red'}}>
                            {alertText}
                        </div>
                    }
                    {success &&
                        <div style={{marginRight: '10px', marginLeft: 'auto', color: 'green'}}>
                            Password updated successfully!
                        </div>
                    }
                </div>
                <div style={{height: '20px', position: 'absolute', bottom: '0', right: '0', margin: '10px'}}>
                    <button onClick={() => onSavePassword(oldPasswordValue, newPasswordValue, repeatedPasswordValue)}>
                        Save
                    </button>
                </div>

            </div>
        </div>
    )
}

export default AccountComponent;