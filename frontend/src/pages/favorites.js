import { useState, useEffect } from 'react'
import CardCuadricula from 'i/components/CardCuadricula'
import CardHorizontal from 'i/components/CardHorizontal'
import $ from 'jquery';


function FavoritesView() {

  const [data, setData] = useState([]);
  const [layout, setLayout] = useState("grid");
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    let keys = Object.keys(sessionStorage);
    
    let dataAux = [];
    for(let key of keys) {
        dataAux.push(JSON.parse(sessionStorage.getItem(key)));
    }
    setData(dataAux);
    setTotalItems(dataAux.length)
  }, [])

  useEffect(() => {
    $(window).on('resize', function(event){
      var windowSize = $(window).width();
        if(windowSize >= 768){
          setLayout("grid")
        }
    });    
  })

  return (
    <>
      <main className="flex flex-row justify-between">
      <div className="my-10 pl-6 pr-6">
        <div className='flex flex-row items-center pt-5 pb-2 justify-between'>
          <div className="">
            <div className="text-[#1B2141] text-sm">{totalItems + ' carros encontrados'}</div>
          </div>
          <div className="">
            <button className="lg:hidden" onClick={layout === "grid" ? () => setLayout("list") : () => setLayout("grid")}>
              {layout === "grid" ? 
              <svg width="22" height="22" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12.25h-2c-1.518 0.002-2.748 1.232-2.75 2.75v2c0.002 1.518 1.232 2.748 2.75 2.75h2c1.518-0.002 2.748-1.232 2.75-2.75v-2c-0.002-1.518-1.232-2.748-2.75-2.75h-0zM7.25 17c-0.001 0.69-0.56 1.249-1.25 1.25h-2c-0.69-0.001-1.249-0.56-1.25-1.25v-2c0.001-0.69 0.56-1.249 1.25-1.25h2c0.69 0.001 1.249 0.56 1.25 1.25v0zM30 15.25h-17c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h17c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0zM6 1.25h-2c-1.518 0.002-2.748 1.232-2.75 2.75v2c0.002 1.518 1.232 2.748 2.75 2.75h2c1.518-0.002 2.748-1.232 2.75-2.75v-2c-0.002-1.518-1.232-2.748-2.75-2.75h-0zM7.25 6c-0.001 0.69-0.56 1.249-1.25 1.25h-2c-0.69-0.001-1.249-0.56-1.25-1.25v-2c0.001-0.69 0.56-1.249 1.25-1.25h2c0.69 0.001 1.249 0.56 1.25 1.25v0zM13 5.75h17c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0h-17c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0zM6 23.25h-2c-1.518 0.002-2.748 1.232-2.75 2.75v2c0.002 1.518 1.232 2.748 2.75 2.75h2c1.518-0.002 2.748-1.232 2.75-2.75v-2c-0.002-1.518-1.232-2.748-2.75-2.75h-0zM7.25 28c-0.001 0.69-0.56 1.249-1.25 1.25h-2c-0.69-0.001-1.249-0.56-1.25-1.25v-2c0.001-0.69 0.56-1.249 1.25-1.25h2c0.69 0.001 1.249 0.56 1.25 1.25v0zM30 26.25h-17c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h17c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0z" fill="#87899C"/> 
              </svg>
              :
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0.791687 4C0.791687 2.22809 2.22811 0.791672 4.00002 0.791672H6.33335C8.10527 0.791672 9.54169 2.22809 9.54169 4V6.33334C9.54169 8.10525 8.10527 9.54167 6.33335 9.54167H4.00002C2.22811 9.54167 0.791687 8.10525 0.791687 6.33334V4ZM4.00002 2.54167C3.1946 2.54167 2.54169 3.19459 2.54169 4V6.33334C2.54169 7.13875 3.1946 7.79167 4.00002 7.79167H6.33335C7.13877 7.79167 7.79169 7.13875 7.79169 6.33334V4C7.79169 3.19459 7.13877 2.54167 6.33335 2.54167H4.00002ZM12.4584 4C12.4584 2.22809 13.8948 0.791672 15.6667 0.791672H18C19.7719 0.791672 21.2084 2.22809 21.2084 4V6.33334C21.2084 8.10525 19.7719 9.54167 18 9.54167H15.6667C13.8948 9.54167 12.4584 8.10525 12.4584 6.33334V4ZM15.6667 2.54167C14.8613 2.54167 14.2084 3.19459 14.2084 4V6.33334C14.2084 7.13875 14.8613 7.79167 15.6667 7.79167H18C18.8054 7.79167 19.4584 7.13875 19.4584 6.33334V4C19.4584 3.19459 18.8054 2.54167 18 2.54167H15.6667ZM0.791687 15.6667C0.791687 13.8948 2.22811 12.4583 4.00002 12.4583H6.33335C8.10527 12.4583 9.54169 13.8948 9.54169 15.6667V18C9.54169 19.7719 8.10527 21.2083 6.33335 21.2083H4.00002C2.22811 21.2083 0.791687 19.7719 0.791687 18V15.6667ZM4.00002 14.2083C3.1946 14.2083 2.54169 14.8613 2.54169 15.6667V18C2.54169 18.8054 3.1946 19.4583 4.00002 19.4583H6.33335C7.13877 19.4583 7.79169 18.8054 7.79169 18V15.6667C7.79169 14.8613 7.13877 14.2083 6.33335 14.2083H4.00002ZM12.4584 15.6667C12.4584 13.8948 13.8948 12.4583 15.6667 12.4583H18C19.7719 12.4583 21.2084 13.8948 21.2084 15.6667V18C21.2084 19.7719 19.7719 21.2083 18 21.2083H15.6667C13.8948 21.2083 12.4584 19.7719 12.4584 18V15.6667ZM15.6667 14.2083C14.8613 14.2083 14.2084 14.8613 14.2084 15.6667V18C14.2084 18.8054 14.8613 19.4583 15.6667 19.4583H18C18.8054 19.4583 19.4584 18.8054 19.4584 18V15.6667C19.4584 14.8613 18.8054 14.2083 18 14.2083H15.6667Z" fill="#87899C"/>
              </svg>}
            </button>
          </div>
        </div>
        {layout === "grid" ?
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 w-auto" data-testid="cars-list">
              {data.map((e) => {
                return <CardCuadricula key={e.id} product={e}/>;
              })}
            </div>
            :
            <div className="flex flex-col" data-testid="cars-list"> 
              {data.map((e) => {
                return <><CardHorizontal key={e.id} product={e}/><hr className="w-full bg-[#E3E5ED]"/></>;
              })}
            </div>
          }
        </div>
      </main>
    </>
  )
}


export default FavoritesView