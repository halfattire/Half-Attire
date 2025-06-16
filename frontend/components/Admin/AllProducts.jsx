  "use client";

  import React, { useEffect, useState } from "react";
  import { DataGrid } from "@mui/x-data-grid";
  import Link from "next/link";
  import { AiOutlineEye } from "react-icons/ai";
  import { toast } from "react-toastify";
  import { server } from "../../lib/server";  
  import { Button } from "@mui/material"
  import axios from "axios";

  const AllProducts = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
      axios
        .get(`${server}/product/admin-all-products`, {
          withCredentials: true,
        })
        .then((res) => {
          setData(res.data.products);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }, []);

    const columns = [
      { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
      { field: "name", headerName: "Name", minWidth: 180, flex: 1.4 },
      { field: "price", headerName: "Price", minWidth: 100, flex: 0.6 },
      { field: "Stock", headerName: "Stock", type: "number", minWidth: 80, flex: 0.5 },
      { field: "sold", headerName: "Sold out", type: "number", minWidth: 130, flex: 0.6 },
      {
        field: "Preview",
        flex: 0.8,
        minWidth: 100,
        type: "number",
        sortable: false,
        renderCell: (params) => (
          <Link href={`/product/${params.id}`}>
            <Button>
              <AiOutlineEye size={20} />
            </Button>
          </Link>
        ),
      },
    ];

    const row = [];
    data &&
      data.forEach((item) => {
        row.push({
          id: item._id,
          name: item.name,
          price: "PKR " + item.discountPrice,
          Stock: item.stock,
          sold: item?.sold_out,
        });
      });

    return (
      <div className="w-full">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
    );
  };

  export default AllProducts;