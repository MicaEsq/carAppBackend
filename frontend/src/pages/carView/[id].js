import { useState, useEffect } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/router';
import Badge from 'i/components/Badge';
import Carousel from 'i/components/Carousel';
import { modifyFavorites } from 'i/reusableFunctions/modifyFavorites';
import Navbar from 'i/components/Navbar';
import Error404 from 'i/components/Error404';
//import { StarIcon } from '@heroicons/react/20/solid'
import { RadioGroup } from '@headlessui/react'

const product = {
  name: 'Basic Tee 6-Pack',
  price: '$192',
  href: '#',
  breadcrumbs: [
    { id: 1, name: 'Men', href: '#' },
    { id: 2, name: 'Clothing', href: '#' },
  ],
  images: [
    {
      src: 'https://tailwindui.com/img/ecommerce-images/product-page-02-secondary-product-shot.jpg',
      alt: 'Two each of gray, white, and black shirts laying flat.',
    },
    {
      src: 'https://tailwindui.com/img/ecommerce-images/product-page-02-tertiary-product-shot-01.jpg',
      alt: 'Model wearing plain black basic tee.',
    },
    {
      src: 'https://tailwindui.com/img/ecommerce-images/product-page-02-tertiary-product-shot-02.jpg',
      alt: 'Model wearing plain gray basic tee.',
    },
    {
      src: 'https://tailwindui.com/img/ecommerce-images/product-page-02-featured-product-shot.jpg',
      alt: 'Model wearing plain white basic tee.',
    },
  ],
  colors: [
    { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
    { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
    { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' },
  ],
  sizes: [
    { name: 'XXS', inStock: false },
    { name: 'XS', inStock: true },
    { name: 'S', inStock: true },
    { name: 'M', inStock: true },
    { name: 'L', inStock: true },
    { name: 'XL', inStock: true },
    { name: '2XL', inStock: true },
    { name: '3XL', inStock: true },
  ],
  description:
    'The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: "Black". Need to add an extra pop of color to your outfit? Our white tee has you covered.',
  highlights: [
    'Hand cut and sewn locally',
    'Dyed with our proprietary colors',
    'Pre-washed & pre-shrunk',
    'Ultra-soft 100% cotton',
  ],
  details:
    'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
}
const reviews = { href: '#', average: 4, totalCount: 117 }

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function CarView() {
  const [carData, setCarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [varaux, setVarAux] = useState();
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[2])
  const [images, setImages] = useState(['/images/landscape.jpg', '/images/landscape2.jpg', '/images/landscape3.jpg', '/images/landscape4.jpg']);


  let count = 1; 
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if(id && count === 1){
      count = 2;
      setLoading(true);
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/cars/${id}/`, {method: 'GET', headers: { 'Content-Type': 'application/json'}});
          if (response.ok) {
            const data = await response.json();
            setCarData(data);
            setLoading(false);
          } else {
            throw new Error('Error, there was a problem while fetching the cars.');
          }
        } catch (error) {
          setError(error.message);
          setLoading(false);
        } 
      };

      fetchData();
    }
  }, [router.query]);

  function handleDeleteCar(){ 
    setLoading(true);

    let url = `http://localhost:8000/api/cars/delete/${id}/`;

    var requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json'},
    };
    
    fetch(url, requestOptions)
    .then(response => {
        if (response.ok){
            return response.json();
        }
        else{
            return response.text().then(text => {throw new Error(text)});
        }
    })
    .then((response) => {
      router.push('/');
      setLoading(false);
    })
    .catch((error) => {
      setError(error.message);
    });
  };

  const handleRedirection =()=>{
    router.push(`/modifyCar/${carData.id}`)
  }

  return (
     <>
    <Navbar></Navbar>
    {carData.length !== 0 ? <div>
      <nav aria-label="Breadcrumb">
        <ol role="list" className="flex max-w-2xl items-center space-x-2 mx-6 md:mx-4 py-6 lg:max-w-7xl">
          <li key={'cars-key-breadcrumb'}>
            <div className="flex items-center">
              <a href={'/'} className="mr-2 text-sm font-medium text-gray-900">{'Cars'}</a>
              <svg width={16} height={20} viewBox="0 0 16 20" fill="currentColor" aria-hidden="true" className="h-5 w-4 text-gray-300">
                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
              </svg>
            </div>
          </li>
          <li className="text-sm">
            <p aria-current="page" className="font-medium text-gray-500">
              {carData.brand.name + ' ' + carData.model.name}
            </p>
          </li>
        </ol>
      </nav>
      <div className="flex flex-col md:flex-row bg-white px-10 py-10 mx-8 mb-10 rounded-lg shadow-lg">
        <div className='w-full max-w-4xl md:pr-10'>
          <Carousel image={carData.image} arrowsConstantVisibility={true}></Carousel>
        </div>
        <div className="w-full md:w-3/4 pt-10 lg:grid lg:max-w-6xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
          <div className="pb-5 w-full lg:col-span-3 lg:border-b lg:border-gray-200 lg:pr-8">
            <div className='flex flex-row items-center justify-between'>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">{carData.brand.name + ' ' + carData.model.name + ' - ' + carData.version}</h1>
              <div className='flex flex-row gap-2'>
                <svg onClick={handleRedirection} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
                <svg onClick={handleDeleteCar} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>
            </div>
            <p className="text-3xl tracking-tight text-gray-900">{'$ ' + carData.price}</p>
          </div>
          <div className="w-full lg:col-span-3 lg:col-start-1 lg:pb-16 lg:pr-8 lg:pt-6">
            <div>
              <h2 className="text-md md:text-lg font-bold text-gray-900">Details</h2>
              <div className='flex flex-row ml-2 md:ml-5 md:gap-20'>
                <ul role="list" className="list-disc space-y-2 pl-4 mt-4 text-sm md:text-md">
                  <li className="text-gray-400">
                    <span className="text-gray-700">Condition: {carData.condition}</span>
                  </li>
                  <li className="text-gray-400">
                    <span className="text-gray-700">Mileage: {carData.mileage} km</span>
                  </li>
                  <li className="text-gray-400">
                    <span className="text-gray-700">Transmission: {carData.transmission}</span>
                  </li>
                  <li className="text-gray-400">
                    <span className="text-gray-700 flex items-center">Financing: {carData.financing ? 'Yes' : 'No'}</span>
                    {carData.financing  && <Link href="" className="flex flex-row mt-1 items-center text-xs md:text-md font-bold text-[#566DED]">
                      <svg width="15" height="16" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1 hidden md:block">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0.874969 3.16667C0.874969 1.90101 1.90098 0.875 3.16664 0.875H11.5C12.7656 0.875 13.7916 1.90101 13.7916 3.16667V6.5C13.7916 6.84518 13.5118 7.125 13.1666 7.125C12.8215 7.125 12.5416 6.84518 12.5416 6.5V3.16667C12.5416 2.59137 12.0753 2.125 11.5 2.125H3.16664C2.59134 2.125 2.12497 2.59137 2.12497 3.16667V14.8333C2.12497 15.4086 2.59134 15.875 3.16664 15.875H9.08331C9.42849 15.875 9.70831 16.1548 9.70831 16.5C9.70831 16.8452 9.42849 17.125 9.08331 17.125H3.16664C1.90098 17.125 0.874969 16.099 0.874969 14.8333V3.16667ZM4.20831 4.83333C4.20831 4.48816 4.48813 4.20833 4.83331 4.20833H9.8333C10.1785 4.20833 10.4583 4.48816 10.4583 4.83333C10.4583 5.17851 10.1785 5.45833 9.8333 5.45833H4.83331C4.48813 5.45833 4.20831 5.17851 4.20831 4.83333ZM4.20831 8.16667C4.20831 7.82149 4.48813 7.54167 4.83331 7.54167H4.84164C5.18682 7.54167 5.46664 7.82149 5.46664 8.16667C5.46664 8.51184 5.18682 8.79167 4.84164 8.79167H4.83331C4.48813 8.79167 4.20831 8.51184 4.20831 8.16667ZM6.7083 8.16667C6.7083 7.82149 6.98813 7.54167 7.3333 7.54167H7.34164C7.68682 7.54167 7.96664 7.82149 7.96664 8.16667C7.96664 8.51184 7.68682 8.79167 7.34164 8.79167H7.3333C6.98813 8.79167 6.7083 8.51184 6.7083 8.16667ZM9.2083 8.16667C9.2083 7.82149 9.48812 7.54167 9.8333 7.54167H9.84164C10.1868 7.54167 10.4666 7.82149 10.4666 8.16667C10.4666 8.51184 10.1868 8.79167 9.84164 8.79167H9.8333C9.48812 8.79167 9.2083 8.51184 9.2083 8.16667ZM4.20831 10.6667C4.20831 10.3215 4.48813 10.0417 4.83331 10.0417H4.84164C5.18682 10.0417 5.46664 10.3215 5.46664 10.6667C5.46664 11.0118 5.18682 11.2917 4.84164 11.2917H4.83331C4.48813 11.2917 4.20831 11.0118 4.20831 10.6667ZM6.7083 10.6667C6.7083 10.3215 6.98813 10.0417 7.3333 10.0417H7.34164C7.68682 10.0417 7.96664 10.3215 7.96664 10.6667C7.96664 11.0118 7.68682 11.2917 7.34164 11.2917H7.3333C6.98813 11.2917 6.7083 11.0118 6.7083 10.6667ZM4.20831 13.1667C4.20831 12.8215 4.48813 12.5417 4.83331 12.5417H4.84164C5.18682 12.5417 5.46664 12.8215 5.46664 13.1667C5.46664 13.5118 5.18682 13.7917 4.84164 13.7917H4.83331C4.48813 13.7917 4.20831 13.5118 4.20831 13.1667ZM6.7083 13.1667C6.7083 12.8215 6.98813 12.5417 7.3333 12.5417H7.34164C7.68682 12.5417 7.96664 12.8215 7.96664 13.1667C7.96664 13.5118 7.68682 13.7917 7.34164 13.7917H7.3333C6.98813 13.7917 6.7083 13.5118 6.7083 13.1667Z" fill="#566DED"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M13.0833 8.375C13.4285 8.375 13.7083 8.65482 13.7083 9V9.17434C14.4317 9.29012 15.0847 9.60653 15.5046 10.0903C15.6927 10.307 15.709 10.624 15.5442 10.8589C15.3795 11.0938 15.0759 11.1864 14.8081 11.0833L13.7083 10.6601V12.1741C14.1987 12.2524 14.6508 12.4224 15.021 12.6692C15.54 13.0151 15.9583 13.5617 15.9583 14.25C15.9583 14.9383 15.54 15.4849 15.021 15.8308C14.6508 16.0776 14.1987 16.2476 13.7083 16.3259V16.5C13.7083 16.8452 13.4285 17.125 13.0833 17.125C12.7381 17.125 12.4583 16.8452 12.4583 16.5V16.3257C11.735 16.2099 11.0819 15.8935 10.662 15.4097C10.474 15.193 10.4576 14.876 10.6224 14.6411C10.7871 14.4062 11.0907 14.3136 11.3585 14.4167L12.4583 14.8399V13.3259C11.9679 13.2476 11.5158 13.0776 11.1456 12.8308C10.6266 12.4849 10.2083 11.9383 10.2083 11.25C10.2083 10.5617 10.6266 10.0151 11.1456 9.66917C11.5158 9.42239 11.9679 9.25243 12.4583 9.17411V9C12.4583 8.65482 12.7381 8.375 13.0833 8.375ZM12.4583 10.448C12.2135 10.5077 12.0029 10.6 11.8389 10.7093C11.5436 10.9061 11.4583 11.1095 11.4583 11.25C11.4583 11.3905 11.5436 11.5939 11.8389 11.7907C12.0029 11.9 12.2135 11.9923 12.4583 12.052V10.448ZM13.7083 13.448V15.052C13.9531 14.9923 14.1637 14.9 14.3277 14.7907C14.623 14.5939 14.7083 14.3905 14.7083 14.25C14.7083 14.1095 14.623 13.9061 14.3277 13.7093C14.1637 13.6 13.9531 13.5077 13.7083 13.448Z" fill="#566DED"/>
                      </svg>
                      Simulate financing</Link>}
                  </li>
                </ul>
                <ul role="list" className="list-disc space-y-2 mt-4 ml-14 text-sm md:text-md">
                  <li className="text-gray-400">
                    <span className="text-gray-700">Year: {carData.year}</span>
                  </li>
                  <li className="text-gray-400">
                    <span className="text-gray-700">Color: {carData.color}</span>
                  </li>
                  <li className="text-gray-400">
                    <span className="text-gray-700">Capacity: {carData.capacity} people</span>
                  </li>
                  <li className="text-gray-400">
                    <span className="text-gray-700">Type of fuel: {carData.fuel}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-5 md:mt-10 md:pb-5 w-full lg:border-b lg:border-gray-200">
              <h2 className="text-md md:text-lg font-bold text-gray-900">Observations</h2>
                <p className='text-sm md:text-md font-medium mt-2 text-gray-700'>{carData.observation ? carData.observation : 'None'}</p> 
            </div>
            <div className="items-center justify-center lg:row-span-3">
              <div className="flex flex-row gap-3">
                <button
                  type="submit"
                  className="mt-10 flex w-full items-center justify-center rounded-md border border-indigo-500 text-indigo-500 px-8 py-3 text-sm md:text-base font-medium hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add to favorites
                </button>
                <button
                  type="submit"
                  className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-sm md:text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Contact us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> : <div className='flex flex-col justify-center items-center'>
    <Error404 message={`There aren't any cars with id: ${id}`}/>
    <div className='mt-5'>
        <button
          type="submit"
          className="flex justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={()=>router.push('/')}
        >
          Go back to catalogue
        </button>
    </div>
    </div>}
    
    </>
  );
}

export default CarView