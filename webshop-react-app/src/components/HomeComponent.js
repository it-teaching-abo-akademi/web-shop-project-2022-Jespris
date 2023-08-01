import {NavLink} from "react-router-dom";
import {useEffect, useState} from "react";
import stonks from '../assets/stonks.png';
import stocksGraph from '../assets/stocksGraph.png';
import cashHand from '../assets/cashHand.png';


function HomeComponent() {

    const authToken = localStorage.getItem('authToken')
    const username = localStorage.getItem('username');

    const HomeContainer = {
        margin: '10px',
        border: '2px solid black'
    }

    const GraphicsContainer = {
        margin: '10px',
        display: 'flex'
    }

    const InfoContainer = {
        margin: '10px',
    }

    const InfoSection = {
        margin: '10px',
        border: '1px solid black'
    }

    const LinkStyle = {
        fontWeight: 'bold',
        fontSize: 'large',
        margin: 'auto'
    }

    // TOTO: implement API calls for these
    const [users, setUsers] = useState([]);
    const [items, setItems] = useState([]);
    const [nrItems, setNrItems] = useState(0);
    const [recentItems, setRecentItems] = useState(0);
    const [nrUsers, setNrUsers] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);

    const getItems = async () => {
        try {
            const r = await fetch('http://localhost:8000/api/v1/shopItems/');
            const data = await r.json();
            setItems(data.results);
        } catch (error) {
            console.log("Error fetching items data: ", error)
            setItems([])
        }
    }

    const getUsers = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/auth/users/');
            // console.log(data);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.log("Error fetching users data: ", error)
            setUsers([]);
        }
    }

    function getActiveUsers() {
        const activeUsersCount = getUsers().then(data => {
            data.filter((user) => user.is_active)
        });
        setActiveUsers(activeUsersCount);
    }

    function getRecentItems() {

    }

    useEffect(() => {
        getItems();
        getUsers();
    }, []);

    // on refresh or state change?
    useEffect(() => {
        setNrItems(items.length);

        setNrUsers(users.length);

        const activeUserList = users.filter((user) => user.is_active);
        // console.log("Active user list: ", activeUserList);
        setActiveUsers(activeUserList.length);

        const today = new Date().toISOString().split('T')[0]  // get today's date
        const recentItemsList = items.filter((item) => (item.date.startsWith(today)))
        setRecentItems(recentItemsList.length);
    }, [items, users]);

    return (
        <div style={HomeContainer}>
            <div style={GraphicsContainer}>
                <GraphicsComponent image={stocksGraph}/>
                <GraphicsComponent image={stonks}/>
                <GraphicsComponent image={cashHand}/>
            </div>
            <div style={InfoContainer}>
                <div style={InfoSection}>
                    <div style={{margin: '10px'}}>
                        <h3>
                            Our shop statistics:
                        </h3>
                        <ul>
                            <li>{nrItems} items for sale!</li>
                            <li>{recentItems} items added today</li>
                            <li>{nrUsers} total users</li>
                            <li>{activeUsers} active users</li>
                        </ul>

                    </div>
                </div>
                <div style={InfoSection}>
                    <div style={{margin: '10px'}}>
                        <h2>
                            By going to the store you accept our terms and conditions
                        </h2>
                        <div style={{margin: 'auto', display: 'flex'}}>
                            <NavLink style={LinkStyle} to='/signup'>Sign up</NavLink>
                            <NavLink style={LinkStyle} to='/shop'>Go to shop</NavLink>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

function GraphicsComponent({image}) {
    const GraphicsStyle = {
        margin: 'auto',
        border: '1px solid black',
        width: '30%',
        height: '300px'
    }

    console.log(image)

    return (
        <div style={GraphicsStyle}>
            <img src={image} alt={image} style={{width: '100%', height: '100%'}}/>
        </div>
    )

}


export default HomeComponent;