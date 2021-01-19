import React,{useState} from "react"
import { toast,ToastContainer } from "react-toastify"
import Navbar from "./navbar"

const EditProduct = () => {

    const product = JSON.parse(localStorage.getItem('product'))

    const [pname,setPname] = useState(product.pname)
    const [price,setPrice] = useState(product.price)
    const [description,setDescription] = useState(product.description)
    const [quantity,setQuantity] = useState(product.quantity)

    const handleSubmit = () => {
        fetch('http://localhost:5000/api/editproduct',{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                Authorization:localStorage.getItem('token')
            },
            body:JSON.stringify({
                pid:product.pid,
                pname,
                price,
                description,
                quantity
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data){
                return toast("Successfully updated!",{type:'warning'})
            }
        })
    }

    return(
        <div>
            <Navbar />
            <ToastContainer />
                <div className='container shadow p-2 bg-light mt-4' style={{borderRadius:'20px'}}>
                <div className='mb-4 mt-2'>
                    <h2>Edit {product.pname} !</h2>
                </div>
                <label for='name'>Product Name</label>
                <input className='form-control mb-2' type='text' name='pname' value={pname}
                onChange={e=>setPname(e.target.value)}
                />
                <label for='price'>Price per unit</label>
                <input className='form-control mb-2' type='number' name='price' value={price}
                onChange={e=>setPrice(e.target.value)}
                />
                <label for='quantity'>Quantity</label>
                <input className='form-control mb-2' type='number' name='quantity' value={quantity}
                onChange={e=>setQuantity(e.target.value)}
                />
                <label for='description'>Description <span className='text-muted'>(Optional)</span></label>
                <textarea className='form-control mb-2' type='text' name='description' value={description}
                onChange={e=>setDescription(e.target.value)}
                />
                <button className='btn btn-success btn-sm mt-2 mb-4' onClick={()=>handleSubmit()}>Save Changes</button>
            </div>
        </div>
    )
}

export default EditProduct;