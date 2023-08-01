

function ShopItem(props) {
    const shopItemStyle = {
        width: '40vm',
        maxWidth: '800px',
        minWidth: '400px',
        height: '200px',
        margin: '10px',
        border: 'solid 1px black',
        display: 'flex'
    }

    return (
        <div style={shopItemStyle}>
            <ShopItemInfo loggedInUser={props.loggedInUser} shopItem={props.shopItem} addCartItemHandler={props.addCartItemHandler}></ShopItemInfo>
            <ShopItemImage image={props.image}></ShopItemImage>
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

    return (
        <div style={infoStyle}>
            <div style={{display: 'flex'}}>
                <h3>
                    {name}
                </h3>
                {(props.loggedInUser !== username && props.loggedInUser) &&
                    <div style={{marginLeft: 'auto', marginRight: '10px'}}>
                        <button onClick={() => props.addCartItemHandler(name, price)}>Add to cart</button>
                    </div>
                }
                {(props.loggedInUser === username) &&
                    <div style={{marginLeft: 'auto', marginRight: '10px'}}>
                        <i>You own this item</i>
                    </div>
                }
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
        width: '50em',
        height: '190px',
        image: '',
        border: '1px black solid',
        margin: '5px',
        position: 'relative'
    }

    imageStyle.image = props.image;

    return <div style={imageStyle}></div>
}

export default ShopItem;