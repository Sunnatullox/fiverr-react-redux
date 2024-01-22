import React from 'react'
import HeroBaner from "../components/Landing/HeroBaner";


function Home() {
  return (
    <div className={`${window.location.pathname !== "/" ? "mt-36": ""} mb-auto w-full mx-auto`}>
      <HeroBaner />
      <p>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
      </p>
    </div>
  )
}

export default Home
