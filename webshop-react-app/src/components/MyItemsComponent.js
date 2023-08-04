import InputForm from "./inputForm";
import {SERVER_URL} from "../App";
import {useState} from "react";
import ShopItem from "./ShopItem";
import MyShopItem from "./MyShopItem";
import ShopItemContainer from "./ShopItemContainer";

function MyItemsComponent({username, authToken, csrfToken}) {

    const myItemsContainer = {
        margin: '10px',
        border: '2px solid black',
    }

    class MyItemInShop {
        constructor(name, description, price, date, version) {
            this.name = name;
            this.description = description;
            this.price = price;
            this.date = date;
            this.version = version;
        }
    }

    const SHOP_ITEM_API_URL = SERVER_URL + 'api/v1/shopItems/';

    let itemsForSale;
    const [myItemsForSale, setMyItemsForSale] = useState([]);

    const APIFetch = async () => {
        let url = SHOP_ITEM_API_URL;
        url += url + username + '/'
        const response = await fetch(url);
        if (!response.ok){
            throw new Error("API fetch error: " + response.statusCode)
        }
        const data = await response.json();
        console.log("Shop items data: ", data);
        return data;
    }

    const APIFetchShopItems = () => {
        console.log("Fetching shop items...")
        APIFetch().then(data => setMyItemsForSale(
            (prev => data.results.map(
                p => new MyItemInShop(p.name, p.description, p.price, p.date, p.version)))))
            .catch(err => console.log("Error: ", err))
        console.log("DONE fetching shop items!")
    }

    const apiFetchPost = (name, description, price) => {
        console.log("Posting shop item '", name, "' to API")
        fetch(SERVER_URL + 'api/v1/shopItems/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Auth token hopefully set in App.js
                'Authorization': 'Token ' + authToken
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

    const editItemHandler = () => {
        console.log("Edit item button clicked")
    }

    itemsForSale = myItemsForSale.map((value, index) => (
        <MyShopItem key={index} shopItem={value} editItemHandler={editItemHandler}></MyShopItem>
    ))

    return (
        <div style={myItemsContainer}>
            <div>
                <InputForm text={"Add shop item to database"} inputFormHandler={apiFetchPost}></InputForm>
            </div>
            <div>
                <h2>
                    My items for sale
                </h2>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {itemsForSale}
                </div>
                <h2>
                    My sold items
                </h2>
                <h2>
                    My bought items
                </h2>
            </div>
        </div>
    )
}

export default MyItemsComponent;