const columnsdata = [
    {
        checkboxSelection: true,
        headerCheckboxSelection: true,
        maxWidth: 50,
        suppressHeaderMenuButton: true,
    },
    { field: "id", headerName: "ID", maxWidth: 100 },
    {
        field: "img",
        headerName: "Image",
        maxWidth: 130,
        suppressHeaderMenuButton: true,
        sortable: false,
    },
    {
        field: "title",
        headerName: "Title",
        type: "string",
    },
    { field: "color", headerName: "Color", type: "string" },
    { field: "price", headerName: "Price", type: "string" },
    { field: "producer", headerName: "Producer", type: "string" },
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

module.exports = columnsdata;
