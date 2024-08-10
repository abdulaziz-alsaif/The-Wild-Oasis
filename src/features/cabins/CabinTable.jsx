import { useCabins } from "./useCabins";
import { useSearchParams } from "react-router-dom";

import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

function CabinTable() {
  const { isLoading, cabins } = useCabins();

  const [searchParams] = useSearchParams()

  // 1) filter discount
  const filterValue = searchParams.get("discount") || "all"

  let filteredCabins;
  if(filterValue === "all") filteredCabins = cabins;
  else if(filterValue === "with-discount") filteredCabins = cabins.filter(cabin => cabin.discount > 0);
  else if(filterValue === "no-discount") filteredCabins = cabins.filter(cabin => cabin.discount === 0);

  // 2) sort by
  const sortByValue = searchParams.get("sortBy") || "name-asc"
  const [field, direction] = sortByValue.split("-");
  const modifier = direction === "asc" ? 1 : -1 // control sorting in asc or desc

  const sortedCabins = filteredCabins?.sort((a, b) => {
    if(typeof a[field] === "string") {
      return a[field].localeCompare(b[field], 'en', { sensitivity: 'base' }) * modifier
    } else {
      return (a[field] - b[field]) * modifier
    }
  })

  if (isLoading) return <Spinner />;

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabins</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={sortedCabins}
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />
      </Table>
    </Menus>
  );
}

export default CabinTable;
