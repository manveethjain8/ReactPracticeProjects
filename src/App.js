import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from './extraFiles/SignupPage';
import LoginPage from './extraFiles/LoginPage';
import ItemsPage from './extraFiles/ItemsPage';
import CartPage from './extraFiles/CartPage';
import OrdersPage from './extraFiles/OrdersPage';
import api from './api/dataAxios';


function App() {
  const [users, setUsers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const [totalNumberOfItems, setTotalNumberOfItems] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const storedUser = sessionStorage.getItem('loggedInUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() =>{
    const fetchUsers = async()=>{
      try{
        const response = await api.get('/users');
        setUsers(response.data);
        setFetchError(null);
      }catch(err){
        console.error(err.message);
      }
    }

    const fetchMenu=async ()=>{
      try{
        const response = await api.get('/menu');
        setMenuItems(response.data);
        setFetchError(null);
      }catch(err){
        console.error(err.message);
      }
    }


    fetchUsers();
    fetchMenu();
  },[])

  const fetchCart=async (userId)=>{
    try{
      const response = await api.get(`/cart?userId=${userId}`);
      const totalNumber = response.data.reduce((total, item) => total + item.quantity, 0);
      setTotalNumberOfItems(totalNumber);
      setCart(response.data);
    }catch(err){
      console.error(err.message);
    }
  }

  const fetchOrders = async (userId) => {
    try {
        const response = await api.get(`/orders?userId=${userId}`);
        setOrders(response.data);
    } catch (err) {
        console.error(err.message);
    }
  };

  useEffect(()=>{
    if(loggedInUser){
      fetchCart(loggedInUser.id);
      sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    }
  },[loggedInUser]);

  useEffect(()=>{
    if(loggedInUser){
      fetchOrders(loggedInUser.id)
    }
  },[,orders,setOrders])
  return (
    <main>
      <Routes>
        <Route 
          path="/login" 
          element={
            <LoginPage
              users={users}
              setUsers={setUsers}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              setLoggedInUser={setLoggedInUser}
            />
          } 
        />
        <Route 
          path="/signup" 
          element={
            <SignupPage 
              users={users}
              setUsers={setUsers}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />
          } 
        />
        <Route path="/" element={<ItemsPage 
          menuItems={menuItems}
          setMenuItems={setMenuItems}
          cart={cart}
          setCart={setCart}
          totalNumberOfItems={totalNumberOfItems}
          setTotalNumberOfItems={setTotalNumberOfItems}
          loggedInUser={loggedInUser}
        />} />

        <Route path='/cart' element={<CartPage
          cart={cart}
          setCart={setCart}
          totalNumberOfItems={totalNumberOfItems}
          setTotalNumberOfItems={setTotalNumberOfItems} 
          loggedInUser={loggedInUser}
          orders={orders}
          setOrders={setOrders}
        />}/>

        <Route path='/orders' element={<OrdersPage
          orders={orders}
          setOrders={setOrders}
          loggedInUser={loggedInUser}
          isLoading={isLoading}
        />} />
      </Routes>
    </main>
  );
}

export default App;
