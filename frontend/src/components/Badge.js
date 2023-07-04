
function deleteFilter(data, setFiltersApplied, filtersApplied, setModifiedFilter){
    var newOptions = [...filtersApplied];
    const indexOfObject = newOptions.findIndex(object => {
        return object.label === data.label && object.value === data.value;
    });
    newOptions.splice(indexOfObject, 1);
    setFiltersApplied(newOptions);
    setModifiedFilter(true);
}

export default function Badge({data, type, setFiltersApplied, filtersApplied, setModifiedFilter}) {
    return(
        <div className={type === 'card-details' ? "text-xs bg-[#EBECF5] text-[#1B2141] rounded-full py-1 px-2 mr-2" : "flex flex-row items-center gap-2 text-sm text-[#566DED] border border-[#566DED] rounded-full py-1 px-2 mr-2"}>
            <p className={type === 'filters-applied' ? "pl-1" : ""}>{type === 'card-details' ? data : data.value}</p>
            {type === "filters-applied" && 
                <div onClick={() => deleteFilter(data, setFiltersApplied, filtersApplied, setModifiedFilter)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 cursor-pointer">
                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                    </svg>
                </div>
            }
        </div>
    )
}