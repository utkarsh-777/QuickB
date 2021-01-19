import React, { useState } from "react"
import {toast,ToastContainer} from "react-toastify"
import {useHistory} from "react-router-dom"

const Login = () => {
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const history = useHistory()

    const handleSubmit = () => {
        fetch("http://localhost:5000/api/login",{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                username,
                password
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                return toast(data.error,{type:'error'})
            }
            if(data.success){
                localStorage.setItem('token',data.token)
                history.push('/')
            } 
        })
    }

    return(
        <div>
            <ToastContainer />
            <div className='container bg-light mt-2 p-2' style={{borderRadius:'20px'}}>
                <h1 className='text-center'>QuickB Login</h1>
                <div className='container mt-4 mb-4'>
                <label for='username'>Username</label>
                <input name='username' type='text' className='form-control mb-2' placeholder='Enter your Username'
                required
                onChange={e=>setUsername(e.target.value)}
                />
                <label for='password'>Password</label>
                <input name='password' type='password' className='form-control mb-2' placeholder='Enter Your Password'
                required
                onChange={e=>setPassword(e.target.value)}
                />
                <button className='btn btn-block btn-warning mt-4 mb-4' onClick={()=>handleSubmit()}>Login</button>
                <p className='text-center mb-4'><a href='/login'>Login</a> or <a href='/signup'>Signup</a></p>
                </div>
            </div>
        </div>
    )
}

export default Login;