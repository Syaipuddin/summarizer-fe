import React from "react";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import cloneDeep from "lodash/cloneDeep";
import throttle from "lodash/throttle";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";


const tableHead = {
  doc: "Original Text",
  summed: "Summarized Text",
};

const Table = ({allData}) => {
  const countPerPage = 5;
  const [value, setValue] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [collection, setCollection] = React.useState(
    cloneDeep(allData.slice(0, countPerPage))
  );
  const searchData = React.useRef(
    throttle(val => {
      const query = val.toLowerCase();
      setCurrentPage(1);
      const data = cloneDeep(
        allData
          .filter(item => item.name.toLowerCase().indexOf(query) > -1)
          .slice(0, countPerPage)
      );
      setCollection(data);
    }, 400)
  );

  React.useEffect(() => {
    if (!value) {
      updatePage(1);
    } else {
      searchData.current(value);
    }
  }, [value]);

  const updatePage = p => {
    setCurrentPage(p);
    const to = countPerPage * p;
    const from = to - countPerPage;
    setCollection(cloneDeep(allData.slice(from, to)));
  };

  const tableRows = rowData => {
    const { key, index } = rowData;
    const tableCell = Object.keys(tableHead);
    const columnData = tableCell.map((keyD, i) => {
      return <td className="border border-gray-300 p-3" key={i}>{key[keyD]}</td>;
    });

    if (index % 2) {
        return <tr className="bg-cyan-50" key={index}>{columnData}</tr>;
    } 

    return <tr key={index}>{columnData}</tr>;
    
  };

  const tableData = () => {
    return collection.map((key, index) => tableRows({ key, index }));
  };

  const headRow = () => {
    return Object.values(tableHead).map((title, index) => (
      <td className="bg-cyan-100 border border-gray-300 p-5" key={index}>{title}</td>
    ));
  };

  return (
    <>
      <div className="search w-8/12 flex justify-end">
        <div className="flex gap-2 items-center justify-center text-center border-2 ps-2 rounded-md">
            <MagnifyingGlassIcon className="size-4 font-semibold" />
            <input
            className="px-2 py-1 focus:outline-none"
            placeholder="Search"
            value={value}
            onChange={e => setValue(e.target.value)}
            />
        </div>
      </div>
      <table className="border border-gray-300 w-8/12">
        <thead className="">
          <tr className="" >{headRow()}</tr>
        </thead>
        <tbody className="trhover border border-gray-300">{tableData()}</tbody>
      </table>
      <Pagination
        pageSize={countPerPage}
        onChange={updatePage}
        current={currentPage}
        total={allData.length}
      />
    </>
  );
};
export default Table;
