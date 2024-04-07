const userColumns = [
    {
        checkboxSelection: true,
        headerCheckboxSelection: true,
        maxWidth: 50,
        suppressHeaderMenuButton: true,
    },
    { field: "id", headerName: "ID", maxWidth: 100 },
    {
        field: "img",
        headerName: "Avatar",
        maxWidth: 130,
        suppressHeaderMenuButton: true,
        sortable: false,
    },
    {
        field: "firstName",
        headerName: "First name",
        type: "string",
    },
    { field: "lastName", headerName: "Last name", type: "string" },
    { field: "email", headerName: "Email", type: "string" },
    { field: "phone", headerName: "Phone", type: "string" },
    {
        field: "createdAt",
        headerName: "Created At",
        type: "string",
    },
    {
        field: "action",
        headerName: "Action",
        suppressHeaderMenuButton: true,
        sortable: false,
    },
];

module.exports = userColumns;
