import React, { useState } from 'react'
import { useNavigate } from 'react-router';

function Login(props) {

    const [credential, setCredential] = useState({
        email: "",
        password: ""
    });

    // in v6 we use navigate instead of history
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: credential.email, password: credential.password }),
            });
            const result = await response.json();

            if(result.success){
                // save the authtoken and redirect
                localStorage.setItem('token', result.authtoken)
                props.showAlert("Successfully logged in!", "success")
                navigate("/");
            } else{
                props.showAlert("Invalid creadentials!", "danger")
            }

        } catch (error) {
            console.error("Error:", error);
        }
    }

    const handleChange = (e) => {
        setCredential({
            ...credential,
            [e.target.name]: e.target.value,
        })

    }


    return (
        <>
            <div className="container my-3">
                <h2>Login for enjoying the iNotebook App...</h2>
                <form className='my-3' onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label" >Email</label>
                        <input type="email" className="form-control" id="email" name="email" value={credential.email} onChange={handleChange} required />
                        <div id='emailhelp' className='form-text'>We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" name="password" value={credential.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">login</button>
                </form>
            </div>
        </>
    )
}

export default Login    