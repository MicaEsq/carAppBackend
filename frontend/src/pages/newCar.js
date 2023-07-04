import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router'
import Navbar from 'i/components/Navbar';
import Dropdown from 'i/components/Dropdown';

export default function NewCar(){

  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedTransimission, setSelectedTransimission] = useState(null);
  const [selectedPromoted, setSelectedPromoted] = useState(null);
  const [selectedFinancing, setSelectedFinancing] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedMileage, setSelectedMileage] = useState("");
  const [selectedObservation, setSelectedObservation] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState("");
  const [selectedFuel, setSelectedFuel] = useState(null);
  const transmissionOptions = [{id:1, name:'Automatic'}, {id:2, name:'Manual'}];
  const promfinOptions = [{id:true, name:'Yes'}, {id:false, name:'No'}];
  const conditionOptions = [{id:true, name:'New'}, {id:false, name:'Used'}];
  const fuels = [{id:1, name:'Petrol'}, {id:2, name:'Diesel'}, {id:3, name:'Gas'}, {id:4, name:'Bio-Diesel'}, {id:5, name:'Electric'}, {id:6, name:'Other'}];

  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const prevSelectedBrandRef = useRef();
  const prevSelectedModelRef = useRef();
  const prevSelectedStateRef = useRef();
  const prevSelectedCityRef = useRef();

  useEffect(() => {

      getFilters('brands', '');
      prevSelectedBrandRef.current = selectedBrand;
      getFilters('models', '');
      prevSelectedModelRef.current = selectedModel;
      getFilters('states', '');
      prevSelectedStateRef.current = selectedState;
      getFilters('cities', '');
      prevSelectedCityRef.current = selectedCity;

  }, [])

  useEffect(() => {
      if(prevSelectedBrandRef.current !== selectedBrand){
          getFilters('models', selectedBrand.id);
          prevSelectedBrandRef.current = selectedBrand;
      }
      else if(prevSelectedStateRef.current !== selectedState){
          getFilters('cities', selectedState.id);
          prevSelectedStateRef.current = selectedState;
      }        
      else if(prevSelectedModelRef.current !== selectedModel){
          getFilters('brands', selectedModel.name);
          prevSelectedModelRef.current = selectedModel;
      }
      else if(prevSelectedCityRef.current !== selectedCity){
        getFilters('states', selectedCity.name);
        prevSelectedCityRef.current = selectedCity;
      } 
  }, [selectedBrand, selectedState, selectedModel, selectedCity])

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

          if (extension === 'brands') {
            setBrands(responseData);
          } else if (extension === 'models') {
            setModels(responseData);
          } else if (extension === 'states') {
            setStates(responseData);
          } else if (extension === 'cities') {
            setCities(responseData);
          }

        } else {
          throw new Error('Error, there was a problem while fetching the filters.');
        }
      } catch (error) {
        throw new Error(error.message);
      }
  }

  function formatData(){

    let result = {
      brand_id: selectedBrand !== null ? selectedBrand.id : null,
      model_id: selectedModel !== null ? selectedModel.id : null,
      state_id: selectedState !== null ? selectedState.id : null,
      city_id: selectedCity !== null ? selectedCity.id : null,
      year: selectedYear !== "" ? selectedYear : null,
      version: selectedVersion !== "" ? selectedVersion : null,
      transmission: selectedTransimission !== null ? selectedTransimission.name : null,
      condition: selectedCondition !== null ? selectedCondition.name : null,
      price: selectedPrice !== "" ? selectedPrice : null,
      mileage: selectedMileage !== "" ? selectedMileage : null,
      promoted: selectedPromoted !== null ? selectedPromoted.id : null,
      financing: selectedFinancing !== null ? selectedFinancing.id : null,
      observation: selectedObservation !== "" ? selectedObservation : null,
      color: selectedColor !== "" ? selectedColor : null,
      capacity: selectedCapacity !== "" ? selectedCapacity : null,
      fuel: selectedFuel !== null ? selectedFuel.name : null,
    };
  
    return result;
  }
    
  const handleChange=(event)=>{
    if(event.target.name === 'year'){
      setSelectedYear(event.target.value);
    }
    else if(event.target.name === 'version'){
      setSelectedVersion(event.target.value);
    }
    else if(event.target.name === 'price'){
      setSelectedPrice(event.target.value);
    }
    else if(event.target.name === 'mileage'){
      setSelectedMileage(event.target.value);
    }
    else if(event.target.name === 'observation'){
      setSelectedObservation(event.target.value);
    }
    else if(event.target.name === 'color'){
      setSelectedColor(event.target.value);
    }
    else if(event.target.name === 'capacity'){
      setSelectedCapacity(event.target.value);
    }
  }
  

  const handleSubmit = (event) => {
    event.preventDefault();
    
    let url = 'http://localhost:8000/api/cars/create/';
    let method = 'POST';
    let data = formatData();

    var requestOptions = {
      method: method,
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    };
    
    fetch(url, requestOptions)
    .then(response => {
        if (response.ok){
            return Promise.all([response.ok, response.json()]);
        }
        else{
            return response.text().then(text => {throw new Error(text)});
        }
    })
    .then(([responseOk, body]) => {
        router.push(`/carView/${body.id}`);
        setError('');
    })
    .catch((error) => {
        setError(error.message);
    });
  };

  

  return (
    <>
      <Navbar></Navbar>
      <div className="flex flex-1 flex-col px-6 py-12 lg:px-8">
        <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create a new Car
        </h2>
        <h3 className="text-sm leading-9 tracking-tight text-gray-900">
            All fields with an * are Required
        </h3>
        <div className="grid gap-4 grid-col-2 md:grid-cols-4 mt-5 md:mt-10 space-y-6 px-6 shadow-md rounded-lg pb-5">
          <div className='mt-6'>
              <Dropdown label='Brand' selectedOption={selectedBrand} allData={null} setSelectedOption={setSelectedBrand} allOptions={brands} updateFilter={null}/>
          </div>
          <div className=''>
              <Dropdown label='Model' selectedOption={selectedModel} allData={null} setSelectedOption={setSelectedModel} allOptions={models} updateFilter={null}/>
          </div>
          <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">Version</label>
              <div className="mt-2">
              <input name="version" required className="block w-full rounded-lg border py-1.5 pl-3 text-gray-900 shadow-sm border-gray-300 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:text-sm sm:leading-6"
                  onChange={handleChange}/>
              </div>
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Year</label>
            <div className="mt-2">
              <input name="year" required className="block w-full rounded-lg border py-1.5 pl-3 text-gray-900 shadow-sm border-gray-300 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:text-sm sm:leading-6"
                onChange={handleChange} />
            </div>
          </div>
          <div className='flex flex-row col-span-2 gap-4 md:col-span-1'>
            <div className='w-full'>
              <Dropdown label='Transmission' selectedOption={selectedTransimission} allData={null} setSelectedOption={setSelectedTransimission} allOptions={transmissionOptions} updateFilter={null}/>
            </div>
            <div className='w-full'>
              <Dropdown label='Condition' selectedOption={selectedCondition} allData={null} setSelectedOption={setSelectedCondition} allOptions={conditionOptions} updateFilter={null}/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Price</label>
            <div className="mt-2">
              <input name="price" required className="block w-full rounded-lg border py-1.5 pl-3 text-gray-900 shadow-sm border-gray-300 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:text-sm sm:leading-6"
                onChange={handleChange}/>
            </div>
          </div>
          <div className='flex flex-row col-span-2 gap-4 md:col-span-1'>
            <div className='w-full'>
              <label className="block text-sm font-medium leading-6 text-gray-900">{"Mileage (in km)"}</label>
              <div className="mt-2">
                <input name="mileage" required className="block w-full rounded-lg border py-1.5 pl-3 text-gray-900 shadow-sm border-gray-300 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:text-sm sm:leading-6"
                  onChange={handleChange}/>
              </div>
            </div>
            <div className='w-full'>
                <Dropdown label='Fuel' selectedOption={selectedFuel} allData={null} setSelectedOption={setSelectedFuel} allOptions={fuels} updateFilter={''}/>
            </div>
          </div>
          <div className='flex flex-row col-span-2 gap-4 md:col-span-1'>
            <div className='w-full'>
              <Dropdown label='Promoted' selectedOption={selectedPromoted} allData={null} setSelectedOption={setSelectedPromoted} allOptions={promfinOptions} updateFilter={null}/>
            </div>
            <div className='w-full'>
              <Dropdown label='Financing' selectedOption={selectedFinancing} allData={null} setSelectedOption={setSelectedFinancing} allOptions={promfinOptions} updateFilter={null}/>
            </div>
          </div>
          <div>
              <Dropdown label='State' selectedOption={selectedState} allData={null} setSelectedOption={setSelectedState} allOptions={states} updateFilter={null}/>
          </div>
          <div>
              <Dropdown label='City' selectedOption={selectedCity} allData={null} setSelectedOption={setSelectedCity} allOptions={cities} updateFilter={null}/>
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Color</label>
            <div className="mt-2">
              <input name="color" required value={selectedColor} className="block w-full rounded-lg border py-1.5 pl-3 text-gray-900 shadow-sm border-gray-300 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:text-sm sm:leading-6"
                onChange={(e)=>setSelectedColor(e.target.value)}/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">{"Capacity (# of people)"}</label>
            <div className="mt-2">
              <input name="capacity" required value={selectedCapacity} className="block w-full rounded-lg border py-1.5 pl-3 text-gray-900 shadow-sm border-gray-300 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:text-sm sm:leading-6"
                onChange={(e)=>setSelectedCapacity(e.target.value)}/>
            </div>
          </div>
          <div className='col-start-1 col-span-2'>
            <label className="block text-sm font-medium leading-6 text-gray-900">Observation/Comments</label>
            <div className="mt-2">
              <textarea name="observation" required rows={2} value={selectedObservation} className="block w-full h-16 rounded-lg border py-1.5 pl-3 text-gray-900 shadow-sm border-gray-300 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:text-sm sm:leading-6"
                onChange={(e)=>setSelectedObservation(e.target.value)}/>
            </div>
          </div>
          <div className='flex flex-row gap-2 col-span-2 md:col-end-2 md:col-span-1 '>
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg px-3 pt-2 pb-1 text-sm font-semibold leading-6 text-indigo-500 border border-indigo-500 shadow-sm hover:bg-indigo-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={()=>router.push(`/carView/${id}`)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg bg-indigo-500 px-3 pt-2 pb-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      
        </div>
  </>
  );
};
