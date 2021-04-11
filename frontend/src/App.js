import './App.css';
import React, {useState, useEffect} from 'react';
import User from './User';
import MyForm from './MyForm';
import axios from "axios";

function App() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <>
            <div>
                <h1>Form</h1>
                <MyForm setUsers={setUsers} />
                <p>-------------------------</p>
                <h1>List of users</h1>
                <User users={users} setUsers={setUsers} />
            </div>
        </>
    );
}

export default App;
