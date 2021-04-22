import React, {useState} from 'react';
import axios from 'axios';

const AddForm = (props) => {

    const [value, setValue] = useState(null);
    const [currency, setCurrency] = useState(null);
    const [active, setActive] = useState(false);

    const CURRENCIES_LIST = ['USD', 'EUR', 'CHF', 'GBP'];

    const addOperation = (event) => {
        if (value != null && currency != null) {
            axios.post('http://localhost:5000/operations', {
                value: value,
                currency: currency
            })
                .then((response) => {
                    const operation = {id: response.data, value: value, currency: currency};
                    props.setOperations([...props.operations, operation]);
                })
                .catch(error => console.error(error));
        }

        event.preventDefault();
    };

    return (
        <>
            <div className="grid has-no-col-padding has-spacing">
                <div className="column">
                    <input type="number" className="input" style={{height: "50px"}} placeholder="Wprowadź kwotę" onChange={event => setValue(event.target.value)}/><br />
                </div>
                <div className="column">
                    <div className={`has-dropdown ${active ? 'is-active' : ''}`}>
                        <button className="button is-warning has-arrow" style={{height: "50px"}} onClick={() => setActive(!active)}>{currency ?? "Wybierz walutę"}</button>
                        <ul className="dropdown">
                            {CURRENCIES_LIST.map((val, index) => {
                                return <li key={index} className="dropdown__link" onClick={() => {
                                    setCurrency(val);
                                    setActive(!active);
                                }}>{val}</li>;
                            })}
                        </ul>

                    </div>

                </div>
                <div className="column is-shrink">
                    <button className="button is-primary" style={{height: "50px"}} onClick={addOperation}>Dodaj operację</button>
                </div>

            </div>
        </>
    );

};

export default AddForm;
