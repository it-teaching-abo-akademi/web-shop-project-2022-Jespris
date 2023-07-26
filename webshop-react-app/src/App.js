import './App.css';
import ShopItemContainer from './components/ShopItemContainer'
import ShopItem from './components/ShopItem'
import TopBarContainer from './components/TopBarContainer'
import InputForm from "./components/inputForm";
import {useState, useEffect} from "react";

function App() {
    const SHOP_ITEM_API_URL = 'http://127.0.0.1:8000/api/v1/shopItems/';
    const POPULATE_USERS = 'http://127.0.0.1:8000/api/v1/auth/populateUserDB/';
    const POPULATE_ITEMS = 'http://127.0.0.1:8000/api/v1/shopItems/populateDB/'
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
        <ShopItem key={index} name={value[0]} description={value[1]} price={value[2]} addCartItemHandler={addCartItem}></ShopItem>
    ))

    const apiFetchPost = (name, description, price) => {
        console.log("Posting shop item '", name, "' to API")
        fetch(SHOP_ITEM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: name, description: description, price: price})
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

    const APIFetchShopItems = () => {
        console.log("Fetching shop items...")
        APIFetch().then(data => setShopItems(
            (prev => data.results.map(
                p => [p.name, p.description, p.price]))))
            .catch(err => console.log("Error: ", err))
        console.log("DONE fetching shop items!")
    }

    const PopulateDB = () => {
        console.log("Populating database with new users and their shop items")
        // API Call to delete items in database
        fetch(POPULATE_ITEMS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({number: 0, delete_existing: true})
        }).then(
            response => {
                if (!response.ok){
                    throw new Error("Error deleting items from api call: " + response.statusCode)
                }
                return response.json()
            }
        )
        // Add users
        fetch(POPULATE_USERS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({number: 6})
        }).then(
            response => {
                if(!response.ok) {
                    throw new Error("API posting error: " + response.statusCode);
                }
                return response.json();
            }
        ).then(data => {
            console.log("DATA: ", data)
        }).catch(err => console.log("Error: ", err))

        // TODO: get newly created users and create shop items from them!
    }

    // do whenever refresh
    useEffect(() => {
        console.log("App changed");
        APIFetch().then(data => setShopItems(
            prevState => data.results.map(
                p => [p.name, p.description, p.price]
            )
        )).catch(err => console.log("Error: ", err))
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
