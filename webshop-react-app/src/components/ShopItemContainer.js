function ShopItemContainer(properties) {
    const shopContainerStyle = {
        border: 'black solid 2px',
        width: '80vm',
        align: 'center',
        margin: '10px',
        zIndex: '3'
    }

    console.log("ShopItem container items: ", properties.items)

    return (
        <div style={shopContainerStyle}>
            <h1>
                Shop items to buy
            </h1>
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                {properties.items}
            </div>
        </div>
    )
}

export default ShopItemContainer;