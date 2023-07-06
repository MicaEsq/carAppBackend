import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect, Fragment } from 'react'
import CardCuadricula from 'i/components/CardCuadricula'
import CardHorizontal from 'i/components/CardHorizontal'
import Filters from 'i/components/Filters';
import Badge from 'i/components/Badge';
import $ from 'jquery';
import Pagination from 'i/components/Pagination'
import Navbar from 'i/components/Navbar'
import Error404 from 'i/components/Error404';
import {Dialog, Disclosure, Popover, Transition } from '@headlessui/react'


/* function formattFilters(items){
  var filters = {};
  var brand= new Set(), model = new Set(), version = new Set(), year = new Set(), city = new Set();
  for(var i=0; i < Object.keys(items).length; i++){
    brand.add(items[i].brand);
    model.add(items[i].model);
    version.add(items[i].version);
    year.add(items[i].year);
    city.add(items[i].city);
  }

  filters["marca"]=Array.from(brand);
  filters["modelo"]=Array.from(model);
  filters["version"]=Array.from(version);
  filters["año"]=Array.from(year);
  filters["ciudad"]=Array.from(city);

  return filters
} */

function getFilteredData(items, setDataFiltered, filtersApplied, setTotalItems, setDataPaginated){
  const filteredArray = items.filter(item => filtersApplied.every(filter => item[filter.label] === filter.value))
  setDataFiltered(filteredArray);
  setDataPaginated(filteredArray.slice(0, 12));
  setTotalItems(filteredArray.length);
}

function getCards(layout, dataPaginated, favorites, setFavorites){
  if(dataPaginated.length !== 0){
    if(layout === "grid"){
      return <div className="grid grid-cols-2 md:grid-cols-3 gap-5" data-testid="cars-list">
                  {dataPaginated.map((e) => {
                    return <CardCuadricula key={e.id} product={e} favorites={favorites} setFavorites={setFavorites}/>;
                  })}
        </div>
    }
    else{
      return <div className="flex flex-col" data-testid="cars-list"> 
                  {dataPaginated.map((e) => {
                    return <><CardHorizontal key={e.id} product={e} favorites={favorites} setFavorites={setFavorites}/><hr className="w-full"/></>;
                  })}
        </div>
    }
  }
  else{
    return <Error404 message={'We could not find any results with your search...'}/>
  }
  
}


