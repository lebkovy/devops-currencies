import React, {useState, useEffect} from 'react';
import axios from "axios";

const User = (props) => {

    const [user, setUser] = useState(null);

    const deleteUser = (id) => {
        axios.post('http://localhost:5000/users/delete', {id: id})
            .then(response => props.setUsers(response.data))
            .catch(error => console.error(error));
    }

    const editUser = (id, name) => {
        axios.put('http://localhost:5000/users/edit', {id: id, name: name})
            .then(response => {
                props.setUsers(response.data);
                setUser(null);
            })
            .catch(error => console.error(error));
    }

    return (
        <>
            {user ? <div>
                <p>{user.name}</p>
                <input type="text" onChange={event => user.name = event.target.value} />
                <input type="button" value="Edytuj" onClick={() => editUser(user.id, user.name)} />
            </div> : <></>}
            {props.users.map(user => (
                <p key={user.id}>
                    <span onClick={() => setUser(user)}>- {user.name}</span>
                    <span onClick={() => deleteUser(user.id)}> -> usuń</span>
                </p>
            ))}
        </>
    )
}

export default User;
