import {useState} from "react";

function InputForm(props){

    const [nameValue, setNameValue] = useState("")
    const [descriptionValue, setDescriptionValue] = useState("")
    const [priceValue, setPriceValue] = useState("")

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

    const onFormSubmit = (name, description, price) => {
        props.inputFormHandler(name, description, price)
        setNameValue("")
        setDescriptionValue("")
        setPriceValue("")
    }

    return (
        <div style={inputFormStyle}>
            <div style={{margin: '10px', width: '20em'}}>
                <h2>
                    Add a new shop item:
                </h2>
                <div style={{display: 'flex'}}>
                    Name:
                    <div style={{marginRight: '10px', marginLeft: 'auto'}}>
                        <input type='text' value={nameValue} onChange={updateNameValue}/>
                    </div>
                </div>
                <div style={{display: 'flex'}}>
                    Price:
                    <div style={{marginRight: '10px', marginLeft: 'auto'}}>
                        <input type='text' value={priceValue} onChange={updatePriceValue}/>
                    </div>
                </div>
                <div style={{display: 'flex'}}>
                    Description:
                    <div style={{marginRight: '10px', marginLeft: 'auto'}}>
                         <textarea rows="5" cols="21" value={descriptionValue} onChange={updateDescriptionValue}/>
                    </div>
                </div>
                <button onClick={() => onFormSubmit(nameValue, descriptionValue, priceValue)}>
                    {props.text}
                </button>
            </div>
        </div>
    )
}

export default InputForm;