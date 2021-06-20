import React, {useState} from 'react';
import axios from 'axios';

const EditForm = (props) => {

    const [value, setValue] = useState(props.selected.value);
    const [currency, setCurrency] = useState(props.selected.currency);
    const [active, setActive] = useState(false);

    const CURRENCIES_LIST = ['USD', 'EUR', 'CHF', 'GBP'];

    const editOperation = () => {
        const operation = {id: props.selected.id, value: +value, currency: currency};
        axios.put('http://localhost:9090/api/operations', {id: operation.id, value: operation.value, currency: operation.currency})
            .then(() => {
                props.updateList(operation);
                reset();
            })
            .catch(error => console.error(error));
    }

    const reset = () => props.setOperation(null);

    return (
        <>
            <div className="grid has-no-col-padding has-spacing">
                <div className="column">
                    <input type="number" defaultValue={props.selected.value} className="input" placeholder="Wprowadź kwotę" onChange={event => {
                        setValue(event.target.value)
                    }}/><br />
                </div>
                <div className="column">
                    <div className={`has-dropdown ${active ? 'is-active' : ''}`}>
                        <button className="button is-warning has-arrow" onClick={() => setActive(!active)}>{currency ?? "Wybierz walutę"}</button>
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
                    <button className="button is-primary" onClick={editOperation}>Zapisz operację</button>
                </div>
                <div className="column is-shrink">
                    <button className="button is-light" style={{marginLeft: "12px"}} onClick={reset}>Anuluj</button>
                </div>
            </div>
        </>
    );

};

export default EditForm;
