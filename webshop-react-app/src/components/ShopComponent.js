import {useEffect, useState} from "react";
import ShopItem from "./ShopItem";
import TopBarContainer from "./TopBarContainer";
import InputForm from "./inputForm";
import ShopItemContainer from "./ShopItemContainer";
import catJam from '../assets/catjam.gif';
import moneyCat from '../assets/moneyCat.gif';
import doorCat from '../assets/doorCat.gif';
import aggroLickCat from '../assets/aggressiveLickCat.gif';

function ShopComponent() {
    class ItemInShop {
        constructor(name, description, price, username, date) {
            this.name = name;
            this.description = description;
            this.price = price;
            this.username = username;
            this.date = date;
        }
    }

    const username = localStorage.getItem('username')

    const SHOP_ITEM_API_URL = 'http://localhost:8000/api/v1/shopItems/';
    const POPULATE_USERS = 'http://localhost:8000/api/v1/auth/populateUserDB/';
    const POPULATE_ITEMS = 'http://localhost:8000/api/v1/shopItems/populateDB/';
    const GET_ALL_USERS = 'http://localhost:8000/api/v1/auth/users/';
    const DELETE_ITEM_DB = 'http://localhost:8000/api/v1/shopItems/deleteItemDB/';
    let items;
    const [shopItems, setShopItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1)
    const ITEMS_PER_PAGE = 10;

    const deleteCartItemHandler = (itemID) => {
        setCartItems(prevState => [
            ...prevState.slice(0, itemID),
            ...prevState.slice(itemID + 1)
        ])
    }

    const deleteCartHandler = () => {
        setCartItems([])
    }

    const addCartItem = (name, price) => {
        setCartItems(prevState => [...prevState, [name, price]])
    }

    items = shopItems.map((value, index) => (
        <ShopItem key={index} shopItem={value} addCartItemHandler={addCartItem} loggedInUser={username}></ShopItem>
    ))

    const apiFetchPost = (name, description, price) => {
        console.log("Posting shop item '", name, "' to API")
        fetch(SHOP_ITEM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Auth token hopefully set in App.js
                'Authorization': 'Token ' + localStorage.getItem('authToken')
            },
            body: JSON.stringify({name: name, description: description, price: price, username: username})
        }).then(
            response => {
                if(!response.ok) {
                    throw new Error("API posting error: " + response.statusCode);
                }
                return response.json();
            }
        ).then(data => {
            console.log("DATA: ", data)
            APIFetchShopItems();
        }).catch(err => console.log("Error: ", err))
    }

    const APIFetch = async () => {
        let url = SHOP_ITEM_API_URL;
        let pageNr = '?page='+currentPage;
        if (searchValue !== ""){
            console.log("Filtering items...")
            url = url+searchValue+'/';
        }
        url = url + pageNr;
        const response = await fetch(url);
        if (!response.ok){
            throw new Error("API fetch error: " + response.statusCode)
        }
        const data = await response.json();
        console.log("Shop items data: ", data);
        return data;
    }

    const APIFetchUsers = async () => {
        const response = await fetch(GET_ALL_USERS);
        if (!response.ok){
            throw new Error("API fetch error: " + response.statusCode)
        }
        return await response.json()
    }

    const APIFetchShopItems = () => {
        console.log("Fetching shop items...")
        APIFetch().then(data => setShopItems(
            (prev => data.results.map(
                p => new ItemInShop(p.name, p.description, p.price, p.username, p.date)))))
            .catch(err => console.log("Error: ", err))
        console.log("DONE fetching shop items!")
    }

    const deleteItemsFromApi = () => {
      console.log("Deleting items from the API");
      return fetch(DELETE_ITEM_DB).then(response => {
        if (!response.ok) {
          throw new Error("Error deleting items from API call: " + response.statusCode);
        }
        return response.json();
      });
    };

    const addUsersToApi = () => {
      console.log("Adding users to the API");
      return fetch(POPULATE_USERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number: 6 }),
      }).then(response => {
        if (!response.ok) {
          throw new Error("API posting error: " + response.statusCode);
        }
        return response.json();
      });
    };

    const addShopItemsToApi = async (user) => {
      console.log(`Adding shop items for user ${user}`);
      return fetch(POPULATE_ITEMS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ number: 10, username: user }),
      }).then(response => {
        if (!response.ok) {
          throw new Error("Error adding items from API call: " + response.statusCode);
        }
        return response.json();
      });
    };

    const PopulateDB = () => {
      console.log("Populating database with new users and their shop items");
      deleteItemsFromApi()
        .then(() => addUsersToApi())
        .then(data => {
          console.log("DATA: ", data);
          return APIFetchUsers();
        })
        .then(users => {
          console.log("USER DATA: ", users);
          users = [...users.slice(0, 3)];
          return Promise.all(users.map(user => addShopItemsToApi(user.username)));
        })
        .then(() => refreshPage())
        .catch(err => console.log("Error: ", err));
    };

    const refreshPage = () => {
        console.log("App changed");

        APIFetch().then(data => {
            if (data && Array.isArray(data.results)) {
                setShopItems(
                prevState => data.results.map(
                    p => new ItemInShop(p.name, p.description, p.price, p.username, p.date)
                    )
                )
            }
            if (data) {
                // update totalPages variable
                setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE))
            }
        }).catch(err => console.log("Error: ", err))
    }

    const searchFormHandler = (search) => {
        setSearchValue(search)
    }

    const pageNumberHandler = (nr) => {
        if (nr >= 0 && nr <= totalPages) {
            setCurrentPage(nr)
        }
    }

    // do whenever refresh
    useEffect(() => {
        refreshPage();
    }, [searchValue])  // setting dependency to "refreshPage()" as IDE suggests causes a recursion, slowing down the website

    return (
        <div className={"shop"}>
            <div>
                <TopBarContainer cartItems={cartItems} deleteCartItemHandler={deleteCartItemHandler} deleteCartHandler={deleteCartHandler} searchFormHandler={searchFormHandler}></TopBarContainer>
            </div>
            {username &&
                <div>
                    <InputForm text={"Add shop item to database"} inputFormHandler={apiFetchPost}></InputForm>
                </div>
            }
            <div>
                <ShopItemContainer items={items} totalPages={totalPages} pageNumberHandler={pageNumberHandler} currentPage={currentPage}></ShopItemContainer>
                {/*<button onClick={() => APIFetchShopItems}>Fetch shop items from API</button>*/}
                {/* TODO: fix this: <button onClick={() => PopulateDB()}>Populate database with new users and items</button> */}
            </div>
            <div style={{height: '2000px'}}></div>
            <div style={{margin: '10px'}}>
                <h1>Congrats! You made it all the way down, have some more cat memes:</h1>
                <div style={{display: "flex", flexWrap: 'wrap', margin: '10px'}}>
                    <img src={moneyCat} alt="Money cat gif" style={{width: '40%', height: '400px', margin: 'auto'}}/>
                    <img src={catJam} alt="Cat jam gif" style={{width: '40%', height: '400px', margin: 'auto'}}/>
                    <img src={doorCat} alt="Cat at door gif" style={{width: '40%', height: '400px', margin: 'auto'}}/>
                    <img src={aggroLickCat} alt="Cat licking self aggressively gif" style={{width: '40%', height: '400px', margin: 'auto'}}/>
                </div>
            </div>
        </div>
    )
}

export default ShopComponent;