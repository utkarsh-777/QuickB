import React,{useState} from "react"
import { toast,ToastContainer } from "react-toastify"
import Navbar from "./navbar"

const AddProduct = () => {

    const [pname,setPname] = useState('')
    const [price,setPrice] = useState('')
    const [description,setDescription] = useState('')
    const [quantity,setQuantity] = useState('')

    //console.log(price)

    const handleSubmit = () => {
        fetch("http://localhost:5000/api/addproduct",{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization:localStorage.getItem('token')
            },
            body:JSON.stringify({
                pname,
                price,
                description,
                quantity
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                return toast(data.error,{type:'error'})
            }
            return toast(data.message,{type:'info'})
        })
    }

    return(
        <div>
        <ToastContainer />
        <Navbar />
        <div className='container shadow p-2 bg-light mt-4' style={{borderRadius:'20px'}}>
            <div className='mb-4 mt-2'>
                <h2>Add Products!</h2>
            </div>
            <label for='name'>Product Name</label>
            <input className='form-control mb-2' type='text' name='pname' placeholder='Enter the Product Name'
            onChange={e=>setPname(e.target.value)}
            />
            <label for='price'>Price per unit</label>
            <input className='form-control mb-2' type='number' name='price' placeholder='Enter the Price'
            onChange={e=>setPrice(e.target.value)}
            />
            <label for='quantity'>Quantity</label>
            <input className='form-control mb-2' type='number' name='quantity' placeholder='Enter the Product Stock / Quantity'
            onChange={e=>setQuantity(e.target.value)}
            />
            <label for='description'>Description <span className='text-muted'>(Optional)</span></label>
            <textarea className='form-control mb-2' type='text' name='description' placeholder='Description Of Product'
            onChange={e=>setDescription(e.target.value)}
            />
            <button className='btn btn-success btn-sm mt-2 mb-4' onClick={()=>handleSubmit()}>Add Product</button>
        </div>
        </div>
    )
}

export default AddProduct;