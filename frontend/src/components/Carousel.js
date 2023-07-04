import React, { useState } from "react";

function Carousel({image, arrowsConstantVisibility}) {
  // setting some random images besides the one of the car to show the change of images
  const [images, setImages] = useState(['/images/landscape.jpg', '/images/landscape2.jpg', '/images/landscape3.jpg', '/images/landscape4.jpg']);
  
  const [currentImageIndex, setcurrentImageIndex] = useState(0);

  function previousImage(){
    const reset = currentImageIndex === 0;
    const index = reset ? images.length - 1 : currentImageIndex - 1;
    setcurrentImageIndex(index);
  };

  function nextImage(){
    const resetIndex = currentImageIndex === images.length - 1;
    const index = resetIndex ? 0 : currentImageIndex + 1;
    setcurrentImageIndex(index);
  };

  function definePrevOrNext(clicked){
    setcurrentImageIndex(clicked);
  };

  return (
    <div className="group flex flex-row items-center justify-center w-full relative">
        <button className={arrowsConstantVisibility ? 'absolute h-full z-10 pl-2 left-1 opacity-100' : 'absolute h-full z-10 pl-2 left-1 opacity-0 hover:opacity-100 duration-200'} onClick={previousImage}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fill="white" fillOpacity="0.7" fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
            </svg>
        </button>
        <img
            src={images[currentImageIndex]}
            className="rounded-lg relative z-0"
            height={"100%"}
            width={"100%"}
            alt={""}
            title={""}
            />
        <button className={arrowsConstantVisibility ? 'absolute h-full z-10 right-1 pr-2 opacity-100' : 'absolute h-full z-10 right-1 pr-2 opacity-0 hover:opacity-100 duration-300'} onClick={nextImage}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fill="white" fillOpacity="0.7" fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
            </svg>
        </button>
        <div className={arrowsConstantVisibility ? 'absolute z-10 flex flex-row self-end p-4 opacity-100' : 'absolute z-10 flex flex-row self-end p-4 opacity-0 hover:opacity-100 duration-300'}>
            {[...Array(5)].map((e,i) => {
                return <button key={i} className="px-1" onClick={() => definePrevOrNext(i)}>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="8" height="8" rx="4" fill="white" fillOpacity={currentImageIndex === i ? "1" : "0.5"}/>
                    </svg>
                </button>
            })}
        </div>
    </div>
  );
};

export default Carousel;
