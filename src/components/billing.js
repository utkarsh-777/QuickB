import React,{useEffect, useState} from "react"
import { toast,ToastContainer } from "react-toastify"
import Navbar from "./navbar"
import {useHistory} from 'react-router-dom'
var narr = []
var qarr = []

const Billing = () => {
    const [cname,setCname] = useState('')
    const [mobile,setMobile] = useState('')
    const [address,setAddress] = useState('')
    const [iname,setIname] = useState('')
    const [iquantity,setIquantity] = useState('')
    const [products,setProducts] = useState('')
    const [flag,setFlag] = useState(false)

    const [fin,setFin] = useState('')
    const [fiq,setFiq] = useState('')
    
    const [count,setCount] = useState(0)
    var arr = ['']
    var s1 = ''
    var s2 = ''

    const history = useHistory()

    for(var m=0;m<count;m++){
        arr.push(m)
    }

    const handleAdd = () => {
        narr.push(iname)
        qarr.push(iquantity)
        setCount(count+1)
    }
    console.log(cname);
    useEffect(()=>{
        fetch('http://localhost:5000/api/products',{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                Authorization:localStorage.getItem('token')
            }
        }).then(res=>res.json())
        .then(data=>{
            var arr = ['-']
            for(var i=0;i<data.length;i++){
                arr.push(data[i].pname)
            }
            setProducts(arr)
        })
    },[])

    const handleBill = () => {
        console.log(fiq);
        fetch('http://localhost:5000/api/generatebill',{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                Authorization:localStorage.getItem('token')
            },
            body:JSON.stringify({
                cname:cname,
                mobile:mobile,
                address:address,
                iname:fin,
                iquantity:fiq
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                return toast(data.error,{type:'error'})
            }
            else{
                localStorage.setItem('bill',JSON.stringify(data.bill))
                history.push('/showBill')
            }
        })
    }
    
    return(
        <div>
            <Navbar />
            <ToastContainer />
            <div className='container'>
                <h2 className='mb-2 mt-4'>Make A Bill</h2>
                <label for='customer'>Customer Name</label>
                <input type='text' className='form-control' placeholder='Customer' 
                onChange={e=>setCname(e.target.value)}
                />
                <label for='mobile'>Mobile Number</label>
                <input type='text' className='form-control' placeholder='Mobile' 
                onChange={e=>setMobile(e.target.value)}
                />
                <label for='address'>Address</label>
                <input type='text' className='form-control' placeholder='Address' 
                onChange={e=>setAddress(e.target.value)}
                />
                <div className='container mt-3 mb-3 border' style={{borderRadius:'10px'}}>
                <label>Select Items</label>    
                    {arr.map(i=>(
                    <div className='row'>
                        <div className='col-6'>
                            Item
                            <select name="cars" id="cars" className='form-control mb-4' onChange={e=>{e.target.value!='' ? setIname(e.target.value):console.log("enter vald name")}}>
                            {products ?
                                products.map(item=>{
                                return(
                                    <option value={String(item)}>{item}</option>
                                )
                            }) :
                            <option>-</option>
                            }
                            </select>
                        </div>
                        <div className='col-6'>
                            Quantity
                            <input type='number' id="q1" className='form-control' onChange={e=>{e.target.value!=''?setIquantity(e.target.value):console.log("valid quan")}} />
                        </div>
                    </div>
                    ))}
                        
                    </div>

                {!flag ?
                    <button className='btn btn-sm btn-success' onClick={()=>handleAdd()}>Add More Items</button>
                    :
                    <div>
                        {qarr[0]!=="" ? 
                            <div>
                                {narr.map(item=>(
                                    <p>{item + " X " + qarr[narr.indexOf(item)] + " "}</p>
                                ))}
                            </div>
                            :
                            <div><p className='text-danger'>Reload and Select Appropiate items and Quantities!</p></div>
                        }
                        
                    </div>
                }
                 {!flag && document.getElementById("q1") ?
                 <>
                    {document.getElementById("q1").value ?
                    <button className='btn btn-dark btn-sm ml-3' onClick={()=>{
                        narr.push(iname)
                        qarr.push(iquantity)
                        setFlag(true)
                        for(var m=0;m<narr.length;m++){
                            s1 = s1+" "+narr[m]
                            s2 = s2+" "+qarr[m]
                        }
                        setFin(s1.trim())
                        setFiq(s2.trim())
                        console.log(s1,s2)
                    }}>Done</button>
                    :
                    <></>
                }
                    </>
                    :
                    <div></div>
                }
                
                <br/><br/>
                {flag && document.getElementById("q1") ?
                    <button className='btn btn-block btn-info mb-4' onClick={()=>handleBill()}>Generate Bill</button>
                    :
                    <div></div>
                }
            </div>
        </div>
    )
}

export default Billing;