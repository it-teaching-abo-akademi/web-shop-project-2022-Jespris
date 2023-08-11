import attackCat from '../assets/attackCat.gif';

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

export default TopBarContainer;