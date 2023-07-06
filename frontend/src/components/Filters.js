import { Disclosure } from '@headlessui/react'
import { useState, useEffect, useRef } from 'react'

export default function Filters({setFiltersApplied, filtersApplied, setModifiedFilter}) {

  const [filters, setFilters] = useState(['brand', 'model', 'year', 'state', 'city', 'transmission', 'price', 'mileage']);
  const [filters2, setFilters2] = useState([{type:'brands', values:[]}, {type:'models', values:[]}, {type:'year', values:[]}, {type:'states', values:[]}, {type:'cities', values:[]}, {type:'transmission', values:[{id:1, name:'Automatic'}, {id:2, name:'Manual'}]}, {type:'price', values:[]}, {type:'mileage', values:[{id:1, value:'35.000 or less'}, {id:2, value:'35.000 to 60.000 km'}, {id:3, value:'60.000 to 80.000 km'}, {id:4, value:'80.000 to 100.000'}, {id:5, value:'100.000 km or more'}]}]);
  const [error, setError] = useState('');

  const prevFiltersApplied = useRef();
  let count = 1; 
  useEffect(() => {
    if(count===1){
      count=2;
      prevFiltersApplied.current = filtersApplied;
      getFilters('brands', '');
      getFilters('models', '');
      getFilters('states', '');
      getFilters('cities', '');
    }
  }, [])

  useEffect(() => {
    if(prevFiltersApplied.current !== filtersApplied){
        if(prevFiltersApplied.current.length < filtersApplied.length){
          let lastFilterApplied = filtersApplied.filter(x => prevFiltersApplied.current.indexOf(x) === -1);
          if(lastFilterApplied[0].label === 'brands'){
            getFilters('models', lastFilterApplied[0].idOption);
            prevFiltersApplied.current = filtersApplied;
          }
          else if(lastFilterApplied[0].label === 'states'){
            getFilters('cities', lastFilterApplied[0].idOption);
            prevFiltersApplied.current = filtersApplied;
          }
          else if(lastFilterApplied[0].label === 'models'){
            getFilters('brands', lastFilterApplied[0].idOption);
            prevFiltersApplied.current = filtersApplied;
          }
          else if(lastFilterApplied[0].label === 'models'){
            getFilters('states', lastFilterApplied[0].idOption);
            prevFiltersApplied.current = filtersApplied;
          }
        }
    }
  }, [filtersApplied])

  async function getFilters(extension, primary){
    try{
        let url = `http://localhost:8000/api/filters/?type=${extension}&primaryFilter=${primary}`;
        var requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        };
        
        const response = await fetch(url, requestOptions);
        
        if (response.ok){
          const responseData = await response.json();

          const updatedFilters2 = [...filters2];
          if(primary === ''){
            const filterIndex = updatedFilters2.findIndex(filter => filter.type === extension);
            if (filterIndex !== -1) {
              updatedFilters2[filterIndex].values = responseData;
            }
          }
          else{
            if(extension === 'brands'){
              updatedFilters2[0].values = responseData;
            }
            else if(extension === 'models'){
              updatedFilters2[1].values = responseData;
            }
            else if(extension === 'states'){
              updatedFilters2[3].values = responseData;
            }
            else if(extension === 'cities'){
              updatedFilters2[4].values = responseData;
            }
          }

          setFilters2(updatedFilters2);
          setError('');

        } else {
          throw new Error('Error, there was a problem while fetching the filters.');
        }
      } catch (error) {
        throw new Error(error.message);
      }
  }

  function getButtons(options, getFilters, setFiltersApplied, filtersApplied, setModifiedFilter){
    const [minimum, setMinimum] = useState('');
    const [maximum, setMaximum] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [mileage, setMileage] = useState('');
    let debounceTimer='';
  
    var newSetOptions = filtersApplied.slice();
    
    function addToSet(opt, type, id){
      var obj = {label:type, value:opt, idOption:id};
      if(!newSetOptions.some(filter => filter.label === obj.label && filter.value === obj.value)){
        newSetOptions.push({label:type, value:opt, idOption:id})
        setFiltersApplied(newSetOptions)
        setModifiedFilter(true)
      }
    } 
  
    function checkGet(idPrimary){
      if(options.type === 'brands'){
        getFilters('models', idPrimary)
      }
      else if(options.type === 'states'){ 
        getFilters('cities', idPrimary)
      }
    }
  
  
    function handleChange(event){ //terminar de ver tema filtros de input
      
      clearTimeout(debounceTimer);
  
      const id = event.target.id;
      const value = event.target.value;
      const regex = /^[0-9\b]+$/;
      if (event.target.value === "" || regex.test(event.target.value)) {
        if(id === 'From'){
          setFrom(value)
        }
        else if( id === 'To'){
          setTo(value)
        }
        else if(id === 'Minimum'){
          setMinimum(value)
        }
        else if(id === 'Maximum'){
          setMaximum(value)
        }
        else{
          setMileage(value)
        }
        
      }
      else{
        if(id === 'Mileage'){
          setMileage(value)
        }
      }
  
      debounceTimer = setTimeout(() => {
       
        const regex = /^[0-9\b]+$/;
        if (event.target.value === "" || regex.test(event.target.value)) {
          if(id === 'From'){
            addToSet(value, options.type, 'From')
          }
          else if( id === 'To'){
            addToSet(value, options.type, 'To')
          }
          else if(id === 'Minimum'){
            addToSet(value, options.type, 'Minimum')
          }
          else if(id === 'Maximum'){
            addToSet(value, options.type, 'Maximum')
          }
          else{
            addToSet(value, options.type, 'Mileage')
          }
          
        }
        else{
          if(id === 'Mileage'){
            addToSet(value, options.type, 'Mileage')
          }
        }
      }, 1000); // Adjust the debounce delay as needed (e.g., 300ms)
    }
    
    
    if(options.type === 'states' || options.type === 'cities' || options.type === 'brands' || options.type === 'models'){
      return options.values.map((option, index) => {
          return <Disclosure.Button key={index} className='text-[#1B2141] pb-4 text-left ml-4' onClick={()=>{addToSet(option.filter_name, options.type, option.filter_id); checkGet(option.filter_id)}}>{option.filter_name}</Disclosure.Button>
      } )
    }
    else if(options.type === 'transmission'){
      return options.values.map((option, index) => {
        return <Disclosure.Button key={index} className='text-[#1B2141] pb-4 text-left ml-4' onClick={()=>{addToSet(option.name, options.type, option.id); checkGet(option.id)}}>{option.name}</Disclosure.Button>
    } )
    }
    else if(options.type === 'year' || options.type === 'price' ){
  
          let leftBox = '';
          let rightBox = '';
          if(options.type === 'year'){
            leftBox = 'From';
            rightBox = 'To';
          }
          else{
            leftBox = 'Minimum';
            rightBox = 'Maximum';
          }
  
          return <div className="flex flex-row ml-2">
              <div className="relative mb-2 mx-2">
                <input
                  id={leftBox}
                  placeholder={leftBox}
                  value={options.type === 'price' ? minimum : from}
                  className="peer relative h-10 w-full border rounded-lg border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white focus:border-indigo-500 focus:outline-none focus-visible:outline-none "
                  onChange={handleChange}
                />
                <label
                  htmlFor={leftBox}
                  className="absolute left-2 -top-2 z-[1] cursor-text  text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm"
                >
                  {leftBox}
                </label>
              </div>
              <div className="relative mb-2 mx-2">
                <input
                  id={rightBox}
                  placeholder={rightBox}
                  value={options.type === 'price' ? maximum : to}
                  className="peer relative h-10 w-full border rounded-lg border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white focus:border-indigo-500 focus:outline-none focus-visible:outline-none "
                  onChange={handleChange}
                />
                <label
                  htmlFor={rightBox}
                  className="absolute left-2 -top-2 z-[1] cursor-text  text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm"
                >
                  {rightBox}
                </label>
              </div>
        </div>
      }
      else{
        return options.values.map((option, optionIdx) => {
          return <div key={option.value} className="flex items-center ml-4 my-2">
              <input type="radio" id={option.value} name="radiobutton" value={option.value}
                    className="form-radio h-4 w-4 accent-indigo-500 p-3 my-2 mr-2" onClick={handleChange}/>
              <label htmlFor={option.value}>{option.value}</label>
          </div>
        })
      }
  }

  return (
    <div className="flex flex-col bg-white mt-3 lg:mt-12 rounded-lg">
      {filters.map((filter, index) => {
        return <Disclosure key={filter}>
          {({ open }) => ( 
            <>
            <Disclosure.Button  className="grid grid-rows-1 grid-flow-col items-center text-left py-5 text-[#1B2141] font-bold">
              {filter[0].toUpperCase() + filter.substring(1)}
              <div className={open ? 'justify-self-end rotate-180 transform' : 'justify-self-end'} >
                <svg width="10" height="6" viewBox="0 0 10 6" fill="#5F647A" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M0.292989 0.293001C0.480517 0.10553 0.734825 0.000214245 0.999989 0.000214268C1.26515 0.000214291 1.51946 0.10553 1.70699 0.293001L4.99999 3.586L8.29299 0.293002C8.48159 0.110844 8.73419 0.0100492 8.99639 0.0123276C9.25859 0.0146059 9.5094 0.119775 9.69481 0.305183C9.88022 0.490591 9.98539 0.741404 9.98766 1.0036C9.98994 1.2658 9.88915 1.5184 9.70699 1.707L5.70699 5.707C5.51946 5.89447 5.26515 5.99979 4.99999 5.99979C4.73482 5.99979 4.48052 5.89447 4.29299 5.707L0.292989 1.707C0.105518 1.51947 0.000202593 1.26516 0.000202616 1C0.000202639 0.734836 0.105518 0.480528 0.292989 0.293001Z" fill="#5F647A"/>
                </svg>
              </div>
            </Disclosure.Button>
            <Disclosure.Panel className="grid grid-cols-1 justify-items-start text-gray-900 text-sm">
              {getButtons(filters2[index], getFilters, setFiltersApplied, filtersApplied, setModifiedFilter)} 
            </Disclosure.Panel>
            <hr/> 
            </>
            )}
        </Disclosure>
      })}
    </div>
  );
}