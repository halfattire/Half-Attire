import { RxCross1 } from "react-icons/rx";
import { FaRegHeart } from "react-icons/fa";
import SingleWhislist from "./SingleWhislist";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlistAction } from "../redux/actions/whishlist";
import { addTocartAction } from "../redux/actions/cart";

function WhishListPopUp({ setOpenWhishlist }) {
  const { wishlist } = useSelector((state) => state.wishlist);

  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlistAction(data._id));
  };

  const handleAddToCart = (data) => {
    const newData = { ...data, qty: 1 };
    dispatch(addTocartAction(newData));
    setOpenWhishlist(false);
  };

  return (
    <div className="fixed right-0 top-0 z-[250] h-full w-full animate-fadeIn bg-[#0000004b]">
      <div className="custom-scrollbar fixed right-0 top-0 flex h-full w-full max-w-sm flex-col justify-between overflow-auto bg-white shadow-sm">
        <div className="pt-[40px]">
          {/* Cross icon */}
          <div>
            <RxCross1
              size={25}
              className="absolute right-3 top-3 z-[200] cursor-pointer"
              onClick={() => setOpenWhishlist(false)}
            />
          </div>
          {/* Check if wishlist is empty */}
          {wishlist && wishlist.length === 0 ? (
            <div className="flex items-center justify-center h-[85vh]  p-4 text-gray-600">
              <h5 className="text-[16px] font-semibold ">Your wishlist is empty</h5>
            </div>
          ) : (
            <>
              {/* Item length */}
              <div className="flex items-center gap-2 p-4">
                <FaRegHeart size={25} className="inline-block" />
                <h5 className="text-[20px] font-semibold">
                  {wishlist.length} items
                </h5>
              </div>

              {/* Cart items */}
              <div className="w-full border-t">
                {wishlist.map((item, index) => (
                  <SingleWhislist
                    key={index}
                    data={item}
                    removeFromWishlistHandler={removeFromWishlistHandler}
                    handleAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default WhishListPopUp;