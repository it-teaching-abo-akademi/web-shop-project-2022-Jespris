import {useEffect, useState} from "react";
import ShopItem from "./ShopItem";
import TopBarContainer from "./TopBarContainer";
import ShopItemContainer from "./ShopItemContainer";
import catJam from '../assets/catjam.gif';
import moneyCat from '../assets/moneyCat.gif';
import doorCat from '../assets/doorCat.gif';
import aggroLickCat from '../assets/aggressiveLickCat.gif';
import {SERVER_URL} from "../App";

function ShopComponent({username}) {
    class ItemInShop {
        constructor(name, description, price, username, date) {
            this.name = name;
            this.description = description;
            this.price = price;
            this.username = username;
            this.date = date;
        }
    }

    const SHOP_ITEM_API_URL = SERVER_URL + 'api/v1/shopItems/';

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

    }, [searchValue, currentPage])  // setting dependency to "refreshPage()" as IDE suggests causes a recursion, slowing down the website

    return (
        <div style={{zIndex: '3'}}>
            <div>
                <TopBarContainer cartItems={cartItems} deleteCartItemHandler={deleteCartItemHandler} deleteCartHandler={deleteCartHandler} searchFormHandler={searchFormHandler}></TopBarContainer>
            </div>
            <div>
                <ShopItemContainer items={items} totalPages={totalPages} pageNumberHandler={pageNumberHandler} currentPage={currentPage}></ShopItemContainer>
                {/*<button onClick={() => APIFetchShopItems}>Fetch shop items from API</button>*/}
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