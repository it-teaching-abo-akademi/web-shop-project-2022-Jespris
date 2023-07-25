import './App.css';
import ShopItemContainer from './components/ShopItemContainer'
import ShopItem from './components/ShopItem'
import TopBarContainer from './components/TopBarContainer'
import {useState} from "react";

function App() {
    let items;
    const [shopItems, setShopItems] = useState([
        ["Mattress", "An old used, stinky, stained mattress. 180cm (WARNING: VERY HEAVY)", "20€"],
        ["Flatscreen TV", "TV with some pixels broken, and the backlight is uneven", "35€"]
    ])

    const [cartItems, setCartItems] = useState([])



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

    const addShopItemHandler = (item) => {
        setShopItems(prevState => [...prevState, item])
    }

    items = shopItems.map((value, index) => (
        <ShopItem key={index} name={value[0]} description={value[1]} price={value[2]} addCartItemHandler={addCartItem}></ShopItem>
    ))

  return (
      <div style={{margin: '10px'}}>
          <h1 style={{textAlign: 'center'}}>
                  Welcome to my shop!
          </h1>
          <div>
              <TopBarContainer cartItems={cartItems} deleteCartItemHandler={deleteCartItemHandler} deleteCartHandler={deleteCartHandler}></TopBarContainer>
          </div>
          <div className="App">
                <ShopItemContainer items={items}></ShopItemContainer>
          </div>
      </div>
  );
}

export default App;
