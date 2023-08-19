import {useEffect, useState} from "react";
import {SERVER_URL} from "../App.js";
import axios from "axios";

function HomeComponent(props) {

    const [html, setHtml] = useState('');
    const [dbReset, setDBReset] = useState(false);

    const resetDBHandler = () => {
        localStorage.removeItem('username')
        localStorage.removeItem('authToken')
        props.handleLogout();
        PopulateDB();
        setDBReset(true)
    }

    const PopulateDB = () => {
        console.log("Populating database with new users and their shop items");
        fetch(`${SERVER_URL}/repopulate/`).then(response => {
            if (!response.ok) {
                throw new Error("Error deleting items from API call: " + response.statusCode);
            }
            console.log("Database repopulated! Response: ", response)
            return response.json();
        });
    }

    useEffect(() => {
        axios.get(`${SERVER_URL}/`)
            .then(response => {
                const htmlContent = response.data;
                setHtml(htmlContent);
            })
            .catch(err => {
                console.log("Error fetching HTML: ", err)
            });
    }, []);

    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: html }} />
            <div>
                {!dbReset &&
                    <button onClick={() => resetDBHandler()}>Repopulate database with users and items</button>
                }
                {dbReset &&
                    <div>
                        Database regenerated!
                    </div>
                }
            </div>
        </div>
    )
}

export default HomeComponent;
