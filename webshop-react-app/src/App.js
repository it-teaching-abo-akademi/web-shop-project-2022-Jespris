import './App.css';
import ShopItemContainer from './components/ShopItemContainer'
import ShopItem from './components/ShopItem'
import TopBarContainer from './components/TopBarContainer'
import InputForm from "./components/inputForm";
import {useState, useEffect} from "react";

function App() {

    class ItemInShop {
        constructor(name, description, price, username, date) {
            this.name = name;
            this.description = description;
            this.price = price;
            this.username = username;
            this.date = date;
        }
    }

    const SHOP_ITEM_API_URL = 'http://localhost:8000/api/v1/shopItems/';
    const POPULATE_USERS = 'http://localhost:8000/api/v1/auth/populateUserDB/';
    const POPULATE_ITEMS = 'http://localhost:8000/api/v1/shopItems/populateDB/';
    const GET_ALL_USERS = 'http://localhost:8000/api/v1/auth/users/';
    let items;
    const [shopItems, setShopItems] = useState([])
    const [cartItems, setCartItems] = useState([])



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

    const addShopItemHandler = (item) => {
        setShopItems(prevState => [...prevState, item])
    }

    items = shopItems.map((value, index) => (
        <ShopItem key={index} shopItem={value} addCartItemHandler={addCartItem}></ShopItem>
    ))

    const apiFetchPost = (shopItem) => {
        console.log("Posting shop item '", shopItem.name, "' to API")
        fetch(SHOP_ITEM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: shopItem.name, description: shopItem.description, price: shopItem.price, username: shopItem.username})
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
        const response = await fetch(SHOP_ITEM_API_URL);
        if (!response.ok){
            throw new Error("API fetch error: " + response.statusCode)
        }
        return await response.json()
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
      return fetch(POPULATE_ITEMS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number: 0, delete_existing: true }),
      }).then(response => {
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

    const addShopItemsToApi = (user) => {
      console.log(`Adding shop items for user ${user.username}`);
      return fetch(POPULATE_ITEMS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number: 10, username: user.username, delete_existing: false }),
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
          return Promise.all(users.map(user => addShopItemsToApi(user)));
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
        }).catch(err => console.log("Error: ", err))
    }

    // do whenever refresh
    useEffect(() => {
        refreshPage();
    }, [])

  return (
      <div style={{margin: '10px'}}>
          <h1 style={{textAlign: 'center'}}>
                  Welcome to my shop!
          </h1>
          <div>
              <TopBarContainer cartItems={cartItems} deleteCartItemHandler={deleteCartItemHandler} deleteCartHandler={deleteCartHandler}></TopBarContainer>
          </div>
          <div>
              <InputForm text={"Add shop item to database"} inputFormHandler={apiFetchPost}></InputForm>
          </div>
          <div className="App">
              <ShopItemContainer items={items}></ShopItemContainer>
              {/*<button onClick={() => APIFetchShopItems}>Fetch shop items from API</button>*/}
              <button onClick={() => PopulateDB()}>Populate database with new users and items</button>
          </div>
      </div>
  );
}

export default App;
