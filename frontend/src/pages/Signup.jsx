import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signupMutation = useMutation({
    mutationFn: async (signupDetails) => {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(signupDetails),
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
    fullName: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation.mutate(formdata);
  };
  return (
    <div className=" flex flex-col justify-center items-center gap-2 m-10 p-10 bg-black text-white rounded-2xl">
      <h1 className=" font-bold text-2xl">Signup</h1>

      <form className=" flex flex-col gap-4" onSubmit={handleSignup}>
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
        <label htmlFor="fullName">
          <p className=" text-center font-bold text-lg m-2">Full Name</p>
          <input
            type="text"
            placeholder="Enter Full Name"
            className=" text-center rounded-xl p-2 text-black"
            name="fullName"
            value={formdata.fullName}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="email">
          <p className=" text-center font-bold text-lg m-2">Email</p>
          <input
            type="text"
            placeholder="Enter Email"
            className=" text-center rounded-xl p-2 text-black"
            name="email"
            value={formdata.email}
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
        <button className=" text-lg font-bold p-2 hover:bg-white hover:text-black rounded-xl">
          Signup
        </button>
        <Link to={"/login"} className=" mx-auto text-base font-semibold">
          Already A User?{" "}
          <span className="font-bold text-base hover:underline m-2">Login</span>
        </Link>
      </form>
    </div>
  );
};

export default Signup;
