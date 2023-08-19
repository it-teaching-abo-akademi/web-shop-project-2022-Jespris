function repopDB() {
    console.log("Function called")
    fetch('http://localhost:8011/repopulate/')
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
        })
        .catch(err => {
            console.error("Error repopulating database: ", err)
            return false
        })
    return true
}

function testFunction(){
    console.log("Test function is working...")
}