import React from "react"
import ReCAPTCHA from "react-google-recaptcha"

const Test=()=>{
    function onChange(value) {
        console.log("Captcha value:", value)
        fetch("http://localhost:5000/api/test",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                value
            })
        })
        .then(res=>res.json())
        .then(data=>localStorage.setItem("msg",JSON.stringify(data.message)))
      }
    return (
        <ReCAPTCHA sitekey="6LcAq-MZAAAAAAk0hspQfTZ1cHvcNYOI5JoMI9iN" onChange={onChange}/>
    )
}

export default Test
