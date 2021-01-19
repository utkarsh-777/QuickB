import React,{useEffect, useState} from 'react'
import Axios from "axios"
import Navbar from './navbar'
import CustomerBill from "./customerbill"
import { toast, ToastContainer } from 'react-toastify'
import {useHistory} from "react-router-dom"

const BillHistory = () => {
    const [bill,setBill] = useState('')
    const [lbill,setLbill] = useState('')
    const [flag,setFlag] = useState(false)

    const [startdate,setStartdate] = useState('')
    const [enddate,setEnddate] = useState('')
    const [billbydate,setBillbydate] = useState('')

    const history = useHistory()

    const handleSubmit = () => {
        Axios({
            method:'post',
            url:'http://localhost:5000/api/billbydate',
            headers:{
                'Content-Type':'application/json',
                Authorization:localStorage.getItem('token')
            },
            data:{
                startdate,
                enddate
            }
        }).then(res=>{
            console.log(res)
            if(res.data.length==0){
                toast('No Bills Found!',{type:"error"})
            }
            setBillbydate(res.data)
        })
    }

    useEffect(()=>{
        Axios({
            method:'get',
            url:'http://localhost:5000/api/getbill',
            headers:{
                Authorization:localStorage.getItem('token')
            }
        }).then(res=>{
            console.log(res)
            setBill(res.data)
            var arr = []
            for(var i=0;i<5;i++){
                if(res.data[i]){
                    arr.push(res.data[i])
                }
            }
            setLbill(arr)
        })
    },[])

    const viewBill = (item) => {
        console.log(item)
        localStorage.setItem('bill',JSON.stringify(item))
        history.push('/ViewBill')
    }

    return(
        <div>
            <Navbar />
            <ToastContainer />
            <div>
                <div className='row'>
                    <div className='col-6 border'>
                    <h2 className='mt-3 mb-3'>Bills History</h2>
                    {lbill && !flag ? 
                        <div>
                            {lbill.map(item=>{
                                return(
                                    <div className="card mb-3 mt-3" style={{width:'auto',borderRadius:'20px'}}>
                                        <div class="card-body">
                                            <h5 class="card-title">Customer : <span className='text-danger'>{item.cname}</span></h5>
                                            <h5 class="card-title">Mobile No : <span className='text-danger'>{item.mobile}</span></h5>
                                            <p class="card-text">Bill Generated on <span className='text-danger'>{item.date ? item.date.slice(0,10) : ""}</span></p>
                                            <p class="card-text">Bill Amount : <span className='text-danger'>Rs {item.bill_amount}</span></p>
                                            <p class="card-text">Purchased Items : <span className='text-danger'>{item.description}</span></p>
                                            <button className='btn btn-success btn-sm' onClick={()=>viewBill(item)}>View Bill</button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>    
                        :
                        <div>
                            {bill ? 
                                <div>
                                    {bill.map(item=>{
                                        return(
                                            <div className="card mb-3 mt-3" style={{width:'auto',borderRadius:'20px'}}>
                                                <div class="card-body">
                                                    <h5 class="card-title">Customer : <span className='text-danger'>{item.cname}</span></h5>
                                                    <h5 class="card-title">Mobile No : <span className='text-danger'>{item.mobile}</span></h5>
                                                    <p class="card-text">Bill Generated on <span className='text-danger'>{item.date ? item.date.slice(0,10) : ""}</span></p>
                                                    <p class="card-text">Bill Amount : <span className='text-danger'>Rs {item.bill_amount}</span></p>
                                                    <p class="card-text">Purchased Items : <span className='text-danger'>{item.description}</span></p>
                                                    <button className='btn btn-success btn-sm' onClick={()=>viewBill(item)}>View Bill</button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                :
                                <div></div>
                            }    
                        </div> 
                    }
                    {!flag ? 
                        <h3 className='text-center'><button className='btn btn-sm btn-dark' onClick={()=>setFlag(true)}>Show All Bills</button></h3>
                        :
                        <p className='text-danger text-center mt-2'>All bills till now!</p>
                    }
                    </div>
                    <div className='col-6 border'>
                         <CustomerBill/>
                        <h2 className='mt-3 mb-3'>Search By Date</h2>
                        <label for='startdate'>Enter the Start Date</label>
                        <input type='date' name='startdate' className='form-control' onChange={e=>setStartdate(e.target.value)} />
                        <label for='enddate'>Enter the End Date</label>
                        <input type='date' name='enddate' className='form-control' onChange={e=>setEnddate(e.target.value)} />
                        <button className='btn btn-sm btn-info mt-2' onClick={()=>handleSubmit()}>Search</button>

                        {billbydate && billbydate.length>0 ? 
                            <div>
                                {billbydate.map(item=>{
                                    return(
                                        <div className="card mb-3 mt-3" style={{width:'auto',borderRadius:'20px'}}>
                                            <div class="card-body">
                                                <h5 class="card-title">Customer : <span className='text-danger'>{item.cname}</span></h5>
                                                <h5 class="card-title">Mobile No : <span className='text-danger'>{item.mobile}</span></h5>
                                                <p class="card-text">Bill Generated on <span className='text-danger'>{item.date ? item.date.slice(0,10) : ""}</span></p>
                                                <p class="card-text">Bill Amount : <span className='text-danger'>Rs {item.bill_amount}</span></p>
                                                <p class="card-text">Purchased Items : <span className='text-danger'>{item.description}</span></p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>    
                            :
                            <div>
                                {billbydate ? 
                                    <p className='text-danger mt-2'>No Results!</p>
                                    :
                                    <div></div>
                                }
                                
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BillHistory;