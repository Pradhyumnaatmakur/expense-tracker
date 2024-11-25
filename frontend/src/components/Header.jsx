import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Header = ({ user }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["auth"]);
      navigate("/login");
    },
  });

  const handleLogout = (e) => {
    e.preventDefault();
    logoutMutation.mutate();
  };

  return (
    <div className=" flex justify-between items-center bg-black text-white gap-4 w-full">
      <h1 className=" text-4xl font-bold p-4">Expense Tracker</h1>

      <div className=" flex gap-2">
        {user ? (
          <>
            <button
              className=" text-lg font-bold p-2 hover:bg-white hover:text-black rounded-xl"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to={"/login"}>
              <button className=" text-lg font-bold p-2 hover:bg-white hover:text-black rounded-xl">
                Login
              </button>
            </Link>
            <Link to={"/signup"}>
              <button className=" text-lg font-bold p-2 hover:bg-white hover:text-black rounded-xl">
                Signup
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
export default Header;
