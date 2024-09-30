import React from 'react'

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
      A real-time Chain Payment Request App
        <span className="bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text">
          {" "}
          for CrossFi 
        </span>
      </h1>
      <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">
      The <b> CrossFi Chain Payment Request App </b> is a decentralized application (dApp) that enables users to generate and share payment request links or invoices to receive XFI payments. This solution provides an easy-to-use tool for individuals, freelancers, and small businesses to accept XFI payments without needing deep knowledge of blockchain or complex integrations
      </p>
      <div className="flex justify-center my-10">
        <a
          href="http://localhost:5000/"
          className="bg-gradient-to-r from-orange-500 to-orange-800 py-3 px-4 mx-3 rounded-md"
        >
          Start for free
        </a>
        <a href="https://docs.google.com/document/d/1aapfDMVq_h2JCSygDWQDUxd6DQU0lFU7/edit?usp=drive_link&ouid=103975434977898614179&rtpof=true&sd=true" className="py-3 px-4 mx-3 rounded-md border">
        Terms and Conditions
          </a>
      </div>
      
      </div>
  )
}

export default HeroSection