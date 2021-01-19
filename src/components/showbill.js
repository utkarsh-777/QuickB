import React,{useEffect, useState} from "react"
import Navbar from "./navbar"

const ShowBill = () => {
    const data = JSON.parse(localStorage.getItem('bill'))
    const [customer,setCustomer] = useState('')
    
    useEffect(()=>{
        fetch('http://localhost:5000/api/customer',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            Authorization:localStorage.getItem('token')
        },
        body:JSON.stringify({
            cid:data[0].cid
        })
    }).then(res=>res.json())
    .then(data=>{
        setCustomer(data[0])
    })
    },[])

    return(
        <div>
            <Navbar />
            <div className='container'>
            <h2 className = 'mb-3 mt-3'>Quick B</h2>
                <div className='border p-2' style={{borderRadius:'20px'}}>
                <h3 className='mb-3 mt-3'>Bill </h3>
                    <p>Customer Name : <span style={{fontWeight:'bold'}}>{customer.cname}</span></p>
                    <p>Mobile : <span style={{fontWeight:'bold'}}>+91 {customer.mobile}</span></p>
                    <p>Address : <span style={{fontWeight:'bold'}}>{customer.address}</span></p>
                    <p>Bill Generated on <span style={{fontWeight:'bold'}}>{data[0].date.slice(0,10)}</span></p>
                    <p>Bill Amount : <span style={{fontWeight:'bold'}}>Rs {data[0].bill_amount}</span></p>
                    <p>Bill Description : <span style={{fontWeight:'bold'}}>{data[0].description}</span></p>
                    <p>Bill Id : <span style={{fontWeight:'bold'}}>{data[0].bid}</span></p>
                </div>
            </div>
        </div>
    )
}

export default ShowBill;