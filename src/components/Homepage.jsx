import React from 'react'
import { assets } from '@/assets/assets'
import { Button } from './ui/button'
import { SignInButton } from '@clerk/clerk-react'
import './HomePage.css'
import { useEffect, useState } from 'react'

const Homepage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const texts = [
    "Organize Your Life",
    "Tame Your To-Do's",
    "Your Tasks, Your Way"
  ];
  const images = [
    assets.image1,
    assets.image2,
    assets.image3
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // change every 4 seconds

    return () => clearInterval(interval); // cleanup
  }, [images.length]);

  return (
    <div className='min-h-screen home flex items-center justify-center
    text-center bg-gray-100'>
      <div className='main'>
        <div className='box'>
        <div className='inner-box'>
          <article className='forms-wrap'>

            <h1 className='text-4xl lg:text-5xl font-bold flex items-center justify-center text-gray-900'>
              <img src={assets.logo} className='size-10 lg:size-15' alt='easyclass' />
              ToDo.io
            </h1>

            <p className='lg:text-lg text-neutral-500 max-w-2xl'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, saepe blanditiis sapiente
              necessitatibus ut dolore in non similique debitis a! Atque fugiat laudantium ducimus sapiente dolores ex
              qui minus natus?
            </p>

            <div className='flex items-center justify-center mt-6'>
              <SignInButton mode='modal'>
                <Button variant='default' className="sign-btn">
                  Get Started
                </Button>
              </SignInButton>
            </div>

          </article>

          <article >
            <div className='carousel'>
              <div className="images-wrapper">
                {images.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`slide ${index}`}
                    className={`image img-${index + 1} ${activeIndex === index ? "show" : ""}`}
                  />
                ))}

              </div>

              <div className="text-slider">
                <div className='text-wrap'>
                  <div className="text-group" style={{ transform: `translateY(-${activeIndex * 2.2}rem)` }} >
                    {texts.map((t, index) => (
                      <h2 key={index}>{t}</h2>
                    ))}
                  </div>
                </div>

                <div className="bullets">
                  {texts.map((_, index) => (
                    <span
                      key={index}
                      className={activeIndex === index ? "active" : ""}
                      onClick={() => setActiveIndex(index)}
                    ></span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Homepage