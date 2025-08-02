import AllOrders from "./AllOrders";
import AllRefundOrders from "./AllRefundOrders";
import ChangePassword from "./ChangePassword";
import Profile from "./Profile";
import TrackOrders from "./TrackOrders";
import UserAddress from "./UserAddress";
import UserInbox from "./UserInbox";

function ProfileContent({ active }) {
  return (
    <div className="w-full">
      {/* profile */}
      {active === 1 && <Profile />}

      {/* ordres */}
      {active === 2 && <AllOrders />}

      {/* refund ordres */}
      {active === 3 && <AllRefundOrders />}

      {/* inbox */}
      {active === 4 && <UserInbox />}

      {/* track ordres */}
      {active === 5 && <TrackOrders />}

      {/* change password */}
      {active === 6 && <ChangePassword />}

      {/* user address */}
      {active === 7 && <UserAddress />}
    </div>
  );
}

export default ProfileContent;
