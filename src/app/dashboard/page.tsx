"use client"
import React from "react";
import Body from "./body";


import { useAuth } from "../context/auth-context";



const Dashboard = () =>{
    return(
        <div>
            <Body/>
        </div>
    )
}

export default Dashboard;