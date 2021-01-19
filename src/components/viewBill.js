import Axios from "axios"
import React,{useEffect, useState} from "react"
import Navbar from "./navbar"

const ViewBill = () => {
    const data = JSON.parse(localStorage.getItem('bill'))

    const [cdata,setCdata] = useState('')

    useEffect(()=>{
        Axios({
            method:'post',
            url:"http://localhost:5000/api/billcustomer",
            headers:{
                "Content-Type":"application/json",
                Authorization:localStorage.getItem('token')
            },
            data:{
                bid:JSON.parse(localStorage.getItem('bill')).bid
            }
        }).then(data=>{
            console.log(data)
            setCdata(data.data[0])
        })
    },[])

    return(
        <div>
            <Navbar />
            <div className='container'>
            <h2 className = 'mb-3 mt-3'>Quick B</h2>
                <div className='border p-2' style={{borderRadius:'20px'}}>
                <h3 className='mb-3 mt-3'>Bill </h3>
                    <p>Customer Name : <span style={{fontWeight:'bold'}}>{cdata ? cdata.cname : ""}</span></p>
                    <p>Mobile : <span style={{fontWeight:'bold'}}>+91 {cdata ? cdata.mobile : ""}</span></p>
                    <p>Address : <span style={{fontWeight:'bold'}}>{cdata ? cdata.address : ""}</span></p>
                    <p>Bill Generated on <span style={{fontWeight:'bold'}}>{data.date.slice(0,10)}</span></p>
                    <p>Bill Amount : <span style={{fontWeight:'bold'}}>Rs {data.bill_amount}</span></p>
                    <p>Bill Description : <span style={{fontWeight:'bold'}}>{data.description}</span></p>
                    <p>Bill Id : <span style={{fontWeight:'bold'}}>{data.bid}</span></p>
                </div>
            </div>
        </div>
    )
}

export default ViewBill;