import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Replaced react-router-dom's useNavigate with next/navigation's useRouter
import { useSelector } from "react-redux";
import Header from "@/components/Header";
import ProfileContent from "@/components/ProfilePageComponents/ProfileContent";
import ProfileSidebar from "@/components/ProfilePageComponents/ProfileSidebar";
import Loader from "@/components/Loader";

function ProfilePage() {
  const [active, setActive] = useState(1);
  const router = useRouter(); // Replaced useNavigate with useRouter
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login"); // Replaced navigate("/login") with router.push("/login")
    }
  }, [isAuthenticated, loading, router]);

  if (loading)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <div>
      <Header />
      <div className="section flex bg-[#f5f5f5] py-8">
        <div className="sticky top-40 md:max-w-[270px] lg:w-full">
          <ProfileSidebar active={active} setActive={setActive} />
        </div>
        <ProfileContent active={active} />
      </div>
    </div>
  );
}

export default ProfilePage;