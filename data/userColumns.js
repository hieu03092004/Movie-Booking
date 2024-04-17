const userColumns = [
  {
    checkboxSelection: true,
    headerCheckboxSelection: true,
    maxWidth: 50,
    suppressHeaderMenuButton: true,
  },
  { field: "user_id", headerName: "ID", maxWidth: 100 },
  {
    field: "avatar",
    headerName: "Avatar",
    maxWidth: 130,
    suppressHeaderMenuButton: true,
    sortable: false,
  },
  {
    field: "first_name",
    headerName: "First name",
    type: "string",
  },
  { field: "last_name", headerName: "Last name", type: "string" },
  { field: "date_of_birth", headerName: "DOB", type: "string", hide: true },
  { field: "gender", headerName: "Gender", type: "string" },
  { field: "address", headerName: "Address", type: "string", hide: true },
  { field: "phone", headerName: "Phone", type: "string" },
  { field: "email", headerName: "Email", type: "string" },
  {
    field: "action",
    headerName: "Action",
    suppressHeaderMenuButton: true,
    sortable: false,
  },
];

module.exports = userColumns;
