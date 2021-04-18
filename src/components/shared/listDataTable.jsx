import React from "react";
import ReactPaginate from "react-paginate";
import { ChevronLeft, ChevronRight } from "react-feather";
import DataTable from "react-data-table-component";
import "../../assets/scss/plugins/extensions/react-paginate.scss";
import "../../assets/scss/pages/data-list.scss";

const ListDataTable = ({
  columns,
  data,
  meta,
  handlePagination,
  onRowClicked,
  onSelectedRowsChange,
  fixedHeader = true,
  selectableRows,
  selectableRowsComponent,
  selectableRowsComponentProps,
  selectableRowSelected,
  subHeaderComponent,
  subHeader,

  pointerOnHover = true,
  customStyles,
}) => (
  <div className="data-list list-view">
    <DataTable
      paginationServer
      columns={columns}
      data={data}
      onRowClicked={onRowClicked}
      fixedHeader={fixedHeader}
      selectableRows={selectableRows}
      pagination
      pointerOnHover={pointerOnHover}
      customStyles={customStyles}
      selectableRowsHighlight
      noHeader
      responsive
      selectableRowsComponent={selectableRowsComponent}
      selectableRowsComponentProps={selectableRowsComponentProps}
      selectableRowSelected={selectableRowSelected}
      onSelectedRowsChange={onSelectedRowsChange}
      subHeader={subHeader}
      subHeaderComponent={subHeaderComponent}
      paginationComponent={() => (
        <ReactPaginate
          previousLabel={<ChevronLeft size={15} />}
          nextLabel={<ChevronRight size={15} />}
          breakLabel="..."
          breakClassName="break-me"
          pageCount={meta.last_page}
          containerClassName="vx-pagination separated-pagination pagination-end pagination-sm mb-0 mt-2"
          activeClassName="active"
          forcePage={meta.current_page - 1}
          onPageChange={(page) => handlePagination(page)}
        />
      )}
    />
  </div>
);

export default ListDataTable;
