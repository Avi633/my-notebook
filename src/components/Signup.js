import React, { useState } from 'react'
import { useNavigate } from 'react-router';

function Signup(props) {
    const [credentials, setCredentials] = useState({
        email: '', password:'', name:'', cpassword:''
    })

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
        const response = await fetch('http://localhost:5000/api/auth/createuser', {
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name:credentials.name, email: credentials.email, password: credentials.password})
        });
        const result = await response.json();
        if(result.success){
        localStorage.setItem('token', result.authtoken);
        navigate("/");
        props.showAlert("Account created successfully!", "success")
        } else {
            props.showAlert("Invalid details", "danger")
        }

    } catch (error){
        console.error("Error:", error);
    }
    }

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }
  return (
    <>
        <div className="container my-3">
                <h2>Signup now and enjoy...</h2>
                <form className='my-3' onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" id="name" name="name" onChange={handleChange} value={credentials.name} required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" name="email" onChange={handleChange} value={credentials.email} required/>
                        <div id='emailhelp' className='form-text'>We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" name="password" onChange={handleChange} minLength={5} value={credentials.password} required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                        <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={handleChange} minLength={5} value={credentials.cpassword} required/>
                    </div>
                    <button type="submit" className="btn btn-primary">Signup</button>
                </form>
            </div>
    </>
  )
}

export default Signup