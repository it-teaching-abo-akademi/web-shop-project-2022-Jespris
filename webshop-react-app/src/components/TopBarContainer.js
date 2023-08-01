import {useState} from "react";
import attackCat from '../assets/attackCat.gif';
import shoppingCart from '../assets/shoppingCart.png';

function TopBarContainer(props) {
    const containerStyle = {
        width: '80vm',
        height: '100px',
        margin: '10px',
        display: 'flex',
        border: '2px solid black',
        zIndex: '1'
    }

    const username = localStorage.getItem('username')

    return (
        <div style={containerStyle}>
            <LogoImage></LogoImage>
            {username &&
                <div style={{display: 'flex', marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto', width: '400px'}}>
                    Welcome back, {username}!
                </div>
            }
            {!username &&
                <div style={{display: 'flex', marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto', width: '400px'}}>
                    Log in please!
                </div>
            }
            <SearchBar searchFormHandler={props.searchFormHandler}></SearchBar>
            <ShoppingCart cartItems={props.cartItems} deleteCartItemHandler={props.deleteCartItemHandler} deleteCartHandler={props.deleteCartHandler}></ShoppingCart>
        </div>
    )
}

function SearchBar(props) {

    const searchBarStyle = {
        width: '240px',
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: 'auto',
        marginRight: '10px',
        display: 'flex'
    }

    const updateSearchValue = (e) => {
        console.log("Search value input: ", e.target.value);
        props.searchFormHandler(e.target.value)
    }

    return (
        <div style={searchBarStyle}>
            <label>
                Search: <input type='text' onChange={updateSearchValue}></input>
            </label>
        </div>
    )
}

function LogoImage(props) {
    const logoStyle = {
        width: '80px',
        height: '80px',
        margin: '10px',
        border: '1px black solid'
    }

    return (
        <div style={logoStyle}>
            <img src={attackCat} alt="Attacking cat gif" style={{width: '100%', height: '100%'}}/>
        </div>
    )
}

function ShoppingCart(props) {
    const openCartStyle = {
        border: 'solid black 1px',
        width: '200px',
        minHeight: '80px',
        maxHeight: '400px',
        marginLeft: 'auto',
        marginRight: '10px',
        marginTop: '10px',
        marginBottom: '-150px',
        zIndex: '2',
        backgroundColor: 'gray',
        position: 'relative'
    }

    const closedCartStyle = {
        border: 'solid black 1px',
        width: '80px',
        height: '80px',
        marginLeft: 'auto',
        marginRight: '10px',
        marginTop: '10px'
    }

    let length = props.cartItems.length;
    if (length === 0){
        length = "empty"
    }

    const closedCartWithContentMargin = '10px'

    const [showCart, setShowCart] = useState(false);
    const [cartStyle, setCartStyle] = useState(closedCartStyle);

    const showBasketHandler = (e) => {
        if (showCart) {
            setShowCart(false);
            setCartStyle(closedCartStyle);
        }
        else {
            if (length !== "empty"){
                setShowCart(true);
                setCartStyle(openCartStyle);
            }
        }
    }

    const deleteBasketHandler = () => {
        props.deleteCartHandler()
        setShowCart(false)
        setCartStyle(closedCartStyle)
    }

    const getTotalCost = () => {
        let totalCost = 0;
        props.cartItems.map((value, i) => (
            totalCost += parseFloat(value[1])
        ))

        return totalCost.toFixed(2);
    }

    // TODO: add conditional to only show "remove all" button when stuff is in the cart
    return (
        <div style={cartStyle}>
            {(!showCart && length !== "empty") &&
                <div style={{margin: closedCartWithContentMargin}}>
                    <b onClick={showBasketHandler} style={{textAlign: 'center'}}>
                        Cart ({length})
                    </b>
                    <button onClick={showBasketHandler}>Show</button>
                </div>
            }
            {(!showCart && length === "empty") &&
                <div>
                    <img src={shoppingCart} alt="Shopping cart image" style={{width: '100%', height: '100%'}} />
                </div>
            }
            {showCart &&
                <div style={{textAlign: 'left', margin: '10px'}}>
                    {props.cartItems.map((value, i) => (
                        <li key={i} style={{display: 'flex'}}>
                            <div>
                                {value[0]}: <b>{value[1]}€</b>
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
                    <div style={{position: 'absolute', bottom: '0'}}>
                        <button onClick={() => deleteBasketHandler()}>Remove All</button>
                    </div>
                </div>
                }

        </div>
    )
}

export default TopBarContainer;