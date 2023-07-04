import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'

export default function Dropdown({label, selectedOption, allData, setSelectedOption, allOptions, updateFilter}) {
  const [selectedOptionAux, setSelectedOptionAux] = useState(selectedOption);

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  useEffect(() => {

    let dataux= allData;
    if(allData !== null && updateFilter !== null && selectedOptionAux !== null && selectedOptionAux !== undefined){
        if(label === 'Financing' || label === 'Promoted'){
            dataux[label.toLowerCase()] = selectedOptionAux.id;
            setSelectedOption(dataux);
        }
        else if(label === 'Transmission' || label === 'Condition' || label==='Fuel'){
            dataux[label.toLowerCase()] = selectedOptionAux.name;
            setSelectedOption(dataux);
        }
        else{
            console.log(selectedOptionAux);
            dataux[label.toLowerCase()] = selectedOptionAux;
            updateFilter(selectedOptionAux);
            setSelectedOption(dataux);
        }
    }
    else{
        setSelectedOption(selectedOptionAux)
    }

  }, [selectedOptionAux])
    

  return (
    <Listbox value={selectedOptionAux} onChange={setSelectedOptionAux}>
    <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">{label}</Listbox.Label>
    <div className="relative mt-2">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 text-sm md:text-md">
            {selectedOptionAux === null || selectedOptionAux === undefined ? 
                <span className="text-gray-400">Select an option</span>
             : 
             selectedOptionAux.name}
            <span className="absolute inset-y-0 right-1 flex items-center pr-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </span>
        </Listbox.Button>
        <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {allOptions.length === 0 ? (
                    <Listbox.Option disabled>
                        <div className="flex items-center">
                            <span className='font-normal ml-3 py-1 text-gray-400'>
                                No options found
                            </span>
                        </div>
                    </Listbox.Option>) : (
                    allOptions.map((option) => (
                    <Listbox.Option
                        key={'option-' + (label === 'Brand' || label === 'Model' || label === 'State' || label === 'City') ? option.filter_id : option.id}
                        className={({ active }) =>
                        classNames(
                            active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-3 pr-9'
                        )}
                        value={(label === 'Brand' || label === 'Model' || label === 'State' || label === 'City') ? {id:option.filter_id, name:option.filter_name} : option}
                    >
                        {({ selected, active }) => (
                        <>
                            <div className="flex items-center">
                            <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'text-sm ml-3 block truncate')}>
                                {(label === 'Brand' || label === 'Model' || label === 'State' || label === 'City') ? option.filter_name : option.name}
                            </span>
                            </div>
                        </>)}
                    </Listbox.Option>
                )))}
        </Listbox.Options>
        </Transition>
    </div>
    </Listbox>
  )
}