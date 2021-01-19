import React,{useEffect, useState} from "react"
import { toast,ToastContainer } from "react-toastify"
import Navbar from "./navbar"

const Home = () => {

    const [user,setUser] = useState('')
    const [product,setProduct] = useState('')

    useEffect(() => {
        if(localStorage.getItem('token')){
            toast('Login Successful!',{type:'success'})
        }
    },[])

    useEffect(() => {
        fetch("http://localhost:5000/api/user",{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                Authorization:localStorage.getItem('token')
            }
        }).then(res=>res.json())
        .then(data=>{
            setUser(data)
        })

        fetch("http://localhost:5000/api/products",{
            method:"GET",
            headers:{
                'Content-Type':'application/json',
                Authorization:localStorage.getItem('token')
            }
        }).then(res=>res.json())
        .then(data => {
            setProduct(data)
        })
    },[])

    return(
        <div>
            <ToastContainer />
            {localStorage.getItem('token') ?
            <div>
                <Navbar />
                <h2 className='text-center mt-4 mb-4'>Welcome to QuickB, {user.name}</h2>
                <div className='container'>
                    {product.length>0 ?
                        <div className='row'>
                            {product.map(item=>(
                                    <div className='col-4 mb-3'>
                                    <div class="card shadow bg-light" style={{borderRadius:'20px'}}>
                                        <div class="card-body">
                                            <h5 class="card-title">{item.pname}</h5>
                                            <p class="card-text">Rs. {item.price}/Unit</p>
                                            <p className='card-text'>Quantity: {item.quantity}</p>
                                            <p class="card-text">{item.description}</p>
                                            <a href="/editproduct" className="btn btn-primary btn-block" onClick={()=>localStorage.setItem('product',JSON.stringify(item))}>Edit {item.pname}</a>
                                        </div>
                                    </div>
                                    </div>
                            ))}
                        </div>    
                        :
                        <div>
                            <h4 className='text-center'>No Products in Basket! <a href='/addproduct'>Add</a> some?</h4>
                        </div>
                    }
                </div>
            </div>
            :
            <div className='container mt-4'>
                <h1 className='text-center'>QuickB</h1>
                <h3 className='text-center mt-4'>You Need To <a href='/login'>Login</a> or <a href='/signup'>Signup</a> to Continue using QuickB!</h3>
            </div>
            }
        </div>
    )
}

export default Home;