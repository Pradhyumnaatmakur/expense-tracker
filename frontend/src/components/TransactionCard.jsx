import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const TransactionCard = ({
  title,
  description,
  amount,
  type,
  transactionId,
}) => {
  const isExpense = type?.toLowerCase() === "expense";

  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    title,
    description,
    amount,
    type,
  });

  const deleteMutation = useMutation({
    mutationFn: async (transactionId) => {
      const res = await fetch(
        `http://localhost:5000/api/transaction/delete/${transactionId}`,
        {
          method: "DELETE",
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
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["transactions"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ transactionId, updatedData }) => {
      const res = await fetch(
        `http://localhost:5000/api/transaction/update/${transactionId}`,
        {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["transactions"]);
      setEditing(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = (e) => {
    e.preventDefault();
    deleteMutation.mutate(transactionId);
  };

  const handleEdit = (e) => {
    e.preventDefault();

    if (editing) {
      editMutation.mutate({ transactionId, updatedData: formData });
    } else {
      setEditing(true);
    }
  };

  return (
    <div>
      {editing ? (
        <>
          <div className=" flex flex-col items-center justify-center">
            <label htmlFor="title" className=" text-lg font-bold">
              Title:
              <input
                type="text"
                placeholder="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className=" text-center rounded-xl p-1 m-2 text-black"
              />
            </label>
            <label htmlFor="description" className=" text-lg font-bold">
              Description:
              <input
                type="text"
                placeholder="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className=" text-center rounded-xl p-1 m-2 text-black"
              />
            </label>
            <label htmlFor="amount" className=" text-lg font-bold">
              Amount:
              <input
                type="number"
                placeholder="Amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className=" text-center rounded-xl p-1 m-2 text-black"
              />
            </label>
            <label htmlFor="expense" className="font-bold text-lg">
              Type:
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </label>
            <div>
              <button
                className="text-lg font-bold p-3 hover:bg-black hover:text-white rounded-xl mx-auto"
                onClick={handleEdit}
              >
                Save
              </button>
              <button
                className="text-lg font-bold p-3 hover:bg-black hover:text-white rounded-xl mx-auto"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className=" flex  justify-center items-center min-w-fit border border-black rounded-2xl m-2">
            <div className=" flex flex-row w-[50%]">
              <p
                className={`${
                  isExpense ? "text-red-700" : "text-green-700"
                } text-4xl font-bold mx-auto`}
              >
                ${amount}
              </p>
            </div>
            <div className=" flex flex-col w-[50%] gap-2 ">
              <p className="text-xl font-bold mx-auto mt-4 capitalize">
                {title}
              </p>
              <p className="text-xl font-bold mx-auto capitalize">
                {description}
              </p>
              <p
                className={`${
                  isExpense ? "text-red-700" : "text-green-700"
                } text-xl font-bold mx-auto capitalize`}
              >
                {type}
              </p>
              <div className=" flex flex-row ">
                <button
                  className=" text-lg font-bold p-3 hover:bg-black hover:text-white rounded-xl mx-auto"
                  onClick={handleEdit}
                >
                  {editing ? "Save" : "Edit"}
                </button>
                <button
                  className=" text-lg font-bold p-3 hover:bg-black hover:text-white rounded-xl mx-auto"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default TransactionCard;
