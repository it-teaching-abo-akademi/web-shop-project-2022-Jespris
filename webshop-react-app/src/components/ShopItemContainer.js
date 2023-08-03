function ShopItemContainer(props) {
    const shopContainerStyle = {
        border: 'black solid 2px',
        width: '80vm',
        margin: '10px',
        zIndex: '3',
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
    )
}

export default ShopItemContainer;