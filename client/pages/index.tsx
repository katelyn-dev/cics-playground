'use client'

import React, { useEffect, useRef, useState } from 'react'
import Header from '../components/Header';


const Index = () => {
  const init = useRef(0);
  const [isAuth, setIsAuth] = useState(false);
  const [authUrl, setAuthUrl] = useState();

  useEffect(() => {
    fetch("http://localhost:8080/")
      .then((response) => response.json())
      .then(data => {
        setAuthUrl(data.auth_url)
      })
  }, [])


  useEffect(() => {
    if (authUrl !== undefined) {
      window.location.href = authUrl
    }
  }, [authUrl])
  
  useEffect(() => {
    const url = window.location.href;
    const urlObj = new URL(url);
    const queryString = urlObj.search;
    const params = new URLSearchParams(queryString);
    const code = params.get('code');  
    if (code) {
    fetch("http://localhost:8080/auth?code="+ code)
      .then((response) => response.json())
      .then(data => {
        if (data.authorization == "true") {
          setIsAuth(true)
        }
      })
    } else {
      console.log("re-auth")
      fetch("http://localhost:8080/auth")
      .then((response) => response.json())
      .then(data => {
        if (data.authorization == "true") {
          setIsAuth(true)
        }
      })
    }
  }, [typeof window !== 'undefined' ? window.location.href : ''])

  return (
    isAuth && (<>
      <main className="flex flex-col ">
        <Header />
      </main>
    </>)
  )
}

export default Index