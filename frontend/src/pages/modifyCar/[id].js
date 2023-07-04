import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router'
import Navbar from 'i/components/Navbar';
import Dropdown from 'i/components/Dropdown';

export default function ModifyCar(){

  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const transmissionOptions = [{id:1, name:'Automatic'}, {id:2, name:'Manual'}];
  const promfinOptions = [{id:true, name:'Yes'}, {id:false, name:'No'}];
  const conditionOptions = [{id:true, name:'New'}, {id:false, name:'Used'}];
  const fuels = [{id:1, name:'Petrol'}, {id:2, name:'Diesel'}, {id:3, name:'Gas'}, {id:4, name:'Bio-Diesel'}, {id:5, name:'Electric'}, {id:6, name:'Other'}];
  const [selectedVersion, setSelectedVersion] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedMileage, setSelectedMileage] = useState("");
  const [dataReceived, setDataReceived] = useState([]);
  const [dataToUse, setDataToUse] = useState("");
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [selectedObservation, setSelectedObservation] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");

  let count = 1; 
  const router = useRouter();
  const { id } = router.query;

  const prevSelectedBrandRef = useRef();
  const prevSelectedModelRef = useRef();
  const prevSelectedStateRef = useRef();
  const prevSelectedCityRef = useRef();
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    if(id && count===1){
      count=2;
      setLoading(true);
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/cars/${id}/`);
          if (response.ok) {
            const data = await response.json();
            setDataReceived(data);
            setDataToUse(JSON.parse(JSON.stringify(data)));
            setSelectedVersion(data.version)
            setSelectedYear(data.year)
            setSelectedPrice(data.price)
            setSelectedMileage(data.mileage)
            setSelectedObservation(data.observation === null ? "" : data.observation)
            setSelectedColor(data.color)
            setSelectedCapacity(data.capacity)

            prevSelectedBrandRef.current = data.brand;
            prevSelectedModelRef.current = data.model;
            prevSelectedStateRef.current = data.state;
            prevSelectedCityRef.current = data.city;

            await getFilters('brands', '');
            await getFilters('models', '');
            await getFilters('states', '');
            await getFilters('cities', '');

          } else {
            throw new Error('Error, there was a problem while fetching the cars.');
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
          isFirstLoadRef.current = false;
        }
      };

      fetchData();

    }
  }, [id]);

  useEffect(() => {
    if(!isFirstLoadRef.current){
      console.log(prevSelectedBrandRef.current, selectedBrand)
      if(prevSelectedBrandRef.current.id !== selectedBrand.id){
        console.log('cambio brand')
        getFilters('models', selectedBrand.id);
        prevSelectedBrandRef.current = selectedBrand;
      }
      else if(prevSelectedModelRef.current.id !== selectedModel.id){
        getFilters('brands', selectedModel.name);
        prevSelectedModelRef.current = selectedModel;
      }
      else if(prevSelectedStateRef.current.id !== selectedState.id){
        getFilters('cities', selectedState.id);
        prevSelectedStateRef.current = selectedState;
      }   
      else if(prevSelectedCityRef.current.id !== selectedCity.id){
        getFilters('states', selectedCity.name);
        prevSelectedCityRef.current = selectedCity;
      }
    }
  }, [selectedBrand, selectedModel, selectedState, selectedCity])


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
    let data = {};
    
    for(let newData in dataToUse){ 
      if(typeof(dataToUse[newData])==='object' && newData !== 'image' && dataToUse[newData] !== null){
          if(dataToUse[newData].id !== dataReceived[newData].id){
            let name = newData + '_id';
            data[name]=dataToUse[newData].id;
          }
      }
      else if(newData ==='year' || newData ==='version' || newData ==='price' || newData ==='mileage' || newData === 'observation' || newData === 'color' || newData === 'capacity'){
          if(newData === 'year'){
            if(selectedYear.toString().localeCompare(dataReceived[newData].toString())){
              data[newData]=selectedYear;
            }
          }
          else if(newData === 'version'){
            if(selectedVersion.localeCompare(dataReceived[newData].toString())){
              data[newData]=selectedVersion;
            }
          }
          else if(newData === 'price'){
            if(selectedPrice.localeCompare(dataReceived[newData].toString())){
              data[newData]=selectedPrice;
            }
          }
          else if(newData === 'mileage'){
            if(selectedMileage===dataReceived[newData].toString()){
              data[newData]=selectedMileage;
            }
          }
          else if(newData === 'observation'){
            if(dataReceived[newData] !== null && selectedObservation!== ""){
              if(selectedObservation.localeCompare(dataReceived[newData].toString())){
                data[newData]=selectedObservation;
              }
            }
            else if(dataReceived[newData] !== null || selectedObservation!== ""){
              if(dataReceived[newData] === null){
                data[newData]=selectedObservation;
              }
              else{
                data[newData]=null;
              }
            }
          }
          else if(newData === 'color'){
            if(selectedColor.localeCompare(dataReceived[newData].toString())){
              data[newData]=selectedColor;
            }
          }
          else if(newData === 'capacity'){
            if(selectedCapacity.localeCompare(dataReceived[newData].toString())){
              data[newData]=selectedCapacity;
            }
          }
      }
      else{ 
          if(dataToUse[newData] !== dataReceived[newData]){
              data[newData]=dataToUse[newData];
          }
      }
    }

    return data;
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    let url = `http://localhost:8000/api/cars/modify/${id}/`;
    let method = 'PUT';
    let data = formatData();

    var requestOptions = {
      method: method,
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    };
    console.log('data a mandar', data);
    try {
      const response = await fetch(url, requestOptions);
      if (response.ok) {
        router.push(`/carView/${id}/`);
        setError('');
      } else {
        throw new Error('Error, there was a problem while modifying the car.');
      }
    } catch (error) {
      setError(error.message);
    } 

  };

  function getSelectedOptionFuel(){
    for(let index in fuels){
      if(fuels[index].name === dataToUse.fuel){
        return fuels[index]
      }
    }
  }

  return (
    <>
      <Navbar></Navbar>
      <div className="flex flex-1 flex-col px-6 py-12 lg:px-8">
        <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Modify Car
        </h2>
        <h3 className="text-sm leading-9 tracking-tight text-gray-900">
            All fields with an * are Required
        </h3>
        {dataToUse !== "" && <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mt-5 md:mt-10 space-y-6 px-6 shadow-md rounded-lg pb-5">
           <div className='mt-6'>
              <Dropdown label='Brand' selectedOption={dataToUse.brand} allData={dataToUse} setSelectedOption={setDataToUse} allOptions={brands} updateFilter={setSelectedBrand}/>
          </div>
          <div>
              <Dropdown label='Model' selectedOption={dataToUse.model} allData={dataToUse} setSelectedOption={setDataToUse} allOptions={models} updateFilter={setSelectedModel}/>
          </div>
          <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">Version</label>
              <div className="mt-2">
              <input name="version" required value={selectedVersion} className="block w-full rounded-lg border py-1.5 pl-3 text-gray-900 text-sm md:text-md shadow-sm border-gray-300 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:leading-6"
                  onChange={(e)=>setSelectedVersion(e.target.value)}/>
              </div>
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Year</label>
            <div className="mt-2">
              <input name="year" required value={selectedYear} className="block w-full rounded-lg border py-1.5 pl-3 text-gray-900 text-sm md:text-md shadow-sm border-gray-300 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:text-sm sm:leading-6"
                onChange={(e)=>setSelectedYear(e.target.value)} />
            </div>
          </div>
          <div className='flex flex-row col-span-2 gap-4 md:col-span-1'>
            <div className='w-full'>
            <Dropdown label='Transmission' selectedOption={dataToUse.transmission === 'Automatic' ? transmissionOptions[0] : transmissionOptions[1]} allData={dataToUse} setSelectedOption={setDataToUse} allOptions={transmissionOptions} updateFilter={''}/>
            </div>
            <div className='w-full'>
            <Dropdown label='Condition' selectedOption={dataToUse.condition === 'New' ? conditionOptions[0] : conditionOptions[1]} allData={dataToUse} setSelectedOption={setDataToUse} allOptions={conditionOptions} updateFilter={''}/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Price</label>
            <div className="mt-2">
              <input name="price" required value={selectedPrice} className="block w-full rounded-lg border py-1.5 pl-3 text-gray-900 text-sm md:text-md shadow-sm border-gray-300 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:text-sm sm:leading-6"
                onChange={(e)=>setSelectedPrice(e.target.value)}/>
            </div>
          </div>
          <div className='flex flex-row col-span-2 gap-4 md:col-span-1'>
            <div className='w-full'>
              <label className="block text-sm font-medium leading-6 text-gray-900">{"Mileage (in km)"}</label>
              <div className="mt-2">
                <input name="mileage" required value={selectedMileage} className="block w-full rounded-lg border py-1.5 pl-3 text-gray-900 text-sm md:text-md shadow-sm border-gray-300 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:text-sm sm:leading-6"
                  onChange={(e)=>setSelectedMileage(e.target.value)}/>
              </div>
            </div>
            <div className='w-full'>
                <Dropdown label='Fuel' selectedOption={getSelectedOptionFuel} allData={dataToUse} setSelectedOption={setDataToUse} allOptions={fuels} updateFilter={''}/>
            </div>
          </div>
          <div className='flex flex-row col-span-2 gap-4 md:col-span-1'>
            <div className='w-full'>
              <Dropdown label='Promoted' selectedOption={dataToUse.promoted ? promfinOptions[0] : promfinOptions[1]} allData={dataToUse} setSelectedOption={setDataToUse} allOptions={promfinOptions} updateFilter={''}/>
            </div>
            <div className='w-full'>
              <Dropdown label='Financing' selectedOption={dataToUse.financing ? promfinOptions[0] : promfinOptions[1]} allData={dataToUse} setSelectedOption={setDataToUse} allOptions={promfinOptions} updateFilter={''}/>
            </div>
          </div>
          <div>
              <Dropdown label='State' selectedOption={dataToUse.state} allData={dataToUse} setSelectedOption={setDataToUse} allOptions={states} updateFilter={setSelectedState}/>
          </div>
          <div>
              <Dropdown label='City' selectedOption={dataToUse.city} allData={dataToUse} setSelectedOption={setDataToUse} allOptions={cities} updateFilter={setSelectedCity}/>
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Color</label>
            <div className="mt-2">
              <input name="color" required value={selectedColor} className="block w-full rounded-lg border py-1.5 pl-3 text-gray-900 text-sm md:text-md shadow-sm border-gray-300 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:text-sm sm:leading-6"
                onChange={(e)=>setSelectedColor(e.target.value)}/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">{"Capacity (# of people)"}</label>
            <div className="mt-2">
              <input name="capacity" required value={selectedCapacity} className="block w-full rounded-lg border py-1.5 pl-3 text-gray-900 text-sm md:text-md shadow-sm border-gray-300 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:text-sm sm:leading-6"
                onChange={(e)=>setSelectedCapacity(e.target.value)}/>
            </div>
          </div>
          <div className='col-start-1 col-span-2'>
            <label className="block text-sm font-medium leading-6 text-gray-900">Observation/Comments</label>
            <div className="mt-2">
              <textarea name="observation" required rows={2} value={selectedObservation} className="block w-full h-16 rounded-lg border py-1.5 pl-3 text-gray-900 text-sm md:text-md shadow-sm border-gray-300 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:text-sm sm:leading-6"
                onChange={(e)=>setSelectedObservation(e.target.value)}/>
            </div>
          </div>
          <div className='flex flex-row gap-2 col-span-2 md:col-end-2 md:col-span-1'>
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
        </div>}
      </div>
  </>
  );
};