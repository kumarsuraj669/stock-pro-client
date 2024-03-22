import React, { useState } from 'react'
import { useData } from '../context/DataContext'

const Settings = () => {

  const {user, updateUser} = useData()

  const [updated, setupdated] = useState({})

  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e)=>{
    setupdated({...updated, [e.target.name]: e.target.value})
  }

  const [isUpdated, setUpdated] = useState(false)

  const showUpdateAlert = () =>{
    setUpdated(true)
    setTimeout(()=>{
      setUpdated(false)
    }, 5000)
  }

  // Method to handle the submit button after filling new details
  const handleUpdateClick = async(e)=>{
    e.preventDefault()

    if(!updated.businessName && !updated.address && !updated.newPassword){
      return;
    }

    if(updated.newPassword !== updated.confirmPassword){
      setErrorMessage('Passwords do not match')
      return;
    }

    if(updated.newPassword && updated.newPassword.length < 6){
      setErrorMessage('Password should be at least 6 characters')
      return;
    }

    // change cursor to wait until response loads
    document.body.style.cursor = 'wait';

    let response = await updateUser(updated);

    // change cursor back to default after response loads
    document.body.style.cursor = 'default';

    if(response.success){
      setupdated({})
      setErrorMessage('')
      showUpdateAlert();
    } else if(response.noMatch){
      setupdated({})
      setErrorMessage("Incorrect Password")
    }
    
  }

  return (
    <div className='px-3 py-3  top-container'>
      
      <div className='d-flex align-items-center'>
        <h1>Settings</h1>
        {isUpdated && <p className='text-success fs-5 fw-bold ms-3 my-0'>UPDATED</p>}
      </div>
      
      {/* Separate container for User profile change */}
      <p className='fs-3 '>User Profile</p>
      <div className=' bg-light p-3 rounded-2 mx-4 settings-form-container'>
        <form onSubmit={handleUpdateClick}>
          <div className='mb-2'>
            <label className="form-label" htmlFor="businessName">Business Name</label>
            <input className='form-control' type="text" id='businessName' name='businessName' value={updated.businessName || ''} onChange={handleChange} placeholder={user.BUSINESS_NAME} />
          </div>
          <div className='mb-3'>
            <label className="form-label" htmlFor="address">Address</label>
            <input className='form-control' type="text" id='address' name='address' value={updated.address || ''} onChange={handleChange} placeholder={user.ADDRESS}/>
          </div>
          <div className='mb-3'>
            <label className="form-label" htmlFor="email">Email</label>
            <input className='form-control' type="email" id='email' name='email' disabled placeholder={user.EMAIL}/>
          </div>
          <button type='submit' className='btn btn-dark'>Update Profile</button>
        </form>
      </div>
          
      {/* Separate container for User password change */}
      <p className='fs-3 mt-3'>Password</p>
      <div className=' bg-light p-3 rounded-2 mx-4 settings-form-container'>
        <form onSubmit={handleUpdateClick}>
          <div className='mb-2'>
            <label className="form-label" htmlFor="oldPassword">Old Password</label>
            <input className='form-control' type="password" id='oldPassword' name='oldPassword' value={updated.oldPassword || ''} onChange={handleChange} required />
          </div>
          <div className='mb-3'>
            <label className="form-label" htmlFor="newPassword">New Password</label>
            <input className='form-control' type="password" id='newPassword' name='newPassword' value={updated.newPassword || ''} onChange={handleChange} required />
          </div>
          <div className='mb-3'>
            <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
            <input className='form-control' type="password" id='confirmPassword' name='confirmPassword' value={updated.confirmPassword || ''} onChange={handleChange} required />
          </div>
          {errorMessage && <p className='text-danger'>{errorMessage}</p>}

          <button type='submit' className='btn btn-dark'>Change Password</button>
        </form>
      </div>

    </div>
  )
}

export default Settings
