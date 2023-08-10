import InputForm from "./inputForm";
import {SERVER_URL} from "../App";
import {useEffect, useState} from "react";
import MyShopItem from "./MyShopItem";
import ShopItem from "./ShopItem";

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

    const SHOP_ITEM_API_URL = SERVER_URL + 'api/v1/shopItems/byUsername/' + username + '/0/';

    let itemsForSale;
    let soldItems;
    let purchasedItems;

    const [myItemsForSale, setMyItemsForSale] = useState([]);
    const [mySoldItems, setSoldItems] = useState([]);
    const [myPurchasedItems, setPurchasedItems] = useState([])

    const [editItem, setEditItem] = useState(null);
    const [editNameValue, setNameValue] = useState("")
    const [editDescriptionValue, setDescriptionValue] = useState("")
    const [editPriceValue, setPriceValue] = useState("")

    const APIFetch = async () => {
        let url = SHOP_ITEM_API_URL
        console.log("Fetching items from: ", url)
        const response = await fetch(url);
        if (!response.ok){
            throw new Error("API fetch error: " + response.statusCode)
        }
        const data = await response.json();
        console.log("My shop items data: ", data);
        return data;
    }

    const APIFetchSoldItems = async () => {
        const url = `${SERVER_URL}api/v1/shopItems/byUsername/${username}/1/`
        console.log("Fetching items from: ", url)
        const response = await fetch(url);
        await response.json().then(data => {
            setSoldItems(data.map(
                p => new MyItemInShop(p.name, p.description, p.price, p.date, p.version)
            ))
        }).catch(err => console.log("Error: ", err));
    }

    const APIFetchPurchasedItems = async () => {
        const url = `${SERVER_URL}api/v1/shopItems/byPurchasedBy/${username}/1/`
        console.log("Fetching items from: ", url)
        const response = await fetch(url);
        await response.json().then(data => {
            setPurchasedItems(data.map(
                p => new MyItemInShop(p.name, p.description, p.price, p.date, p.version)
            ))
        }).catch(err => console.log("Error: ", err));
    }

    const APIFetchShopItemsForSale = () => {
        console.log("Fetching shop items...")
        APIFetch().then(data => {
        setMyItemsForSale(
            (prev => data.map(
                p => new MyItemInShop(p.name, p.description, p.price, p.date, p.version)
            )
            )
        )
        }).catch(err => console.log("Error: ", err))
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
            APIFetchShopItemsForSale();
        }).catch(err => console.log("Error: ", err))
    }

    const apiFetchPut = async () => {
        console.log("Editing item ", editItem, ", updating database...")
        const response = await fetch(`${SERVER_URL}api/v1/shopItems/${editItem.name}/${editItem.price}/${username}/`)
        console.log(response)
        const data = await response.json();
        console.log("Item data: ", data)
        if (data['pk'] >= 0) {
            fetch(SERVER_URL + 'api/v1/shopItems/' + data['pk'] + '/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + authToken  // Auth token hopefully set in App.js
                },
                body: JSON.stringify({
                    name: editNameValue,
                    description: editDescriptionValue,
                    price: editPriceValue,
                    version: data['version'] + 1
                })
            }).then(
                response => {
                    if (!response.ok) {
                        throw new Error("API posting error: " + response.statusCode);
                    }
                    return response.json();
                }
            ).catch(err => console.log("Error: ", err))
        }
    }

    const editItemHandler = (item) => {
        console.log("Edit item button clicked, ", item)
        setEditItem(item);
        setNameValue(item.name);
        setDescriptionValue(item.description);
        setPriceValue(item.price);
    }

    const doneEditingHandler = () => {
        console.log("Done editing!")
        setEditItem(null)
        apiFetchPut()
        refresh()
    }

    const updateValue = (e, setValue) => {
        console.log(e);
        setValue(e.target.value);
    }

    itemsForSale = myItemsForSale.map((value, index) => (
        <MyShopItem key={index} shopItem={value} editItemHandler={editItemHandler} itemStyle={"forSale"}></MyShopItem>
    ))

    soldItems = mySoldItems.map((value, index) => (
        <MyShopItem key={index} shopItem={value} itemStyle={"soldItems"}></MyShopItem>
    ))

    purchasedItems = myPurchasedItems.map((value, index) => (
        <MyShopItem key={index} shopItem={value} itemStyle={"purchasedItems"}></MyShopItem>
    ))

    const refresh = () => {
        APIFetchShopItemsForSale();
        console.log("My items for sale after refresh: ", myItemsForSale)
        APIFetchSoldItems();
        APIFetchPurchasedItems();
    }

    useEffect(() => {
        refresh()
    }, [])

    return (
        <div style={myItemsContainer}>
            <div>
                <InputForm text={"Add shop item to database"} inputFormHandler={apiFetchPost}></InputForm>
            </div>
            {editItem &&
            <div style={{margin: '10px'}}>
                <h2>Currently editing...</h2>
                <div style={{display: 'flex'}}>
                    <ShopItem shopItem={editItem}></ShopItem>
                    <div>
                        <div style={{display: 'flex'}}>
                            Edit name:
                            <div style={{marginRight: '10px', marginLeft: 'auto'}}>
                                <input type='text' value={editNameValue} onChange={(e) => updateValue(e, setNameValue)}/>
                            </div>
                        </div>
                        <div style={{display: 'flex'}}>
                            Edit Description:
                            <div style={{marginRight: '10px', marginLeft: 'auto'}}>
                                <textarea rows='5' cols='21' value={editDescriptionValue} onChange={(e) => updateValue(e, setDescriptionValue)}/>
                            </div>
                        </div>
                        <div style={{display: 'flex'}}>
                            Edit price:
                            <div style={{marginRight: '10px', marginLeft: 'auto'}}>
                                <input type='text' value={editPriceValue} onChange={(e) => updateValue(e, setPriceValue)}/>
                            </div>
                        </div>
                    </div>
                </div>
                <button onClick={() => doneEditingHandler()}>DONE!</button>
            </div>
            }
            <div style={{margin: '10px'}}>
                <h2>
                    My items for sale
                </h2>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {itemsForSale}
                </div>
                <h2>
                    My sold items
                </h2>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {soldItems}
                </div>
                <h2>
                    My bought items
                </h2>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {purchasedItems}
                </div>
            </div>
        </div>
    )
}

export default MyItemsComponent;