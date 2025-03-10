import React from 'react'
import '../extraCSS/SignupPage.css'
import loginPageImage from '../images/loginPageImage.webp'
import signupPageBackground from '../images/signupPageBackground.webp'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/dataAxios';

const SignupPage = ({email, setEmail, password, setPassword,users,setUsers,}) => {

  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [pNumber, setPNumber] = useState('');


  const navigate = useNavigate();
  const handleSignup = async (e) => {
      e.preventDefault();
      const newUser = users.find((user) => user.email === email);
      console.log(users);
      if(newUser){
          alert('Email already exists');
          return;
      }else{
          let newId=users.length>0?Number(users[users.length-1].id)+1:1;
          const newUser={id:newId,fName, lName, pNumber, email, password};
          try{
            const response = await api.post('/users', newUser);
            const newUserList = [...users,response.data];
            setUsers(newUserList);
          }catch(err){
            console.error(err.message);
            alert('Failed to register');
            return;
          }
          setEmail('');
          setPassword('');
          setFName('');
          setLName('');
          setPNumber('');
          alert('Registration Successful');
          navigate('/login');
      }
    }
    

    
  return (
    <div className='container'>
          <div className='underlayl'></div>
          <div className='backgroundImage'>
            <img className='background' src={signupPageBackground} alt="No image"/>
          </div>
          <div className="loginPageBox">
            <div className='imageBox'>
              <img className='image' src={loginPageImage} alt="No image"/>
            </div>
            <div className='inputBox'>
              <p className='welcomeBackText'>Start Your Journey With Us</p>
              <p className='enterTheDetailsText'>Please enter the following details</p>
              <form onSubmit={handleSignup}>
                <input type='text' placeholder='First Name' className='firstNameInput' value={fName} onChange={(e)=>setFName(e.target.value)}required/>
                <input type='text' placeholder='Last Name' className='lastNameInput' value={lName} onChange={(e)=>setLName(e.target.value)} required/>
                <input type='number' placeholder='Phone Number' className='phoneInput' value={pNumber} onChange={(e)=>setPNumber(e.target.value)}required/>
                <input type='email' placeholder='Email' className='emailInput1' value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                <input type='password' placeholder='Password' className='passwordInput1' value={password} onChange={(e)=>setPassword(e.target.value)}required />
                <button className='signupButton' type='submit'>Sign Up</button>
                <Link to='/'><p className='haveAccountText'><u>Already have an account?Login</u></p></Link>
              </form>
            </div>
        </div>
    </div>
  )
}

export default SignupPage
