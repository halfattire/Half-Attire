import { useEffect, useState } from "react";
import axios from "axios";
import { server } from "@/lib/server";

function ActivationUser({ activation_token }) {
  const [error, setError] = useState(false);

  useEffect(() => {
    if (activation_token) {
      const activationEmail = async () => {
        try {
          const res = await axios.post(`${server}/user/activation`, {
            activation_token,
          });
          console.log(res.data.message);
        } catch (error) {
          console.error(error);
          setError(true);
        }
      };
      activationEmail();
    }
  }, [activation_token]);

  return (
    <div className="w-full h-screen flex items-center justify-center p-4">
      {error ? (
        <p className="text-xl">Your token is expired</p>
      ) : (
        <p className="text-xl">Your account is created successfully</p>
      )}
    </div>
  );
}

export default ActivationUser;