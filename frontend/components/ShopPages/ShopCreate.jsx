"use client";

import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { server } from "@/lib/server";
import { toast } from "react-toastify";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { redirect } from "next/navigation";
import LoadingButton from "../LoadingButton";

function ShopCreate() {
  const { isSeller } = useSelector((state) => state.seller);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);

  // const router = useRouter();

  // useEffect(() => {
  //   if (isSeller) {
  //     router.push("/dashboard");
  //   }
  //   if (user?.role !== "admin") {
  //     router.replace("/");
  //   }
  // }, [isSeller, router]);

  // const handleFileInputChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setAvatar(file);
  //     setAvatarPreview(URL.createObjectURL(file));
  //   }
  // };

  // const togglePasswordVisibility = () => {
  //   setPasswordVisible(!passwordVisible);
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const formData = new FormData();
  //   formData.append("name", name);
  //   formData.append("email", email);
  //   formData.append("password", password);
  //   formData.append("zipCode", zipCode);
  //   formData.append("phoneNumber", phoneNumber);
  //   formData.append("address", address);
  //   if (avatar) {
  //     formData.append("file", avatar);
  //   }

  //   try {
  //     const config = {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     };

  //     const response = await axios.post(
  //       `${server}/shop/create-shop`,
  //       formData,
  //       config,
  //     );

  //     if (response.data.success) {
  //       toast.success(response.data.message);
  //       setName("");
  //       setEmail("");
  //       setPassword("");
  //       setAvatar(null);
  //       setAvatarPreview(null);
  //       setAddress("");
  //       setPhoneNumber("");
  //       setZipCode("");
  //       router.push("/shop-login"); // Redirect to shop-login on success
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "An error occurred");
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  const router = useRouter()

  useEffect(() => {
    if (isSeller) {
      router.push("/dashboard")
    }
    if (user?.role !== "admin") {
      router.replace("/")
    }
  }, [isSeller, router, user])

  // Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatar(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let avatarBase64 = null
      if (avatar) {
        avatarBase64 = await convertToBase64(avatar)
      }

      const shopData = {
        name,
        email,
        password,
        zipCode,
        phoneNumber,
        address,
        avatar: avatarBase64,
      }

      // Get the token from cookies or localStorage
      const token = localStorage.getItem("token")

      const config = {
        headers: {
          "Content-Type": "application/json",
          // Include token in Authorization header as fallback
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        withCredentials: true,
      }

      const response = await axios.post(`${server}/shop/create-shop`, shopData, config)

      if (response.data.success) {
        toast.success(response.data.message)
        setName("")
        setEmail("")
        setPassword("")
        setAvatar(null)
        setAvatarPreview(null)
        setAddress("")
        setPhoneNumber("")
        setZipCode("")
        router.push("/shop-login") // Redirect to shop-login on success
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error("Shop creation error:", error.response || error)
      toast.error(error.response?.data?.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }



  return (
    <div>
      <Link href="/">
        <span className="absolute mx-6 my-4 flex h-8 w-12 items-center justify-center rounded-md bg-blue-500 p-2 text-white shadow-sm">
          <FaArrowLeftLong size={20} />
        </span>
      </Link>
      <section className="bg-gray-50 py-6 dark:bg-gray-900">
        <div className="mx-auto flex min-h-screen flex-col items-center justify-center px-6 py-8 lg:py-0">
          <div className="mt-4 w-full rounded-lg bg-white shadow sm:max-w-3xl md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
            <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create a shop account
              </h1>
              <form
                onSubmit={handleSubmit}
                className="space-y-4 md:space-y-6"
                action="#"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Shop Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phonenumber"
                      className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      id="phonenumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      placeholder="name@company.com"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="zipcode"
                      className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      id="zipcode"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        required
                        disabled={loading}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="focus:outline-none"
                          disabled={loading}
                        >
                          {passwordVisible ? (
                            <FaEyeSlash size={18} />
                          ) : (
                            <FaEye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mt-2 flex items-center">
                    <span className="inline-block h-8 w-8 overflow-hidden rounded-full">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="avatar"
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <RxAvatar className="h-8 w-8" />
                      )}
                    </span>
                    <label
                      htmlFor="file-input"
                      className="ml-3 flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      <span>Upload a file</span>
                      <input
                        type="file"
                        name="avatar"
                        id="file-input"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleFileInputChange}
                        className="sr-only"
                        disabled={loading}
                      />
                    </label>
                  </div>
                </div>

                <LoadingButton
                  type="submit"
                  loading={loading}
                  className="w-full"
                >
                  Create Shop
                </LoadingButton>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/shop-login"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShopCreate;