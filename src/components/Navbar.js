import React from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'


export default function Navbar() {
    let location = useLocation();

    let navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate("/login")
    }
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">iNotebook</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === '/' ? "active" : ''}`} aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === '/about' ? "active" : ''}`} to="/about">About</Link>
                            </li>

                        </ul>

                        {/* if there is no account we are on login page and signup option show or vice-versa else if there is account then in navbar logout option is shown */}
                        {!localStorage.getItem('token') ? <form className="d-flex" role="search">
                            {window.location.pathname === '/login' ? <Link className="btn btn-outline-primary mx-1" to="/signup" role="button">Signup</Link>
                                : <Link className="btn btn-outline-primary mx-1" to="/login" role="button">login</Link>}
                        </form> : <button onClick={handleLogout} className="btn btn-outline-primary mx-1" role="button">Logout</button>}
                    </div>
                </div>
            </nav>
        </>
    )
}
