import { createContext, useState, useEffect } from "react";
//import api from '../api/dataAxios';
import useAxiosFetch from '../hooks/useAxiosFetch';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {

    const [users, setUsers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 //const [fetchError, setFetchError] = useState(null);
  const [totalNumberOfItems, setTotalNumberOfItems] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const storedUser = sessionStorage.getItem('loggedInUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });
const { data: userData } = useAxiosFetch('http://localhost:3500/users');
const { data: menuItemsData } = useAxiosFetch('http://localhost:3500/menu');
const { data: ordersData } = useAxiosFetch('http://localhost:3500/orders');
const { data: cartData } = useAxiosFetch('http://localhost:3500/cart');

useEffect(() => {
    setUsers(userData);
}, [userData]);

useEffect(() => {
    setMenuItems(menuItemsData);
}, [menuItemsData]);

useEffect(() => {
    setOrders(ordersData);
}, [ordersData, setOrders]);

useEffect(() => {
    setCart(cartData);
    const totalNumber = cartData.reduce((total, item) => total + item.quantity, 0);
    setTotalNumberOfItems(totalNumber);
}, [cartData]);

  

  // useEffect(() =>{
  //   const fetchUsers = async()=>{
  //     try{
  //       const response = await api.get('/users');
  //       setUsers(response.data);
  //       setFetchError(null);
  //     }catch(err){
  //       console.error(err.message);
  //     }
  //   }

  //   const fetchMenu=async ()=>{
  //     try{
  //       const response = await api.get('/menu');
  //       setMenuItems(response.data);
  //       setFetchError(null);
  //     }catch(err){
  //       console.error(err.message);
  //     }
  //   }


  //   fetchUsers();
  //   fetchMenu();
  // },[])

  // const fetchCart=async (userId)=>{
  //   try{
  //     const response = await api.get(`/cart?userId=${userId}`);
  //     const totalNumber = response.data.reduce((total, item) => total + item.quantity, 0);
  //     setTotalNumberOfItems(totalNumber);
  //     setCart(response.data);
  //   }catch(err){
  //     console.error(err.message);
  //   }
  // }

  // const fetchOrders = async (userId) => {
  //   try {
  //       const response = await api.get(`/orders?userId=${userId}`);
  //       setOrders(response.data);
  //   } catch (err) {
  //       console.error(err.message);
  //   }
  // };

  // useEffect(()=>{
  //   if(loggedInUser){
  //     fetchCart(loggedInUser.id);
  //     sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
  //   }
  // },[loggedInUser]);

  // useEffect(()=>{
  //   if(loggedInUser){
  //     fetchOrders(loggedInUser.id)
  //   }
  // },[,orders,setOrders])

    return (
        <DataContext.Provider value={{
            users, setUsers,
            menuItems, setMenuItems,
            orders, setOrders,
            cart, setCart,
            email, setEmail,
            password, setPassword,
            loggedInUser, setLoggedInUser,
            totalNumberOfItems, setTotalNumberOfItems,
            //fetchError, setFetchError,
            // fetchCart,
            // fetchOrders,
        }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;
