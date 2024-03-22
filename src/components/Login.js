import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {useAuth} from '../context/AuthContext'

const host = process.env.REACT_APP_HOST;

const Login = () => {
    
    const [credentials, setCredentials]  = useState({email: "", password:""})
    const navigate = useNavigate()

    const [errorMessage, setErrorMessage] = useState('')

    const context = useAuth();

    const {token, setToken} = context;

    useEffect(() => {
      // If token exists, redirect to homepage
      if (token) {
        navigate('/');
      }
    }, [token, navigate]);

    const onChange = (event)=>{
        setCredentials({...credentials , [event.target.name]: event.target.value })
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();

        // Change the cursor to wait until it loads the response from server
        document.body.style.cursor = "wait";

        try {
            const url = `${host}/api/auth/login`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            // After fetching response change the cursor back to normal mode
            document.body.style.cursor = "default";

            if (data.serverStatus){
                if(data.success){
                    // Save the authentication token in local storage and redirect to '/'
                    localStorage.setItem('token', data.authtoken);
                    setToken(data.authtoken)
                    navigate('/')
                } else {
                    setErrorMessage('Invalid Credentials')
                    setCredentials({email:"", password:""})
                } 
            } else {
              setErrorMessage('Internal Server Error')
            }

        } catch (error) {
            // After fetching response change the cursor back to normal mode
            document.body.style.cursor = "default";

            setErrorMessage('Internal Server Error')
        } 

    }
    
  return (
    // Login Form
    <div className='container my-5 '>
        <h3 className='my-4'>Please login using your credentials</h3>
        {errorMessage && (<div className='text-danger fs-5 my-3'>{errorMessage}</div>)}
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" name="email" id="email" value={credentials.email} aria-describedby="emailHelp" onChange={onChange} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" name="password" value={credentials.password} id="password" onChange={onChange} required/>
            </div>
            <button type="submit" className="btn btn-primary me-2 mt-2">Login</button>
            <Link to="/signup" className="btn btn-outline-primary mt-2">Not a user? Signup now</Link>
        </form>
    </div>
  )
}

export default Login
