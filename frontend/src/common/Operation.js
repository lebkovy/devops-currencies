import React, {useState} from 'react';
import './Operation.css';
import axios from "axios";
import EditForm from '../forms/EditForm';

import EUR from '../assets/eur.svg';
import GBP from '../assets/gbp.svg';
import USD from '../assets/usd.svg';
import CHF from '../assets/chf.svg';

const Operation = (props) => {

    const [selected, setSelection] = useState(null);

    const deleteOperation = (id) => {
        axios.post('http://localhost:9090/api/operations/delete', {id: id})
            .then(() => {
                props.setOperations(props.operations.filter((op) => op.id !== id));
            })
            .catch(error => console.error(error));
    }

    const updateList = (operation) => {
        props.setOperations([...props.operations.filter((op) => op.id !== operation.id), operation]);
    }

    const getFlag = (curr) => {
        switch (curr.toUpperCase()) {
            case 'USD': return USD;
            case 'CHF': return CHF;
            case 'GBP': return GBP;
            default: return EUR;
        }
    }

    return (
        <>
            {props.operations.length > 0 ? props.operations.map(operation => (
                <div className="grid grid-op has-spacing has-no-col-padding" key={operation.id}>
                    <div className="column is-half">
                        {selected?.id === operation.id ?  <EditForm selected={operation} setOperation={setSelection} updateList={updateList} /> : <h4 className="subtitle">{operation.value}</h4>}
                    </div>
                    <div className="grid">
                        <div className="column is-shrink">
                            <img src={getFlag(operation.currency)} alt="" className="flag"/>
                        </div>

                        <div className="column is-shrink">
                            <h4 className="subtitle" style={{margin: "0"}}>{operation.currency}</h4>
                        </div>
                    </div>

                    <div className="gird">
                        <button className="button is-warning is-small" onClick={() => {
                            setSelection(operation);
                        }}>Edytuj</button>
                        <button onClick={() => deleteOperation(operation.id)} className="button is-danger is-small">
                            Usuń
                        </button>

                    </div>

                </div>
            )) : <h5 className="subtitle">Nie masz operacji</h5>}
        </>
    )
}

export default Operation;
