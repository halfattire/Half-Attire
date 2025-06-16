"use client"

import { RxCross1 } from "react-icons/rx"
import { IoBagHandleOutline } from "react-icons/io5"
import SingleCart from "./SingleCart"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { addTocartAction, removeFromCartAction } from "../redux/actions/cart"

// Props:
// - setOpenCart: Function to close the cart popup
const CartPopUp = ({ setOpenCart }) => {
  const { cart = [] } = useSelector((state) => state.cart)
  const dispatch = useDispatch()

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCartAction(data._id))
  }

  const quantityChangeHandler = (data) => {
    dispatch(addTocartAction(data))
  }

  // FIXED: Updated total calculation for variable products
  const totalPrice = cart.reduce((acc, item) => {
    const itemPrice = item.selectedVariation ? item.selectedVariation.price : item.discountPrice || item.originalPrice
    return acc + item.qty * itemPrice
  }, 0)

  return (
    <div className="fixed left-0 top-0 z-[300] flex h-screen w-full items-center justify-end bg-[#0000004b]">
      <div className="h-full w-full max-w-sm bg-white p-4 flex flex-col">
        <div className="flex w-full items-center justify-end">
          <RxCross1 size={25} className="cursor-pointer" onClick={() => setOpenCart(false)} />
        </div>
        {cart.length === 0 ? (
          <div className="flex-grow flex items-center justify-center">
            <p>Your cart is empty!</p>
          </div>
        ) : (
          <>
            <div className="flex items-center">
              <IoBagHandleOutline size={25} />
              <h5 className="pl-2 text-[20px] font-[500]">{cart.length} items</h5>
            </div>
            <div className="custom-scrollbar flex-grow h-[75%] w-full overflow-y-auto">
              {cart.map((i, index) => (
                <SingleCart
                  data={i}
                  key={index}
                  quantityChangeHandler={quantityChangeHandler}
                  removeFromCartHandler={removeFromCartHandler}
                />
              ))}
            </div>
            <div className="border-t border-[#e1e1e1] p-5 mt-auto">
              <Link href="/checkout">
                <div className="flex h-[45px] w-full items-center justify-center rounded-[5px] bg-[#e44343]">
                  <h1 className="text-[18px] font-[600] text-white">Checkout Now (PKR {totalPrice.toFixed(2)})</h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CartPopUp
