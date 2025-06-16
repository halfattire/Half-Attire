import ShopInfo from "../../components/SellerComponent/ShopInfo";
import ShopProfileData from "../../components/SellerComponent/ShopProfileData";

function ShopPreviewPage() {
  return (
    <div className="section bg-gray-100 py-10">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="custom-scrollbar top-4 z-10 w-full overflow-y-auto rounded-lg bg-white p-6 shadow-lg lg:sticky lg:h-[90vh] lg:w-80">
          <ShopInfo isOwner={false} />
        </div>
        <div className="flex-1 py-6 lg:px-6 lg:py-0">
          <ShopProfileData isOwner={false} />
        </div>
      </div>
    </div>
  );
}

export default ShopPreviewPage;
