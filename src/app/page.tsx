"use client"
import Image from "next/image";
import React from "react";
import Login from "@/app/login/page";
import { useAuth } from "@/app/context/auth-context";
import Dashboard from "./dashboard/page";




export default function Home() {
  const authState = useAuth();

  return(
    <div>
      {authState.authState ? <Dashboard /> : <Login />}
    </div>
  )
}
