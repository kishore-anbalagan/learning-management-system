import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <section className="p-[40px] bg-white pt-[100px] min-h-[80vh] flex flex-col items-center justify-center">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-center text-9xl font-extrabold text-black mb-6">404</h1>
        
        <div className="mt-6">
          <h3 className="text-4xl mb-4 font-semibold text-richblack-800">
            Look like you're lost
          </h3>

          <p className="text-lg text-richblack-600 mb-8">The page you are looking for is not available!</p>

          <Link to='/'
            className="py-[13px] px-10 text-lg bg-caribbeangreen-200 hover:bg-caribbeangreen-400 my-5 inline-block rounded-full font-semibold duration-300 text-white"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </section>
  )
}

export default PageNotFound