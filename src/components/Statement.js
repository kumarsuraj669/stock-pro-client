import React, {useState} from 'react'
import { useData } from '../context/DataContext'

const Statement = () => {

  const {statement, getStatement} = useData()
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleGetStatement = () => {
    if(startDate==='' || endDate===''){
      setErrorMessage("Please select startDate and endDate to view the statement")
      return;
    } else {
      setErrorMessage('')
    }

    document.body.style.cursor = 'wait';
    
    getStatement(startDate, endDate);
    
    document.body.style.cursor = 'default';
  };

  return (
    <div className='px-3 py-3  top-container'>
      <h1>P&L Statement </h1>

      <div className='d-flex '>
        <div className='my-3 me-4'>
          {/* Date Selection form for the statement to be fetched */}
          <label htmlFor='startDate' className='me-2'>Start Date:</label>
          <input type='date' id='startDate' value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className='my-3'>
          <label htmlFor='endDate' className='me-2'>End Date:</label>
          <input type='date' id='endDate' value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      {/* error message to show on various error events */}
      {errorMessage!=='' && <p className='text-danger'>{errorMessage}</p>}

      <button className='btn btn-warning' onClick={handleGetStatement}>Get Statement</button>

      {/* Statement container which shows Total purchase, total sales in the period and net profit or loss */}
      <div>
        {statement && 
          <div className='my-5 bg-light rounded p-4'>
            <div className='d-flex  align-items-center justify-content-between'>
              <p className='p-0 fs-3'>Total purchase: </p>
              <p className='p-0 fs-4 fw-bold '>{statement.totalPurchases}</p>
            </div>
            <div className='d-flex align-items-center justify-content-between'>
              <p className='p-0 fs-3'>Total sales: </p>
              <p className='p-0 fs-4 fw-bold'>{statement.totalSales}</p>
            </div>
            <hr />
            <div className='d-flex align-items-center justify-content-between'>
              <p className='p-0 fs-3'>Net: </p>
              <p className='p-0 fs-4 fw-bold text-primary'>{statement.totalSales - statement.totalPurchases}</p>
            </div>
    
          </div>
          }
      </div>
      
    </div>
  )
}

export default Statement
