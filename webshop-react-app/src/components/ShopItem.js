import {useEffect, useState} from "react";
import {SERVER_URL} from "../App";


function ShopItem(props) {
    const shopItemStyle = {
        width: '30vm',
        maxWidth: '600px',
        minWidth: '300px',
        height: '200px',
        margin: '10px',
        border: 'solid 1px black',
        display: 'flex'
    }

    return (
        <div style={shopItemStyle}>
            <ShopItemInfo
                loggedInUser={props.loggedInUser}
                shopItem={props.shopItem}
                addCartItemHandler={props.addCartItemHandler}
                cartItems={props.cartItems}>
            </ShopItemInfo>
            <ShopItemImage image={props.shopItem.image}></ShopItemImage>
        </div>
    )
}

function ShopItemInfo(props) {
    const infoStyle = {
        width: '50em',
        height: '180px',
        margin: '5px',
        position: 'relative'
    }

    const name = props.shopItem.name;
    const price = props.shopItem.price;
    const description = props.shopItem.description;
    const username = props.shopItem.username;
    const date = new Date(props.shopItem.date).toUTCString()
    const version = props.shopItem.version;

    const [inCart, setInCart] = useState(false);

    useEffect(() => {
        setInCart(
            props.cartItems.some(item => {
                console.log("Item: ", item)
                const [itemName, itemPrice, itemUsername, itemVersion, itemStateChange] = item;
                return itemName === name && itemPrice === price && itemUsername === username;
            })
        )
    }, [name, price, props.cartItems, username])



    const itemStateStyle = {
        marginLeft: 'auto',
        marginRight: '10px'
    }


    return (
        <div style={infoStyle}>
            <div style={{display: 'flex'}}>
                <h3>
                    {name}
                </h3>
                {(props.loggedInUser !== username && props.loggedInUser && !inCart) &&
                    <div style={itemStateStyle}>
                        <button onClick={() => props.addCartItemHandler(name, price, username, version)}>Add to cart</button>
                    </div>
                }
                {(props.loggedInUser === username) &&
                    <div style={itemStateStyle}>
                        <i>You own this item</i>
                    </div>
                }
                {inCart && (
                    <div style={itemStateStyle}>
                        <i>Item is in cart</i>
                    </div>
                )}
            </div>
            <div style={{textAlign: 'left'}}>
                <b>Description: </b>{description}
            </div>
            <div style={{textAlign: 'left'}}>
                <b>Price: </b>{price}€
            </div>
            <div style={{textAlign: 'left', marginBottom: '0px', marginTop: 'auto', position: 'absolute', bottom: '0'}}>
                <i><b>{username}</b> posted {date}</i>
            </div>
        </div>
    )
}

function ShopItemImage(props) {
    const imageStyle = {
        width: '190px',
        height: '190px',
        border: '1px black solid',
        margin: '5px',
        position: 'relative'
    }



    return (
        <div style={imageStyle}>
            <img src={`${SERVER_URL}${props.image}`} alt="Item image" style={{width: '190px', height: '190px'}}></img>
        </div>
    )
}

export default ShopItem;