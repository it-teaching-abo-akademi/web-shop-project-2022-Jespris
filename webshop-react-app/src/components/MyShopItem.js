

function MyShopItem(props) {
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
            <ShopItemInfo shopItem={props.shopItem} editItemHandler={props.editItemHandler}></ShopItemInfo>
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
    const date = new Date(props.shopItem.date).toUTCString();
    const version = props.shopItem.version;

    return (
        <div style={infoStyle}>
            <div style={{display: 'flex'}}>
                <h3>
                    {name}
                </h3>
                <div style={{marginLeft: 'auto', marginRight: '10px'}}>
                    <button onClick={() => props.editItemHandler}>Edit</button>
                </div>
            </div>
            <div style={{textAlign: 'left'}}>
                <b>Description: </b>{description}
            </div>
            <div style={{textAlign: 'left'}}>
                <b>Price: </b>{price}€
            </div>
            <div style={{textAlign: 'left', marginBottom: '0px', marginTop: 'auto', position: 'absolute', bottom: '0'}}>
                <i>posted {date}, version {version}</i>
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

export default MyShopItem;