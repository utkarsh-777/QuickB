import React, { useEffect, useState } from "react"
import {toast,ToastContainer} from "react-toastify"
import {useParams} from "react-router-dom"

const Activate = () => {
    const {token} = useParams()
    const [ctoken,setCtoken] = useState('')

    useEffect(()=>{
        setCtoken(JSON.parse(localStorage.getItem('auth')))
    },[])

        return(
            <div>
        {ctoken==token ? 
            <div><a href="/login">Login To your Account</a></div>
            :
            <div>Account Not Activated!</div>
        }
        
        </div>
    )
}

export default Activate;