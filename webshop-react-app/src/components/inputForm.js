import {useState} from "react";
import notImplemented from '../assets/notImplemented.png'

function InputForm(props){

    const [nameValue, setNameValue] = useState("")
    const [descriptionValue, setDescriptionValue] = useState("")
    const [priceValue, setPriceValue] = useState("")
    const [imageValue, setImageValue] = useState(null)

    const [nameErrorText, setNameErrorText] = useState("")
    const [priceErrorText, setPriceErrorText] = useState("")

    const inputFormStyle = {
        margin: '10px',
        border: '2px solid black',
        zIndex: '1'
    }

    const updateNameValue = (e) => {
        console.log(e);
        setNameValue(e.target.value);
    }

    const updateDescriptionValue = (e) => {
        console.log(e);
        setDescriptionValue(e.target.value);
    }

    const updatePriceValue = (e) => {
        console.log(e);
        setPriceValue(e.target.value);
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImageValue(file);
    }

    const onFormSubmit = (name, description, price, image) => {
        setPriceErrorText("")
        setNameErrorText("")

        try {
            let fPrice = parseFloat(price);
            fPrice.toFixed(2)
            price = fPrice.toString();
        } catch (e) {
            setPriceErrorText("<-- Please use decimal point followed by two digits, example: 14.99")
        }

        if (name !== "" && price !== ""){
            if (description === ""){
                description = "No description provided...";
            }
            props.inputFormHandler(name, description, price, image)
        } else {
            if (name === ""){
                setNameErrorText("<-- Please enter a name")
            }
            if (price === "") {
                setPriceErrorText("<-- Please enter a price")
            }
        }
        setNameValue("")
        setDescriptionValue("")
        setPriceValue("")
    }

    return (
        <div style={inputFormStyle}>
            <div style={{display: 'flex'}}>
                <div style={{margin: '10px'}}>
                    <div style={{margin: '10px', width: '30em'}}>
                        <div>
                            <h2 style={{margin: '10px'}}>
                                Add a new shop item:
                            </h2>
                        </div>
                        <div style={{display: 'flex'}}>
                            Name:
                            <div style={{marginRight: '10px', marginLeft: 'auto'}}>
                                <input type='text' value={nameValue} onChange={updateNameValue}/>
                            </div>
                            <div style={{color: 'red', width: '150px'}}>
                                {nameErrorText}
                            </div>
                        </div>
                        <div style={{display: 'flex'}}>
                            Price:
                            <div style={{marginRight: '10px', marginLeft: 'auto'}}>
                                <input type='text' value={priceValue} onChange={updatePriceValue}/>
                            </div>
                            <div style={{color: 'red', width: '150px'}}>
                                {priceErrorText}
                            </div>
                        </div>
                        <div style={{display: 'flex'}}>
                            Description:
                            <div style={{marginRight: '10px', marginLeft: 'auto'}}>
                                 <textarea rows="5" cols="21" value={descriptionValue} onChange={updateDescriptionValue}/>
                            </div>
                            <div style={{color: 'green', width: '150px'}}>
                                (Optional)
                            </div>
                        </div>
                        <button onClick={() => onFormSubmit(nameValue, descriptionValue, priceValue, imageValue)}>
                            {props.text}
                        </button>
                    </div>
                </div>
                <div style={{margin: '10px', width: '30em'}}>
                    {imageValue && (
                        <div style={{display: 'flex'}}>
                            <img src={URL.createObjectURL(imageValue)} alt="User image" style={{width: '190px', height: '190px'}}/>
                        </div>
                    )}
                    <div>
                        Image (optional)
                        <input type="file" accept="image/" onChange={handleFileChange}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InputForm;