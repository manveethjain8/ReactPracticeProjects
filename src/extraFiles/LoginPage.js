import React from 'react'
import '../extraCSS/LoginPage.css'
import loginPageImage from '../images/loginPageImage.webp'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginPage = ({users,email, setEmail, password, setPassword}) => {
  const navigate = useNavigate();
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const handleLogin = (e) => {
    e.preventDefault();
    const userFound = users.find(user => user.email === email);
    
    if (userFound) {
      if (userFound.password === password) {
        alert('Login Successful');
        setEmail('');
        setPassword('');
        setIsValidEmail(true);
        setIsValidPassword(true);
        navigate('/items');
      } else {
        setIsValidPassword(false);
      }
    } else {
      setIsValidEmail(false);
    }
  };
  return (
    <div className='container'>
          <div className="loginPageBox">
            <div className='imageBox'>
              <img className='image' src={loginPageImage} alt="No image"/>
            </div>
            <div className='inputBox'>
              <p className='welcomeBackText'>Welcome Back</p>
              <p className='enterTheDetailsText'>Please enter your credentials to login</p>
              <p className='emailText'>Email</p>
              <form onSubmit={handleLogin}>
              <input type='email' placeholder='Enter your email' className={`emailInput ${!isValidEmail?"invalidEmail":""}`} value={email} onChange={(e)=>{setEmail(e.target.value);
                if(!isValidEmail){
                  setIsValidEmail(true);
                }
              }} required/>
              <p className='passwordText'>Password</p>
              <input type='password' placeholder='Enter your password' className={`passwordInput ${!isValidPassword?"invalidPassword":""}`} value={password} onChange={(e)=>{setPassword(e.target.value);
                if(!isValidPassword){
                  setIsValidPassword(true);
                }
              }}required />
              <p className='forgotPasswordText'><u>Forgot Password?</u></p>
              <button className='loginButton' type='submit'>Sign in</button>
              <Link to='/signup'><p className='registerText'><u>Don't have an account?</u></p></Link>
              </form>
            </div>
        </div>
    </div>
  )
}

export default LoginPage
