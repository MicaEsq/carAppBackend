import { useEffect, useState } from "react";

export default function Pagination({data, total, setDataPaginated}) {
  let pages = Math.ceil(total/12);
  let [current, setCurrent] = useState(1);

  useEffect(() => {
    setCurrent(1);
    if(current === 1){
        let dataPaginated = [...data];
        setDataPaginated(dataPaginated.slice(0, 12));
    }
  }, [data])
  
  function getStarEnd(currentPage){
    setCurrent(currentPage);
    let dataPaginated = [...data];
    let currentAux = currentPage;
    let inicio = 0;
    let fin = currentAux*12;

    if(currentAux === 1){
        inicio = 0;
    }
    else if(currentAux === pages){
        inicio = (currentAux-1)*12;
        fin = total;
    }
    else{
        inicio = (currentAux-1)*12;
    }

    let result = [];
    result = dataPaginated.slice(inicio, fin);
    setDataPaginated(result);
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        {current !== 1 && <button
          onClick={()=>{getStarEnd(current-1)}}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </button>}
        {current !== pages && <button
          onClick={()=>{getStarEnd(current+1)}}
          className="relative ml-3 ml-auto inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </button>}
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            {current !== 1 && <button
              onClick={()=>{getStarEnd(current-1)}}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>}
             {Array.from({ length: pages }, (v, i) => i+1).map((e,index) => {
              if(e === current){
                return <button
                    key={index}
                    onClick={()=>{getStarEnd(e)}}
                    aria-current="page"
                    className="relative z-10 inline-flex items-center rounded-md bg-[#566DED] px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#566DED]"
                >
                    {e}
                </button> 
              }
              else{
                return <button
                key={index}
                onClick={()=>{getStarEnd(e)}}
                aria-current="page"
                className="relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#566DED]"
                >
                    {e}
                </button>}
            })} 
            {current !== pages && <button
                onClick={()=>{getStarEnd(current+1)}}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
              <span className="sr-only">Next</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>}
          </nav>
        </div>
      </div>
    </div>
  )
}