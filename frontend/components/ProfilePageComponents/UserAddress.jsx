/* eslint-disable no-unused-vars */
import { Button } from "@mui/material";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Country, City } from "country-state-city";
import { deleteUserAddress, updateUserAddress } from "../../redux/actions/user";

function UserAddress() {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const addressTypeData = [
    { name: "default" },
    { name: "Home" },
    { name: "Office" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (addressType === "" || country === "" || city === "") {
      toast.error("Please fill all the fields!");
    } else {
      dispatch(
        updateUserAddress(
          country,
          city,
          address1,
          address2,
          addressType,
          zipCode,
        ),
      );
      toast.success("Address added successfully!");
      setOpen(false);
      setCountry("");
      setCity("");
      setAddress1();
      setAddress2();
      setAddressType();
      setZipCode();
    }
  };

  const handleDelete = (item) => {
    const id = item._id;
    dispatch(deleteUserAddress(id));
    toast.info("Address deleted successfully!");
  };

  return (
    <div className="w-full px-5">
      <div className="flex w-full items-center justify-between pb-2">
        <h1 className="text-xl font-semibold">My Addresses</h1>
        <button
          className="rounded-md border-2 border-blue-600 bg-transparent px-6 py-2 text-blue-600 transition duration-300 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => setOpen(true)}
        >
          Add New
        </button>
      </div>
      <br />
      {user &&
        user.addresses.map((item, index) => (
          <div
            key={index}
            className="mx-auto mb-4 flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-md"
          >
            <div className="flex-1 pr-4">
              <h5 className="text-md font-medium text-gray-900">
                {item?.addressType}
              </h5>
              <p className="text-base font-semibold text-gray-600">
                {item?.address1}
              </p>
              <p className="text-sm text-gray-500">{user.phoneNumber}</p>
            </div>
            <div
              className="flex-shrink-0 cursor-pointer rounded-md p-4 transition-all duration-300 hover:bg-red-50"
              onClick={() => handleDelete(item)}
            >
              <AiOutlineDelete
                size={20}
                className="cursor-pointer text-gray-500 transition-colors duration-300 ease-in-out hover:text-red-600"
              />
            </div>
          </div>
        ))}

      {user && user.addresses.length === 0 && (
        <p className="p-4 text-center text-lg font-semibold text-indigo-800">
          You not have any saved address
        </p>
      )}

      {open && (
        <div className="fixed inset-0 flex h-screen w-full items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="relative flex w-full max-w-2xl items-center justify-center p-4">
            <div className="custom-scrollbar relative h-[90vh] overflow-y-auto rounded-lg bg-white shadow md:h-[70vh] dark:bg-gray-700">
              <div className="flex items-center justify-between gap-4 rounded-t border-b p-4 md:p-5 dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add New Address
                </h3>
                <button
                  type="button"
                  className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  <IoClose size={30} />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="selectedCountry"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Country
                      </label>
                      <select
                        id="selectedCountry"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      >
                        <option value="">Select your country</option>
                        {Country &&
                          Country.getAllCountries().map((item) => (
                            <option key={item.isoCode} value={item.isoCode}>
                              {item.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="selectedCity"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        City
                      </label>
                      <select
                        id="selectedCity"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={!country}
                      >
                        <option value="">Select your city</option>
                        {country &&
                          City.getCitiesOfCountry(country).map((item) => (
                            <option key={item.name} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="address1"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Address 1
                      </label>
                      <input
                        type="text"
                        id="address1"
                        value={address1}
                        onChange={(e) => setAddress1(e.target.value)}
                        placeholder="Enter address 1"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="address2"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Address 2
                      </label>
                      <input
                        type="text"
                        id="address2"
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                        placeholder="Enter address 2"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="zipCode"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Zip Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="Enter zip code"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="addressType"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Address Type
                      </label>
                      <select
                        id="addressType"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                        value={addressType}
                        onChange={(e) => setAddressType(e.target.value)}
                      >
                        <option value="">Select address type</option>
                        {addressTypeData.map((item) => (
                          <option key={item.name} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="contained" color="primary" type="submit">
                      Add Address
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserAddress;
