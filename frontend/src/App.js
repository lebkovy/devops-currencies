import './App.css';
import React, {useState, useEffect} from 'react';
import Operation from './common/Operation';
import AddForm from './forms/AddForm';
import axios from "axios";

function App() {

    const [operations, setOperations] = useState([]);

    useEffect(() => {
        axios.get('http://localhost/api/operations')
            .then(response => {
                setOperations(response.data);
            })
            .catch(error => console.error(error));
    }, []);

    return (
        <>
            <div>
                <section className="hero is-large has-bg has-bg-black">
                    <div className="hero__content">

                    </div>
                </section>
                    <div className="grid grid-list sticky-top">
                        <div className="column is-half is-center">
                            <AddForm operations={operations} setOperations={setOperations} />
                        </div>
                    </div>
                    <div className="grid grid-list">
                        <div className="column is-half is-center">
                            <h3>Twoje operacje</h3>
                            <h5 className="subtitle" style={{marginBottom: "48px"}}>Poniżej znajdziesz wszystkie zarejestrowane przez Ciebie operacje</h5>
                            <Operation operations={operations} setOperations={setOperations} />
                        </div>
                    </div>

            </div>
        </>
    );
}

export default App;
