import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (loginDetails) => {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginDetails),
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
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [formdata, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation.mutate(formdata);
  };

  return (
    <div className=" flex flex-col justify-center items-center gap-2 m-10 p-10 bg-black text-white rounded-2xl">
      <h1 className=" font-bold text-2xl">Login</h1>

      <form className=" flex flex-col gap-4" onSubmit={handleLogin}>
        <label htmlFor="username">
          <p className=" text-center font-bold text-lg m-2">Username</p>
          <input
            type="text"
            placeholder="Enter Username"
            className=" text-center rounded-xl p-2 text-black"
            name="username"
            value={formdata.username}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          <p className=" text-center font-bold text-lg m-2">Password</p>
          <input
            type="password"
            placeholder="Enter Password"
            className=" text-center rounded-xl p-2 text-black"
            name="password"
            value={formdata.password}
            onChange={handleChange}
          />
        </label>
        <button className=" text-lg font-bold p-3 hover:bg-white hover:text-black rounded-xl">
          Login
        </button>
        <Link to={"/signup"} className=" mx-auto text-base font-semibold">
          Not A User?{" "}
          <span className="font-bold text-base hover:underline m-2">
            Signup
          </span>
        </Link>
      </form>
    </div>
  );
};
export default Login;
