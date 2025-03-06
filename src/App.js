import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from './extraFiles/SignupPage';
import LoginPage from './extraFiles/LoginPage';
import ItemsPage from './extraFiles/ItemsPage';
import CartPage from './extraFiles/CartPage';


function App() {
  const API_URL='http://localhost:3500/users';
  const API_menuURL='http://localhost:3500/menu';
  const API_cartURL='http://localhost:3500/cart';
  const [users, setUsers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const [totalNumberOfItems, setTotalNumberOfItems] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const storedUser = sessionStorage.getItem('loggedInUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() =>{
    const fetchUsers = async()=>{
      try{
        const response = await fetch(API_URL);
        if(!response.ok){
          throw new Error('Failed to fetch users');
        }
        const usersData=await response.json();
        setUsers(usersData);
        setFetchError(null);
      }catch(err){
        console.error(err.message);
      }
    }

    const fetchMenu=async ()=>{
      try{
        const response = await fetch(API_menuURL);
        if(!response.ok){
          throw new Error('Failed to fetch menu');
        }
        const menuData=await response.json();
        setMenuItems(menuData);
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
      const response =await fetch(`${API_cartURL}?userId=${userId}`);
      if(!response.ok){
        throw new Error('Failed to fetch cart');
      }
      const cartData=await response.json();
      const totalNumber = cartData.reduce((total, item) => total + item.quantity, 0);
      setTotalNumberOfItems(totalNumber);
      setCart(cartData);
    }catch(err){
      console.error(err.message);
    }
  }

  useEffect(()=>{
    if(loggedInUser){
      fetchCart(loggedInUser.id);
      sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    }
  },[loggedInUser,API_cartURL, API_menuURL]);
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
              fetchError={fetchError}
              setFetchError={setFetchError}
              API_URL={API_URL}
            />
          } 
        />
        <Route path="/" element={<ItemsPage 
          menuItems={menuItems}
          setMenuItems={setMenuItems}
          cart={cart}
          setCart={setCart}
          fetchError={fetchError}
          setFetchError={setFetchError}
          API_cartURL={API_cartURL}
          totalNumberOfItems={totalNumberOfItems}
          setTotalNumberOfItems={setTotalNumberOfItems}
          loggedInUser={loggedInUser}
        />} />

        <Route path='/cart' element={<CartPage
          cart={cart}
          setCart={setCart}
          totalNumberOfItems={totalNumberOfItems}
          setTotalNumberOfItems={setTotalNumberOfItems} 
          fetchError={fetchError}
          setFetchError={setFetchError}
          loggedInUser={loggedInUser}
          API_cartURL={API_cartURL}
        />}/>
      </Routes>
    </main>
  );
}

export default App;
