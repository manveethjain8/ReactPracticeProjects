//import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from './extraFiles/SignupPage';
import LoginPage from './extraFiles/LoginPage';
import ItemsPage from './extraFiles/ItemsPage';
import CartPage from './extraFiles/CartPage';
import OrdersPage from './extraFiles/OrdersPage';
//import api from './api/dataAxios';
//import useAxiosFetch from './hooks/useAxiosFetch';
import { DataProvider } from './context/DataContext';


function App() {
  
  return (
    <main>
      <DataProvider>
        <Routes>
          <Route 
            path="/login" 
            element={<LoginPage/>}
          />
          <Route 
            path="/signup" 
            element={<SignupPage />}
          />
          <Route 
            path="/" 
            element={<ItemsPage/>} 
          />

          <Route 
            path='/cart' 
            element={<CartPage/>}
          />

          <Route 
            path='/orders' 
            element={<OrdersPage/>}
          />
        </Routes>
      </DataProvider>
    </main>
  );
}

export default App;
