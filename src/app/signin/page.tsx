"use client"
import { useState } from "react";
import Login from "../components/login";
import Signup from "../components/signup";
import ForgetPassword from "../components/forgetPassword";
export default function Signin()  {
    const [isLogin, setLogin] = useState(true);
    const [isSignup, setSignup] = useState(false);
    const [isForget, setForget] = useState(false);
    if (isLogin){
        return (
          <>
            <Login onLogin={setLogin} onForget={setForget} onSignup={setSignup}></Login>
          </>
        )
      }
      if (isSignup){
        return (
          <>
            <Signup onForget={setForget} onLogin={setLogin} onSignup={setSignup}></Signup>
          </>
        )
      }
      if (isForget){
        return(
          <>
            <ForgetPassword onForget={setForget} onLogin={setLogin} onSignup={setSignup}></ForgetPassword>
          </>
        )
      }
}