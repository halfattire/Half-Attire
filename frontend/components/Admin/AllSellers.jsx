"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import styles from "@/style/style";
import axios from "axios";
import { server } from "@/lib/server";
import { toast } from "react-toastify";
import { getAllSellers } from "../../redux/actions/seller";
import Link from "next/link";

const AllSellers = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { sellers } = useSelector((state) => state.seller);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/shop/admin-delete-seller/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllSellers());
      })
      .catch((error) => {
        toast.error(error.response?.data.message);
      });
    setOpen(false);
  };

  const columns = [
    { field: "id", headerName: "Seller ID", flex: 0.7 },
    { field: "name", headerName: "Name", flex: 0.7 },
    { field: "email", headerName: "Email", type: "email", flex: 0.7 },
    { field: "address", headerName: "Seller Address", type: "address", flex: 0.7 },
    { field: "joinedAt", headerName: "joinedAt", type: "text", flex: 0.8 },
    {
      field: " ",
      flex: 1,
      headerName: "Preview Shop",
      type: "text",
      sortable: false,
      renderCell: (params) => (
        <Link href={`/shop/preview/${params.id}`}>
          <Button>
            <AiOutlineEye size={20} />
          </Button>
        </Link>
      ),
    },
    {
      field: "  ",
      flex: 1,
      headerName: "Delete Seller",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => setUserId(params.id) || setOpen(true)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  const row = [];
  sellers &&
    sellers.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        email: item.email,
        joinedAt: item.createdAt.slice(0, 10),
        address: item.address,
      });
    });

  return (
    <div className="w-full flex justify-center pt-5">
      <div className="w-[97%]">
        <h5 className="text-[22px] pb-2 font-Poppins">All Seller</h5>
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={4}
          disableSelectionOnClick
          autoHeight
        />
      </div>
      {open && (
        <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
          <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
            <div className="w-full flex justify-end cursor-pointer">
              <RxCross1 size={25} onClick={() => setOpen(false)} />
            </div>
            <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
              Are you sure you wanna delete this user?
            </h3>
            <div className="w-full flex items-center justify-center">
              <div
                className={`${styles.button} text-white text-[18px] !h-[42px] mr-4`}
                onClick={() => setOpen(false)}
              >
                cancel
              </div>
              <div
                className={`${styles.button} text-white text-[18px] !h-[42px] ml-4`}
                onClick={() => handleDelete(userId)}
              >
                confirm
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSellers;