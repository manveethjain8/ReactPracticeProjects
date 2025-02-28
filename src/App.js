import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from './extraFiles/SignupPage';
import LoginPage from './extraFiles/LoginPage';
import ItemsPage from './extraFiles/ItemsPage';


function App() {
  const API_URL='http://localhost:3500/users';
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fetchError, setFetchError] = useState(null);

  useEffect(() =>{
    const fetchUsers = async()=>{
      try{
        const response = await fetch(API_URL);
        if(!response.ok){
          throw new Error('Faild to fetch users');
        }
        const usersData=await response.json();
        setUsers(usersData);
        setFetchError(null);
      }catch(err){
        console.error(err.message);
      }
    }
    fetchUsers();
  })
  return (
    <main>
      <Routes>
        <Route 
          path="/" 
          element={
            <LoginPage
              users={users}
              setUsers={setUsers}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
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
        <Route path="/items" element={<ItemsPage/>} />
      </Routes>
    </main>
  );
}

export default App;
