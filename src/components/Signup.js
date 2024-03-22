import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Signup = () => {

    const {token, createUser} = useAuth()
    const navigate = useNavigate()

    const [credentials, setCredentials]  = useState({name:"", email:"", password:"", cpassword:""})
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const [errorMessage, setErrorMessage] = useState('')

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }
    
    useEffect(() => {
        // If token exists, redirect to homepage
        if (token) {
            navigate('/')
        }
      }, [token, navigate]);

    const handleSubmit = async (event)=>{
        event.preventDefault();

        // Change the cursor to wait until it loads the response from server
        document.body.style.cursor = "wait";

        if (credentials.password !== credentials.cpassword) {
            // Passwords do not match, handle the error or prevent form submission
            setPasswordsMatch(false);
            // document.getElementById('password').focus();
            return;
        }
        setPasswordsMatch(true);
        const {businessName, email, address, password}  = credentials;

        // change cursor to wait until response loads
        document.body.style.cursor = 'wait';

        let response = await createUser(businessName, email, address, password);

        // change cursor back to default after response loads
        document.body.style.cursor = 'default';

        if(response.success){
            setErrorMessage('Account created Successfully, You can now login')
            setTimeout(()=>{
                navigate('/login')
            }, 2000)
        } else if (response.exists) {
            setErrorMessage('User with this email already exists')
        } else {
            setErrorMessage('Something went wrong')
        }
        
    }
  return (
    // Signup form
    <div className='container my-5 '>
        <h3 className='my-4'>Create an account</h3>
        {errorMessage && (<div className='fs-4 my-3 text-danger'>{errorMessage}</div>)}
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="businessName" className="form-label">Business Name</label>
                <input type="text" className="form-control" name="businessName" id="businessName" value={credentials.businessName || ''} onChange={onChange} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" name="email" id="email" value={credentials.email || ''} aria-describedby="emailHelp" onChange={onChange}  required/>
            </div>
            <div className="mb-3">
                <label htmlFor="address" className="form-label">Business Address</label>
                <input type="text" className="form-control" name="address" id="addres" value={credentials.address || ''} onChange={onChange}  required/>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" name="password" id="password" value={credentials.password || ''} onChange={onChange} minLength={6} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                <input type="password" className="form-control" name="cpassword" id="cpassword" value={credentials.cpassword || ''} onChange={onChange} minLength={6} required/>
                {!passwordsMatch && (<div className="text-danger">Passwords do not match</div>)}
            </div>
            <button type="submit" className="btn btn-primary me-2 mt-2">Create Account</button>
            <Link to='/login' className="btn btn-outline-primary mt-2">Already a user? Login</Link>
        </form>
    </div>
  )
}

export default Signup
