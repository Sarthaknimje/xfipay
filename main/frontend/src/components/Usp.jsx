import React from 'react'
import { testimonials } from "../constants";

const Usp = () => {
    return (
        <div className="mt-20 tracking-wide">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center my-10 lg:my-20">
          Technical Implementation
          </h2>
          <div className="flex flex-wrap justify-center">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-full sm:w-1/2 lg:w-1/3 px-4 py-2">
                <div className="bg-neutral-900 rounded-md p-6 text-md border border-neutral-800 font-thin">
                  <p>{testimonial.title}</p>
                  <div className="flex mt-8 items-start">
                    <div>
                      <span className="text-sm font-normal  text-neutral-300">
                        {testimonial.text}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
}

export default Usp