const ticketColumns = [
  {
    checkboxSelection: true,
    headerCheckboxSelection: true,
    maxWidth: 50,
    suppressHeaderMenuButton: true,
  },
  { field: "booking_id", headerName: "ID", maxWidth: 100 },
  {
    field: "fullName",
    headerName: "Full Name",
    maxWidth: 130,
    suppressHeaderMenuButton: true,
    sortable: false,
  },
  {
    field: "movie_title",
    headerName: "Movie Title",
    type: "string",
  },
  { field: "show_date", headerName: "Date", type: "string", maxWidth: 100 },
  { field: "show_time", headerName: "Time", type: "string", maxWidth: 100 },
  { field: "seat", headerName: "Seat", type: "string", maxWidth: 100 },
  { field: "price", headerName: "Price", type: "string", maxWidth: 100 },
  {
    field: "payment_method",
    headerName: "Payment",
    type: "string",
    maxWidth: 120,
  },
  { field: "booking_date", headerName: "Booking date", type: "string" },
  //   {
  //     field: "action",
  //     headerName: "Action",
  //     suppressHeaderMenuButton: true,
  //     sortable: false,
  //   },
];

module.exports = ticketColumns;
