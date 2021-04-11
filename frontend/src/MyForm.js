import React, {useState} from 'react';
import axios from 'axios';

const MyForm = (props) => {

    const [name, setName] = useState("");

    const handleSubmit = (event) => {
        if (name?.length > 0) {
            axios.post('http://localhost:5000/users', {
                name: name
            })
                .then((response) => props.setUsers(response.data))
                .catch(error => console.error(error));
        }

        event.preventDefault();
    };

    return (
        <>
            <input type="text" value={name} onChange={event => setName(event.target.value)} /><br />
            <input type="submit" value="Add user" onClick={handleSubmit} />
        </>
    );

};

export default MyForm;
