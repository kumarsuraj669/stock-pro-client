import React, {useEffect, useRef, useState} from 'react'
import Home from './Home'
import Menu from './Menu'
import Settings from './Settings'
import Statement from './Statement'
import History from './History'
import {Routes as Switch, Route, useNavigate , Navigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

const Main = () => {

  const addModalRef = useRef()
  const sellModalRef = useRef()
  const refAddClose = useRef()
  const refSellClose = useRef()
  const navigate = useNavigate()
  const {token, setToken} = useAuth()
  const {user, addItem, items, sellItem} = useData()

  const [selectedAddItem, setSelectedAddItem] = useState({});
  const [selectedSellItem, setSelectedSellItem] = useState({});
  const [filteredItems, setFilteredItems] = useState([])

  // Error message to udpate errors based on various error events
  const [errorMessage, setErrorMessage] = useState('');

  // Form data which includes item data will be updated as user inputs text
  const [formData, setFormData] = useState({
    modelNo: '',
    modelName: '',
    category: '',
    quantity: '',
    buyingPrice: '',
    margin: '',
    sellingPrice: ''
  });

  // Function to handle the input change in input fields of add and sell modal
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name==="modelName") {
      // Filter items based on the entered model name
      const filteredItems = items.filter(item => item.MODEL_NAME.toLowerCase().startsWith(value.toLowerCase()));
      // If filtered items exist, set the select options list with filtered items
      // Otherwise, continue with the input field
      setFilteredItems(filteredItems.length ? filteredItems : []);
    }

  }

  // Handle the selected item in auto suggestion
  const handleItemSelection = (e)=>{
    setFormData({...formData, [e.target.name]:e.target.value});
    if (e.target.name === "modelNo") {
      // Find the selected item from items array
      const chosenItem = items.find(item => item.MODEL_NO === e.target.value);
      setSelectedSellItem(chosenItem || {});
    }
  }

  // Method to trigger the addModal
  const handleAddModal = ()=>{
    addModalRef.current.click();
    clearModal()
    setFilteredItems([])
  }

  // Method to trigger the sellModal
  const handleSellModal = ()=>{
    sellModalRef.current.click();
    clearModal()
    setFilteredItems([])
  }

  // Method to cleart the form data fields
  const clearModal = ()=>{
    setFormData({
      modelNo: '',
      modelName: '',
      category: '',
      quantity: '',
      buyingPrice: '',
      margin: '',
      sellingPrice: ''
    })

    setFilteredItems([])
  }

  // Method to handle the item selection change in sell Modal
  const handleSelectChange = (event) => {
    const selectedModelNo = event.target.value;
    const itemSelected = items.find(item => item.MODEL_NO === selectedModelNo);
  
    // Update the input fields with selected item's model name and model number
    setFormData({
      ...formData,
      modelName: itemSelected.MODEL_NAME,
      modelNo: itemSelected.MODEL_NO,
      category: itemSelected.CATEGORY
    });
  
    // Clear the filtered items and hide the select tag
    setFilteredItems([]);
  };

  // Credit the item to the inventory
  const saveItem = async(e)=>{
    e.preventDefault()
    clearModal()
    refAddClose.current.click()
    setFilteredItems([])

    // change cursor to wait until response loads
    document.body.style.cursor = 'wait';

    const response = await addItem(formData);

    // change cursor back to default after response loads
    document.body.style.cursor = 'default';

  }

  // Debit the item from the inventory
  const removeItem = async (e)=>{
    e.preventDefault()

    // Validate if the quantity to be removed exceeds the available quantity
    if (parseInt(formData.quantity) > parseInt(selectedSellItem.QUANTITY)) {
      setErrorMessage('Quantity to remove exceeds available quantity!');
      return;
    } else {
      setErrorMessage('');
    }

    clearModal()
    refSellClose.current.click()
    setFilteredItems([])

    // change cursor to wait until response loads
    document.body.style.cursor = 'wait';

    const response = await sellItem(formData);

    // change cursor back to default after response loads
    document.body.style.cursor = 'default';

  }

  // Removes the authentication-token from the localstorage and logout the user
  const handleLogout = ()=>{
    localStorage.removeItem('token')
    setToken('')
  }

  useEffect(()=>{
    if(!token){
      navigate('/login');
    } 
  },[token, navigate])

  return (
    <>
    <div className=''>
      {/* Business name */}
      <div className='bg-dark px-3 py-2  w-100 d-flex' style={{zIndex: 1, height: "65px"}}>
        <h2 className=''style={{color: '#D24545'}}>{user.BUSINESS_NAME}</h2>
        <button className='btn btn-light ms-auto' onClick={handleLogout}>Logout</button>
      </div>
      
      {/* Page-content including menu bar and content section */}
      <div className='d-flex ' >
        <div className=''>
          <Menu  handleAddModal={handleAddModal} handleSellModal={handleSellModal} />
        </div>
        
        <div className='content-container ps-2 overflow-auto ' style={{flex: "1", height: "calc(100vh)"}} >
            <Switch>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/history" element={<History />} />
                <Route exact path="/statement" element={<Statement/>} />
                <Route exact path="/settings" element={<Settings/>} />

                {/* If user tries to access route other than mentioned above he will be natigated to '/' */}
                <Route path="*" element={<Navigate to="/" />}/>
            </Switch>
        </div>
        
      </div>
    </div>
    
{/* Modal for Adding item to the inventory*/}
<button ref={addModalRef} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#addModal">
  Launch Add modal
</button>

<div className="fade modal" id="addModal" tabIndex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered ">
    <div className="modal-content">
      
      <div className="modal-body my-3 ">
        <form onSubmit={saveItem}>

          {/* Input field for modal name */}
          <div className="form-group my-3 " style={{position:'relative'}}>
              <label htmlFor="modelName"><b>Model name</b></label>
              <input type="text" className="form-control" name="modelName" id="modelName" value={formData.modelName} onChange={handleInputChange} required/>

              {/* Select tag for suggestions */}
              {filteredItems.length > 0 && formData.modelName && (
                <select className="form-control" style={{position:'absolute', width: '100%'}} size={5} name="modelNo" value={selectedAddItem.MODEL_NO} onChange={handleSelectChange} onBlur={() => setFilteredItems([])}>
                  {filteredItems.map((item, index) => (
                    <option key={index} value={item.MODEL_NO}>{item.MODEL_NAME}</option>
                  ))}
                </select>
              )}

          </div>

          {/* Input field for modal no. */}
          <div className="form-group my-3 ">
              <label htmlFor="modelNo"><b>Model no.</b></label>
              <input type="text" className="form-control" name="modelNo" id="modelNo" value={formData.modelNo} onChange={handleInputChange} required/>
          </div>

          {/* Input field for category of item*/}
          <div className="form-group my-3 ">
              <label htmlFor="category"><b>Category</b></label>
              <input type="text" className="form-control" name="category" id="category" value={formData.category} onChange={handleInputChange} required/>
          </div>

          {/* Input field for quantity of item to be added into inventory*/}
          <div className="form-group my-3 ">
              <label htmlFor="quantity"><b>Quantity</b></label>
              <input type="number" className="form-control" name="quantity" id="quantity" value={formData.quantity} onChange={handleInputChange} required/>
          </div>

          {/* Buying price of that item */}
          <div className="form-group my-3 ">
              <label htmlFor="buyingPrice"><b>Buying Price (&#8377;)</b></label>
              <input type="number" className="form-control" name="buyingPrice" id="buyingPrice" value={formData.buyingPrice} onChange={handleInputChange} required/>
          </div>

          {/* Margin on the item */}
          <div className="form-group my-3 ">
              <label htmlFor="margin"><b>Margin (%)</b></label>
              <input type="number" className="form-control" name="margin" id="margin" value={formData.margin} onChange={handleInputChange} required/>
          </div>

          {/* Cancel and Done buttons to close and save the item respectively */}
          <div className='text-end '>
            <button ref={refAddClose} onClick={clearModal} type="button" className="me-2 btn btn-secondary delModalClose" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" className="btn btn-success">Done</button>
          </div>

        </form>
      </div>
    </div>
  </div>
</div>


{/* Modal for Selling and removing item from the inventory*/}
<button ref={sellModalRef} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#sellModal">
  Launch Add modal
</button>

<div className="fade modal" id="sellModal" tabIndex="-1" aria-labelledby="sellModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered ">
    <div className="modal-content">
      
      <div className="modal-body my-3 ">
        <form onSubmit={removeItem}>
          {/* Input field for modal no. -- Only available items can be removed from the inventory */}
          <div className="form-group my-3 ">
            <label htmlFor="modelNo"><b>Select Item</b></label>
            <select className="form-control" name="modelNo" id="modelNo" value={selectedSellItem.MODAL_NO} onChange={handleItemSelection} required>
              <option value="">Select a model</option>
              {items.map((item, index) => (
                <option key={index} value={item.MODEL_NO}>{item.MODEL_NAME} ({item.MODEL_NO})</option>
              ))}
            </select>
          </div>

          {/* Show item details after selecting item from modal no. list */}
          {(selectedSellItem.MODEL_NO) && (<div className='mx-3' >
            <p className='text-secondary'>Units Left: {selectedSellItem.QUANTITY}</p>
            <p className='text-secondary'>Selling Price: {selectedSellItem.SELLING_PRICE}</p>
          </div>)}

          {/* Input field for quantity of items sold */}
          <div className="form-group my-3 ">
              <label htmlFor="quantity"><b>Quantity</b></label>
              <input type="number" className="form-control" name="quantity" id="quantity" value={formData.quantity} onChange={handleInputChange} required/>
              {errorMessage && <p className="text-danger">{errorMessage}</p>}
          </div>

          {/* Input field for selling price of item */}
          <div className="form-group my-3 ">
              <label htmlFor="sellingPrice"><b>Sold at (&#8377;)</b></label>
              <input type="number" className="form-control" name="sellingPrice" id="sellingPrice" value={formData.sellingPrice} onChange={handleInputChange} required/>
          </div>

          {/* Cancel and Done buttons to close and update the item details respectively */}
          <div className='text-end '>
            <button ref={refSellClose} onClick={clearModal} type="button" className="me-2 btn btn-secondary delModalClose" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" className="btn btn-success">Done</button>
          </div>

        </form>
      </div>
    </div>
  </div>
</div>
    </>
  )
      
}
export default Main
