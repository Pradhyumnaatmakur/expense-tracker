import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import TransactionCard from "../components/TransactionCard";

const Dashboard = () => {
  const queryClient = useQueryClient();

  const [formdata, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    type: "expense",
  });
  const [display, setDisplay] = useState("all");

  const addTransactionMutation = useMutation({
    mutationFn: async (transaction) => {
      const res = await fetch("http://localhost:5000/api/transaction/add", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(transaction),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["transactions"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions", display],
    queryFn: async () => {
      const endpoint =
        display === "all" ? "all" : display === "income" ? "income" : "expense";

      const res = await fetch(
        `http://localhost:5000/api/transaction/${endpoint}`,
        {
          method: "GET",
          headers: { "Content-type": "application/json" },
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      return data;
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    addTransactionMutation.mutate(formdata);
  };

  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, cur) => acc + cur.amount, 0);

  const expense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, cur) => acc + cur.amount, 0);

  const netBalance = income - expense;
  return (
    <div className="flex flex-col justify-center items-center m-4 p-4 gap-2">
      <h1 className=" text-3xl font-bold m-2">
        {" "}
        Balance: {netBalance > 0 ? `+${netBalance}` : `${netBalance}`}
      </h1>
      <form onSubmit={handleAddTransaction}>
        <div className="flex flex-col gap-4 sm:flex-row">
          <label htmlFor="title" className="font-bold text-lg text-center">
            Title:
            <input
              type="text"
              name="title"
              placeholder="Enter Title"
              className=" text-center rounded-xl p-1 m-2 text-black"
              value={formdata.title}
              onChange={handleChange}
            />
          </label>
          <label
            htmlFor="description"
            className="font-bold text-lg text-center"
          >
            Description:
            <input
              type="text"
              name="description"
              placeholder="Enter Description"
              className=" text-center rounded-xl p-1 m-2 text-black"
              value={formdata.description}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="amount" className="font-bold text-lg text-center">
            Amount:
            <input
              type="number"
              name="amount"
              placeholder="Enter Amount"
              className=" text-center rounded-xl p-1 m-2 text-black"
              value={formdata.amount}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="expense" className="font-bold text-lg text-center">
            Type:
            <select
              name="type"
              className=" text-center rounded-xl p-1 m-2 text-black"
              value={formdata.type}
              onChange={handleChange}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>
        </div>
        <div className=" flex flex-col">
          <button className=" text-lg font-bold p-3 m-2 hover:bg-black hover:text-white rounded-xl">
            Add
          </button>
        </div>
      </form>
      <div className=" flex gap-3">
        <button
          className=" text-lg font-bold p-3 m-2 hover:bg-black hover:text-white rounded-xl"
          onClick={() => setDisplay("all")}
        >
          All
        </button>
        <button
          className=" text-lg font-bold p-3 m-2 hover:bg-black hover:text-white rounded-xl"
          onClick={() => setDisplay("income")}
        >
          Income
        </button>
        <button
          className=" text-lg font-bold p-3 m-2 hover:bg-black hover:text-white rounded-xl"
          onClick={() => setDisplay("expense")}
        >
          Expense
        </button>
      </div>

      <div className=" w-full">
        {transactions?.map((transaction) => (
          <TransactionCard
            key={transaction._id}
            title={transaction.title}
            amount={transaction.amount}
            type={transaction.type}
            description={transaction.description}
            transactionId={transaction._id}
          />
        ))}
      </div>
    </div>
  );
};
export default Dashboard;
