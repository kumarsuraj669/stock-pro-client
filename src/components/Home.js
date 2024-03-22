import React, {useState, useEffect, useRef} from 'react'
import { useData } from '../context/DataContext'

const Home = () => {

  const {items, sellItem} = useData()
  const [selectedItemIndex, setSelectedItemIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilteredItems, setCategoryFilteredItems] = useState(items);
  const [searchFilteredItems, setSearchFilteredItems] = useState(items);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Select Category')

  const [errorMessage, setErrorMessage] = useState('')

  const [priceHistory, setPriceHistory] = useState([])

  const [itemData, setItemData] = useState({
    modelNo: '',
    quantity: '',
    sellingPrice: ''
  })

  useEffect(() => {
    // Extract unique categories from items
    const uniqueCategories = Array.from(new Set(items.map((item) => item.CATEGORY)));
    setCategories(uniqueCategories);

    // Initialize filteredItems with items
    setCategoryFilteredItems(items);
  }, [items]);

  const handleCategoryClick = (category) => {
    // Filter items based on the selected category
    const filteredItems = items.filter((item) => item.CATEGORY === category);
    setCategoryFilteredItems(filteredItems);
    setSelectedCategory(category)
    setSearchFilteredItems(filteredItems)
  };

  const handleItemClick = (item, index)=>{
    // Expand or collapse the selected item
    if(index === selectedItemIndex){
      setSelectedItemIndex(null);
      setItemData({
        modelNo: '',
        quantity: '',
        sellingPrice: ''
      })
    } else {
      setSelectedItemIndex(index);
      setItemData({
        modelNo: item.MODEL_NO,
      })
    }
    setPriceHistory([])
  }

  // Method to handle the input change in item form
  const handleChange = (e)=>{
    setItemData({...itemData, [e.target.name]: e.target.value});
  }

  // Method to handle the item sell
  const handleSellItem = async(e)=>{
    e.preventDefault()

    const selectedItem = items[selectedItemIndex];

    // Validate if the quantity to be removed exceeds the available quantity
    if (parseInt(itemData.quantity) > parseInt(selectedItem.QUANTITY)) {
      setErrorMessage('Quantity to remove exceeds available quantity!');
      return;
    } else {
      setErrorMessage('');
    }

    // change cursor to wait until response loads
    document.body.style.cursor = 'wait';

    const response = await sellItem(itemData);

    // change cursor back to default after response loads
    document.body.style.cursor = 'default';
  }

  // Method to set the Price History based on clicked item
  const viewPriceHistory = (item)=>{
    setPriceHistory(priceHistory.length !== 0 ? [] : item.TRANSACTION_HISTORY)
  }

  useEffect(() => {
    if (searchQuery === '') {
      // Sort filteredItems alphabetically by MODEL_NAME
      categoryFilteredItems.sort((a, b) => a.MODEL_NAME.localeCompare(b.MODEL_NAME));
      setSearchFilteredItems(categoryFilteredItems);
    } else {
      const filteredItems = categoryFilteredItems.filter((item) =>
        item.MODEL_NAME.toLowerCase().includes(searchQuery.toLowerCase())
      );
      // Sort filteredItems alphabetically by MODEL_NAME
      filteredItems.sort((a, b) => a.MODEL_NAME.localeCompare(b.MODEL_NAME));
      setSearchFilteredItems(filteredItems);
    }

  }, [searchQuery, categoryFilteredItems]);

  return (
    <div className='pt-3 px-3 top-container  '>
      <div className='d-flex justify-content-between'>
        <h2 className=''>Your Items ({searchFilteredItems.length})</h2>
        {/* filter by category */}
        <div className="dropdown">
          <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            {selectedCategory}
          </button>
          <ul className="dropdown-menu">
          <button onClick={() => {setCategoryFilteredItems(items); setSearchFilteredItems(items); setSelectedCategory('Select Category')}} className="dropdown-item">Select Category</button>
            {categories.map((category, index) => (
                <button key={index} onClick={() => handleCategoryClick(category)} className="dropdown-item">{category}</button>
              ))}
          </ul>
        </div>
      </div>

      {/* Search-bar */}
      <div className='d-flex mx-2 align-items-center my-4'>
        <p className='me-2 fw-bold fs-5 mb-0'>Search Item: </p>
        <input className='border border-1 border-secondary flex-fill p-2 ' style={{ borderRadius: "15px" }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />       
      </div>

      {/* Inventory items container */}
      <div>
        {/* Items */}
        {searchFilteredItems.map((item, index) => (
                <div className={`border-bottom border-1 border-dark  d-flex flex-column inventory-item items-container px-3 ${index === selectedItemIndex ? 'expanded' : ''}`} key={index}>
                  <div className='item-info-container d-flex py-3'  onClick={()=>{handleItemClick(item, index)}} key={index}>
                    <div className=' fs-5' style={{flex: 8}}>
                      {item.MODEL_NAME} ({item.MODEL_NO})
                    </div>
                    <div className='text-end ' style={{flex: 2}}>
                      {item.QUANTITY} units
                    </div>
                    <div className='text-end ' style={{flex: 2}}>
                      &#x20B9;{item.SELLING_PRICE}
                    </div>
                  </div>
                  

                  {/* Sell button and item details */}
                  {index === selectedItemIndex && (
                    <div>
                      <div className=' d-flex align-items-start flex-column' style={{padding: '10px 20px'}}>
                        <div className='fs-5 text-primary'>
                          Model no: {item.MODEL_NO}
                        </div>
                        <div className='fs-5 text-primary'>
                          Model name: {item.MODEL_NAME}
                        </div>
                        <div className='fs-5 text-primary'>
                          Price: &#x20B9;{item.SELLING_PRICE}
                        </div>
                        <div className='fs-5 text-primary'>
                          Units left: {item.QUANTITY}
                        </div>
                    </div>

                    {/* Error message based on different error events */}
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}

                    <div className={`d-flex item-footer justify-content-start my-2`}>
                      
                      <form onSubmit={handleSellItem} className='d-flex item-form-section '>
                        <div className='form-element'>
                          <label htmlFor="quantity" className='me-2'>Quantity: </label>
                          <input style={{width: "80px"}} type="number" id="quantity" name="quantity" value={itemData.quantity} onChange={handleChange} required/>
                        </div>
                        <div className='form-element'>
                          <label htmlFor="sellingPrice" className='me-2'>Sold at: (&#8377;) </label>
                          <input style={{width: "80px"}} type="number" id="sellingPrice" name="sellingPrice" value={itemData.sellingPrice} onChange={handleChange} required/>
                        </div>
                        <button type="submit" className='btn btn-danger form-element' > Sell</button>
                      </form>

                      <button className='btn btn-secondary' onClick={()=>{viewPriceHistory(item)}}> Price History</button>
                    </div>

                    {priceHistory.map((element, index) => 
                      <div key={index}>
                        <p className='text-secondary fst-italic '>{element.MESSAGE} on {new Date(element.DATE).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                  )}

                </div>
            ))}
      </div>
    </div>
  )
}

export default Home
