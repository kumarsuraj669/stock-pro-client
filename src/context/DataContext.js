import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { HOST as host} from '../env.local';
// const host = process.env.REACT_APP_HOST;

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { token, setToken } = useAuth();
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState({});
  const [user, setUser] = useState({});
  const [statement, setStatement] = useState({});

  const fetchData = async (url, setData) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
      });
      const data = await response.json();
      if (data.success) {
        setData(data.data);
      } else {
        if (data.tokenError) {
          // Token is expired, re-login the user
          localStorage.removeItem('token');
          setToken('');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } 
  };

  const getItems = ()=>{
    fetchData(`${host}/api/items/getItems`, setItems);
  }

  const getHistory = async()=>{
    await fetchData(`${host}/api/history`, setHistory);
  }

  const getUser = ()=>{
    fetchData(`${host}/api/users`, setUser);
  }

  const updateUser = async (data)=>{
    const {businessName, address, oldPassword, newPassword} = data;
    const url = `${host}/api/users/`
    let itemData = {}
    if(businessName){ itemData.business_name = businessName}
    if(address) {itemData.address = address}
    if(oldPassword) {itemData.old_password = oldPassword }
    if(newPassword) {itemData.new_password = newPassword}

    try{
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify(itemData)
      });
      const resData = await response.json();
      if(resData.success) {
        getUser();
        return {success: true}
      } else {
        if(resData.noMatch){
          return {success:false, noMatch: true}
        } else {
          return {success:false, noMatch: false}
        }
      }
    } catch(e){
      return {success: false, error: e}
    }
  }

  const getStatement = async(startDate, endDate)=>{
    const url = `${host}/api/statement`
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({startDate, endDate})
      });
      const data = await response.json();
      if (data.success) {
        setStatement(data.data);
      } else {
        if (data.tokenError) {
          // Token is expired, re-login the user
          localStorage.removeItem('token');
          setToken('');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } 
  }

  const addItem = async(data)=>{
    const url = `${host}/api/items/addItem`
    let purchase = (parseFloat(data.buyingPrice)*parseFloat(data.quantity)).toFixed(2);
    let itemData = {
      "model_no": data.modelNo,
      "buying_price": parseFloat(data.buyingPrice),
      "selling_price": (parseFloat(data.buyingPrice) + (parseFloat(data.margin*data.buyingPrice)/100)).toFixed(2),
      "quantity": parseFloat(data.quantity),
      "model_name": data.modelName,
      "category": data.category
    }
    try{
      const response  = await fetch(url, {
        method: 'POST',
        headers: {
          'auth-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
      })

      const resData = await response.json()

      if (resData.success){
        getItems()
        let message = `${data.quantity} units of ${data.modelName}(${data.modelNo}) added to the inventory`
        addHistory(message, 0 , purchase)
        return ({'success':true})
    } else {
        return ({'success': false})
    }
    } catch(e){
      return ({'success':false, 'error':e});
    }
  }

  const sellItem = async(data)=>{
    const url = `${host}/api/items/sellItem`
    let sale = (parseFloat(data.sellingPrice)*parseFloat(data.quantity)).toFixed(2);
    let itemData = {
      "model_no": data.modelNo,
      "selling_price": parseFloat(data.sellingPrice),
      "quantity": parseFloat(data.quantity)
    }
    try{
      const response  = await fetch(url, {
        method: 'PUT',
        headers: {
          'auth-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
      })

      const resData = await response.json()

      if (resData.success){
        getItems()
        let message = `${data.quantity} units of ${data.modelName}(${data.modelNo}) sold from the inventory`
        addHistory(message, sale, 0)
        return ({'success':true})
      } else {
          return ({'success': false})
      }
    } catch(e){
      return ({'success':false, 'error':e});
    }
  }

  const addHistory = async(message, sale, purchase)=>{
    const url = `${host}/api/history`
    try{
      const response  = await fetch(url, {
        method: 'PUT',
        headers: {
          'auth-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({msg: message, sale, purchase})
      })

      const data = await response.json()

      if (data.success){
        getHistory()
        return ({'success':true})
    } else {
        return ({'success': false})
    }
    } catch(e){
      return ({'success':false, 'error':e});
    }
  }


  useEffect(() => {
    if (token) {
      getItems();
      getHistory();
      getUser();
    }
  }, [token]);

  return (
    <DataContext.Provider value={{ user, updateUser, items, addItem, sellItem, history, statement, getStatement }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);