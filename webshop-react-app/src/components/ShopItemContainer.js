import attackCat from "../assets/attackCat.gif";
import {useState} from "react";
import shoppingCart from "../assets/shoppingCart.png";
import {SERVER_URL} from "../App";
import {redirect} from "react-router-dom";

function ShopItemContainer(props) {
    const shopContainerStyle = {
        border: 'black solid 2px',
        width: '60vm',
        margin: '10px',
        position: 'relative'
    }

    const paginationBarStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10px'
    }

    const BUTTON_WIDTH = '50px'

    const activeStyle = {
        width: BUTTON_WIDTH,
        backgroundColor: 'red',
        color: 'white'
    }

    const inActiveStyle = {
        width: BUTTON_WIDTH,
        backgroundColor: 'white',
        color: 'black'
    }

    console.log("ShopItem container items: ", props.items)

    return (
        <div style={{display: 'flex'}}>
            <div style={shopContainerStyle}>
                <div style={{margin: '10px'}}>
                    <h1>
                        Shop items to buy
                    </h1>
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {props.items}
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <div style={paginationBarStyle}>
                        {props.currentPage > 1 &&
                            <div>
                                <button onClick={() => props.pageNumberHandler(1)} style={{width: BUTTON_WIDTH}}>{String("<<<")}</button>
                                <button onClick={() => props.pageNumberHandler(props.currentPage - 1)} style={{width: BUTTON_WIDTH}}>{String("<")}</button>
                            </div>
                        }
                        {Array.from({length: props.totalPages }, (_, index) => (
                            <button key={index + 1} onClick={() => props.pageNumberHandler(index + 1)} style={props.currentPage === index + 1 ? activeStyle: inActiveStyle}>
                                {index + 1}
                            </button>
                        ))}
                        {props.currentPage < props.totalPages &&
                            <div>
                                <button onClick={() => props.pageNumberHandler(props.currentPage + 1)} style={{width: BUTTON_WIDTH}}>{String(">")}</button>
                                <button onClick={() => props.pageNumberHandler(props.totalPages)} style={{width: BUTTON_WIDTH}}>{String(">>>")}</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <ShoppingCart cartItems={props.cartItems} deleteCartItemHandler={props.deleteCartItemHandler} deleteCartHandler={props.deleteCartHandler} authToken={props.authToken} username={props.username}></ShoppingCart>
        </div>
    )
}

function ShoppingCart(props) {
    const width = '40vm';
    const cartStyle = {
        border: 'solid black 2px',
        width: width,
        minWidth: '280px',
        maxWidth: '500px',
        marginBottom: 'auto',
        margin: '10px',
    }


    const openCartStyle = {
        ...cartStyle,
        backgroundColor: 'yellow'
    }

    const closedCartWithContentMargin = '10px';

    const [showCart, setShowCart] = useState(false);

    const showBasketHandler = (e) => {
        if (props.cartItems.length > 0) {
            setShowCart(!showCart);
        }
    }

    const deleteBasketHandler = () => {
        props.deleteCartHandler()
        setShowCart(false)
    }

    const getTotalCost = () => {
        let totalCost = 0;
        props.cartItems.forEach((value) => (
            totalCost += parseFloat(value[1])
        ))

        return totalCost.toFixed(2);
    }

    const payBasketHandler = async () => {
        const totalCost = getTotalCost();
        console.log("Paying cart, total: ", totalCost);

        let totalSuccess = true;

        for (const cartItem of props.cartItems) {
            console.log("Updating item: ", cartItem[0])
            let success = buyItemHandler(cartItem);
            if (success){
                console.log("Successful purchase for item: ", cartItem[0])
            } else {
                console.log("Unsuccessful purchase for item: ", cartItem[0])
                totalSuccess = false;
            }
        }

        // TODO: Show user total success and close cart?
        // - refresh
    }

    const buyItemHandler = async(cartItem) => {
        // get the item ID to buy
        const response = await fetch(`${SERVER_URL}api/v1/shopItems/${cartItem[0]}/${cartItem[1]}/${cartItem[2]}/`)
        console.log(response);
        const data = await response.json();
        console.log("Item data: ", data)
        if (data['version'] !== cartItem[3]){
            // item has been updated since last page refresh
            console.log("Version difference... checking differences")
            // TODO: check what has changed and set cartItem[4] (the stateChange variable) to a suitable text string
            // React and Javascript variables are passed by reference
            if (data['price'] !== cartItem[1]){
                cartItem[4] = "Price changed from " + cartItem[1] + " to "
                cartItem[1] = data['price'];
            } else if (data['sold']){
                cartItem[4] = "NOT AVAILABLE"
            }
            // update the rest of the data
            cartItem[0] = data['name']
            cartItem[3] = data['version']
            return false;  // unsuccessful
        } else {
            // Everything is in order (hopefully)
            // TODO: set sold to true and update version
            fetch(`${SERVER_URL}api/v1/shopItems/buy/${data['pk']}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + props.authToken
                },
                body: JSON.stringify({
                    username: props.username
                })
            }).then(
                response => {
                    if (!response.ok) {
                        throw new Error("Failed to buy item.. " + response.statusCode)
                    }
                    return response.json()
                }
            ).catch(err => console.log("ERROR: ", err))
            redirect('http://localhost:3000/shop')
            return true;  // success
        }
    }

    // cartItems structure: [[name, price, username, version, stateChange], [...]]

    return (
        <div style={showCart ? openCartStyle : cartStyle}>
            {!showCart && props.cartItems.length > 0 && (
                <div style={{margin: closedCartWithContentMargin, position: 'relative', display: 'flex'}}>
                    <b onClick={showBasketHandler} style={{textAlign: 'center'}}>
                        Cart ({props.cartItems.length})
                    </b>
                    <div style={{position: 'absolute', right: '0'}}>
                        <button onClick={showBasketHandler}>Show</button>
                    </div>
                </div>
            )}
            {!showCart && props.cartItems.length === 0 && (
                <div>
                    {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                    <img src={shoppingCart} alt="Shopping cart image" style={{width: '100%', height: '100%'}} />
                </div>
            )}
            {showCart && (
                <div style={{textAlign: 'left', margin: '10px'}}>
                    {props.cartItems.map((value, i) => (
                        <li key={i} style={{display: 'flex'}}>
                            <div>
                                {value[0]},{value[4]} <b>{value[1]}€</b>
                            </div>
                            <div style={{marginLeft: 'auto', marginRight: '0px'}}>
                                <button  onClick={() => props.deleteCartItemHandler(i)}>x</button>
                            </div>
                        </li>
                    ))}
                    <div style={{display: 'flex'}}>
                        <div>
                            <b>TOTAL:</b>
                        </div>
                        <div style={{marginLeft: 'auto', marginRight: '0px'}}>
                            {getTotalCost()}€
                        </div>
                    </div>
                    {props.cartItems.length > 0 && (
                        <div style={{display: 'flex', position: 'relative'}}>
                            <div>
                                <button onClick={() => deleteBasketHandler()}>Remove All</button>
                            </div>
                            <div style={{position: 'absolute', right: '0'}}>
                                <button style={{color: 'green'}} onClick={() => payBasketHandler()}>Pay</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ShopItemContainer;