import { useSearchParams } from "react-router-dom"

import Select from "./Select"

function SortBy({ options, searchParamsToReset }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const sortByValue = searchParams.get("sortBy") || "";

    function handleChange(e) {
        searchParams.set("sortBy", e.target.value);
        searchParamsToReset?.map(param => searchParams.set(param.name, param.value))
        setSearchParams(searchParams)
    }

    // sortBy param value is a combination of `{field}-{directionSort}`
    // field must be the same name as column in supabase
    return (
        <Select value={sortByValue} onChange={handleChange} options={options} type="white"/>
    )
}

export default SortBy
