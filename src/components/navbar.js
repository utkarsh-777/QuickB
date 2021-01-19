import React,{useState,useEffect} from "react"
import {useHistory} from "react-router-dom"

const Navbar = () => {
    const [user,setUser] = useState('')
    const history = useHistory()
    const handleLogout = () => {
        localStorage.clear()
        history.push("/")

    }

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
    },[])

    return(
        <nav class="navbar navbar-expand-lg navbar-light bg-warning shadow">
            <a class="navbar-brand" href="/">QuickB</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item active">
                    <a class="nav-link" href="/billing">Billing</a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Actions
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <a class="dropdown-item" href="/billing">Create Bill</a>
                    <a class="dropdown-item" href="/addproduct">Add Product</a>
                    <a class="dropdown-item" href="/billhistory">Bill History</a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#">View Source Code</a>
                    </div>
                </li>
                </ul>
                <form class="form-inline my-2 my-lg-0">
                <div className='mr-3'>Logged in as {user.username}</div>
                <button class="btn btn-outline-danger my-2 my-sm-0" onClick={()=>handleLogout()}>Logout</button>
                </form>
            </div>
        </nav>
    )
}

export default Navbar;