function CarsView() {

  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [layout, setLayout] = useState("grid");
  const [totalItems, setTotalItems] = useState(0);
  const [filtersApplied, setFiltersApplied] = useState(new Array);
  const [dataFiltered, setDataFiltered] = useState(data);
  const [modifiedFilter, setModifiedFilter] = useState(false);
  const [favorites, setFavorites] = useState(new Array);
  const [dataPaginated, setDataPaginated] = useState(new Array);

  const router = useRouter();
  let count = 1; 
  /* useEffect(() => {
    setLoading(true)
    fetch('https://mocki.io/v1/ddc770fd-1346-438e-a15f-cf8767577b9e')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setTotalItems(Object.keys(data.items).length)
        getFilteredData(data.items, setDataFiltered, filtersApplied, setTotalItems, setDataPaginated);
        setLoading(false)
      })
  }, [])
 */
  useEffect(() => {
    if(count===1){
      count=2;
      getData('cars/all/');
    }
  }, [])

  useEffect(() => {
    $(window).on('resize', function(event){
      var windowSize = $(window).width();
        if(windowSize >= 768){
          setLayout("grid")
        }
        else{
          setLayout("list");
        }
    });    
  })

  useEffect(() => {
      if(modifiedFilter){
        //getFilteredData(data, setDataFiltered, filtersApplied, setTotalItems, setDataPaginated);
        let params = '';
        for(var i=0; i<filtersApplied.length; i++){
          if(i === filtersApplied.length-1 && filtersApplied[i].label !== 'brands' && filtersApplied[i].label !== 'states' && filtersApplied[i].label !== 'cities' && filtersApplied[i].label !== 'models'){
            params = params + filtersApplied[i].label + '=' + filtersApplied[i].value;
          }
          else if(filtersApplied[i].label === 'brands' || filtersApplied[i].label === 'states' || filtersApplied[i].label === 'cities' || filtersApplied[i].label === 'models' ){
            if(i === filtersApplied.length-1){
              params = params + filtersApplied[i].label + '=' + filtersApplied[i].idOption;
            }
            else{
              params = params + filtersApplied[i].label + '=' + filtersApplied[i].idOption + '&';
            }
          }
          else{
            params = params + filtersApplied[i].label + '=' + filtersApplied[i].value + '&';
          }

        }

        if(params === ''){
          getData('cars/all/')
        }
        else{
          console.log(params)
          getData('cars/all/?' + params)
        }
        
        setModifiedFilter(false);
      }
  })


  function getData(params){
    setLoading(true);

    let url = 'http://localhost:8000/api/' + params;
    let method = 'GET';
    let msgError = "Error, there was a problem while fetching the cars.";

    var requestOptions = {
        method: method,
        headers: { 'Content-Type': 'application/json'},
    };
    
    fetch(url, requestOptions)
    .then(async response => {
        console.log(response)
        if (response.ok){
            
            return response.json();
        }
        else{
            const text = await response.text()
          throw new Error(text)
        }
    })
    .then((response) => {
      setData(response);
      setTotalItems(Object.keys(response).length);
      setLoading(false);
    })
    .catch((error) => {
      setError(error.message);
    });
  }


  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No profile data</p> 

  return (
    <>
      <Head>
        <title>Car App</title>
        <meta name="description" content="Car app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar></Navbar>
      <main className="flex flex-row justify-between">
        <div className="hidden max-w-sm lg:block md:w-full md:px-[35px] ">
          <Filters setFiltersApplied={setFiltersApplied} filtersApplied={filtersApplied} setModifiedFilter={setModifiedFilter}/>
        </div>
        <div className="my-5 px-6 w-full lg:pl-0 lg:pr-14">
          <div className='grid grid-cols-9 lg:grid-cols-5 items-center justify-end lg:items-start'>
            <div className="col-span-7 lg:col-span-4 justify-self-start">
              {filtersApplied.length > 0 && <div className='flex flex-row flex-wrap gap-y-2'>
                {filtersApplied.map((filter, index) => {
                  return <Badge key={index} data={filter} type={'filters-applied'} setFiltersApplied={setFiltersApplied} filtersApplied={filtersApplied} setModifiedFilter={setModifiedFilter}/>
                })}
              </div>}
              {/* <button className="flex flex-row items-center lg:gap-2 lg:hidden">
                <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M7.08333 2.125C5.702 2.125 4.37724 2.67373 3.40049 3.65049C2.42373 4.62724 1.875 5.952 1.875 7.33333C1.875 8.0173 2.00972 8.69457 2.27146 9.32648C2.5332 9.95838 2.91685 10.5325 3.40049 11.0162C3.88412 11.4998 4.45829 11.8835 5.09019 12.1452C5.72209 12.4069 6.39936 12.5417 7.08333 12.5417C7.7673 12.5417 8.44457 12.4069 9.07648 12.1452C9.70838 11.8835 10.2825 11.4998 10.7662 11.0162C11.2498 10.5325 11.6335 9.95838 11.8952 9.32648C12.1569 8.69457 12.2917 8.0173 12.2917 7.33333C12.2917 5.952 11.7429 4.62724 10.7662 3.65049C9.78943 2.67373 8.46467 2.125 7.08333 2.125ZM2.5166 2.7666C3.72777 1.55543 5.37048 0.875 7.08333 0.875C8.79619 0.875 10.4389 1.55543 11.6501 2.7666C12.8612 3.97777 13.5417 5.62048 13.5417 7.33333C13.5417 8.18145 13.3746 9.02127 13.0501 9.80483C12.8055 10.3952 12.4751 10.945 12.0706 11.4367L16.6919 16.0581C16.936 16.3021 16.936 16.6979 16.6919 16.9419C16.4479 17.186 16.0521 17.186 15.8081 16.9419L11.1867 12.3206C10.695 12.7251 10.1452 13.0555 9.55483 13.3001C8.77127 13.6246 7.93145 13.7917 7.08333 13.7917C6.23521 13.7917 5.3954 13.6246 4.61184 13.3001C3.82827 12.9755 3.11631 12.4998 2.5166 11.9001C1.91689 11.3004 1.44117 10.5884 1.11661 9.80483C0.79205 9.02127 0.625 8.18145 0.625 7.33333C0.625 5.62048 1.30543 3.97777 2.5166 2.7666Z" fill="#566DED"/>
                </svg>
                <p className="text-[#566DED] font-bold text-sm">Buscar</p>
              </button> */}
            </div>
            <div className="col-span-2 lg:col-span-1 justify-self-end">
              {filtersApplied.length > 0 && <button className="flex flex-row pt-1 text-[#566DED] text-sm items-center gap-1" onClick={() => {getData('cars'); setFiltersApplied(new Array); setDataFiltered(data); setDataPaginated(data.slice(0,12)); setTotalItems(Object.keys(data).length)}}> 
                <svg width="16" height="18" viewBox="0 0 16 18" fill="#566DED" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M5.30212 1.30214C5.57561 1.02865 5.94654 0.875 6.33331 0.875H9.66665C10.0534 0.875 10.4244 1.02865 10.6978 1.30214C10.9713 1.57563 11.125 1.94656 11.125 2.33333V4.20833H14.6666C15.0118 4.20833 15.2916 4.48816 15.2916 4.83333C15.2916 5.17851 15.0118 5.45833 14.6666 5.45833H14.4153L13.7342 14.996C13.7342 14.9961 13.7342 14.996 13.7342 14.996C13.693 15.5742 13.4343 16.1153 13.0102 16.5103C12.586 16.9054 12.0279 17.125 11.4483 17.125H4.55166C3.97203 17.125 3.41393 16.9054 2.98976 16.5103C2.56563 16.1153 2.30692 15.5743 2.26573 14.9962C2.26573 14.9961 2.26574 14.9962 2.26573 14.9962L1.58468 5.45833H1.33331C0.988135 5.45833 0.708313 5.17851 0.708313 4.83333C0.708313 4.48816 0.988135 4.20833 1.33331 4.20833H4.87498V2.33333C4.87498 1.94656 5.02863 1.57563 5.30212 1.30214ZM6.12498 4.20833H9.87498V2.33333C9.87498 2.27808 9.85303 2.22509 9.81396 2.18602C9.77489 2.14695 9.7219 2.125 9.66665 2.125H6.33331C6.27806 2.125 6.22507 2.14695 6.186 2.18602C6.14693 2.22509 6.12498 2.27808 6.12498 2.33333V4.20833ZM2.83787 5.45833L3.51256 14.9072C3.53127 15.17 3.64887 15.416 3.84168 15.5956C4.03448 15.7752 4.28816 15.875 4.55165 15.875H11.4483C11.7118 15.875 11.9655 15.7752 12.1583 15.5956C12.3511 15.416 12.4687 15.1701 12.4874 14.9073L13.1621 5.45833H2.83787ZM6.33331 7.54167C6.67849 7.54167 6.95831 7.82149 6.95831 8.16667V13.1667C6.95831 13.5118 6.67849 13.7917 6.33331 13.7917C5.98813 13.7917 5.70831 13.5118 5.70831 13.1667V8.16667C5.70831 7.82149 5.98813 7.54167 6.33331 7.54167ZM9.66665 7.54167C10.0118 7.54167 10.2916 7.82149 10.2916 8.16667V13.1667C10.2916 13.5118 10.0118 13.7917 9.66665 13.7917C9.32147 13.7917 9.04165 13.5118 9.04165 13.1667V8.16667C9.04165 7.82149 9.32147 7.54167 9.66665 7.54167Z" fill="#566DED"/>
                </svg>
                Clear filters
              </button>}
            </div>
            <Popover.Group className="col-span-5 flex gap-x-12 justify-center border-y border-gray-200 mt-4 lg:hidden">
              <Popover className="relative w-full">
                <Popover.Button className="flex w-full justify-center items-center text-sm font-semibold text-gray-900 focus:outline-none">
                  <div className='flex flex-row py-3 items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#566DED" className="w-5 h-5 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                    </svg>
                    <p className=" text-[#566DED] font-bold text-sm">Filtrar</p>
                  </div>
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute left-1/2 transform -translate-x-1/2 z-20 px-8 w-[400px] max-w-md overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-gray-900/5">
                      <Filters setFiltersApplied={setFiltersApplied} filtersApplied={filtersApplied} setModifiedFilter={setModifiedFilter}/>
                  </Popover.Panel>
                </Transition>
              </Popover>
            </Popover.Group>
          </div>
          <div className='flex flex-row items-center pt-5 pb-2 justify-between'>
            <div className="">
              <div className="text-[#1B2141] text-sm">{totalItems + ' cars found'}</div>
            </div>
            <div className="">
              <div className="hidden lg:flex flex-row text-[#566DED] text-sm items-center gap-1 cursor-pointer"> 
                <svg width="18" height="16" viewBox="0 0 18 16" fill="#566DED" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M5.27528 0.89139L8.60861 4.22472C8.85269 4.4688 8.85269 4.86453 8.60861 5.10861C8.36453 5.35268 7.9688 5.35268 7.72472 5.10861L5.45833 2.84222V11.3333C5.45833 11.6785 5.17851 11.9583 4.83333 11.9583C4.48816 11.9583 4.20833 11.6785 4.20833 11.3333V2.84222L1.94194 5.10861C1.69786 5.35268 1.30214 5.35268 1.05806 5.10861C0.813981 4.86453 0.813981 4.4688 1.05806 4.22472L4.39139 0.89139C4.45131 0.831468 4.52038 0.786256 4.59409 0.755756C4.66779 0.725198 4.74859 0.708332 4.83333 0.708332C4.91808 0.708332 4.99888 0.725198 5.07257 0.755756C5.14629 0.786256 5.21535 0.831468 5.27528 0.89139ZM12.5417 4.66667C12.5417 4.32149 12.8215 4.04167 13.1667 4.04167C13.5118 4.04167 13.7917 4.32149 13.7917 4.66667V13.1578L16.0581 10.8914C16.3021 10.6473 16.6979 10.6473 16.9419 10.8914C17.186 11.1355 17.186 11.5312 16.9419 11.7753L13.6086 15.1086C13.5487 15.1685 13.4796 15.2137 13.4059 15.2442C13.3322 15.2748 13.2514 15.2917 13.1667 15.2917C13.0819 15.2917 13.0011 15.2748 12.9274 15.2442C12.8537 15.2137 12.7846 15.1685 12.7247 15.1086L9.39139 11.7753C9.14731 11.5312 9.14731 11.1355 9.39139 10.8914C9.63547 10.6473 10.0312 10.6473 10.2753 10.8914L12.5417 13.1578V4.66667Z" fill="#566DED"/>
                </svg>
                Most relevant
              </div>
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
          {getCards(layout, data, favorites, setFavorites)}
          {dataPaginated.length !== 0 && <Pagination data={dataFiltered} total={totalItems} setDataPaginated={setDataPaginated}/>}
        </div>
      </main>
    </>
  )
}

export default CarsView