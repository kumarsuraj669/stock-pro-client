import React, { useEffect, useState } from 'react'
import { useData } from '../context/DataContext'

const History = () => {

  // history received in the DataContext and is imported here using useData() method of DataContext
  const {history} = useData()
  const [sortedHistory, setSortedHistory] = useState([]);

  useEffect(() => {
    if (history.HISTORY) {
      const sorted = [...history.HISTORY].sort((a, b) => {
        const dateA = new Date(a.DATE);
        const dateB = new Date(b.DATE);
        return dateB-dateA;
      });
      setSortedHistory(sorted);
    }
  }, [history.HISTORY]);

  return (
    <div className='px-3 py-3  '>
      <h1>History</h1>

      <div className='bg-light rounded p-3 mt-3 top-container' >
        {sortedHistory.map((element, index)=> (<>
          <div className='d-flex justify-content-between align-items-center' key={index}> 
            <p className='text-dark fw-light fs-5'>{element.MESSAGE}</p>
            <p className='text-secondary'>{new Date(element.DATE).toLocaleDateString()}</p>
          </div>
          <hr />
          </>
          
        ))}
      </div>
    </div>
  )
}

export default History
