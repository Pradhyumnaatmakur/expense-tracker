import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

export const addTransaction = async (req, res) => {
  try {
    const { title, description, amount, type } = req.body;
    const userId = req.user._id;

    if (!userId) {
      return res.status(404).json({ message: "user not found" });
    }

    if (!title || typeof title !== "string" || title.length > 10) {
      return res.status(400).json({
        message: "Title Should Be Text, And Should Not Exceed 10 Characters",
      });
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.length > 20
    ) {
      return res.status(400).json({
        message:
          "Description Should Be Text, And Should Not Exceed 20 Characters",
      });
    }

    if (isNaN(amount) || amount == null) {
      return res
        .status(400)
        .json({ message: "Amount is required and must be a valid number" });
    }

    if (!type || !["expense", "income"].includes(type.toLowerCase())) {
      return res.status(400).json({
        message: "Type Should be present and must include expense or income",
      });
    }

    const newTransaction = new Transaction({
      user: userId,
      title,
      description,
      amount: Number(amount),
      type: type.toLowerCase(),
    });

    await newTransaction.save();

    res.status(201).json({
      message: "Transaction Added",
      Transaction: {
        user: userId,
        title,
        description,
        amount,
        type,
      },
    });
  } catch (error) {
    console.error("ERROR IN addTransaction CONTROLLER", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user._id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Enter a valid Id" });
    }

    if (!user) {
      return res.status(404).json({ message: "User Not found" });
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: "transaction not found" });
    }

    if (req.user._id.toString() !== transaction.user.toString()) {
      return res
        .status(401)
        .json({ message: "You are unauthorized to delete this transaction" });
    }

    await Transaction.findByIdAndDelete(id);

    res.status(200).json({ message: "Transaction Deleted" });
  } catch (error) {
    console.error("ERROR IN deleteTransaction CONTROLLER", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Enter A Valid Id" });
    }

    if (!req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction Not Found" });
    }

    if (req.user._id.toString() !== transaction.user.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, description, amount, type } = req.body;

    if (title && title.length > 10) {
      return res.status(400).json({
        message: "Title cannot exceed 10 characters.",
      });
    }

    if (description && description.length > 20) {
      return res.status(400).json({
        message: "Description cannot exceed 20 characters.",
      });
    }

    if (amount && isNaN(amount)) {
      return res
        .status(400)
        .json({ message: "Amount must be a valid number." });
    }

    if (type && !["expense", "income"].includes(type.toLowerCase())) {
      return res
        .status(400)
        .json({ message: "Type must be 'income' or 'expense'." });
    }

    transaction.title = title || transaction.title;
    transaction.description = description || transaction.description;
    transaction.amount = amount || transaction.amount;
    transaction.type = type || transaction.type;

    await transaction.save();

    res.status(200).json({ message: "Transaction Updated" });
  } catch (error) {
    console.error("ERROR IN updateTransaction CONTROLLER", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    if (!req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const transactions = await Transaction.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.error("ERROR IN getAllTransactions CONTROLLER", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getIncomeTransactions = async (req, res) => {
  try {
    if (!req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const incomeTransactions = await Transaction.find({
      user: req.user._id,
      type: "income",
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(incomeTransactions);
  } catch (error) {
    console.error("ERROR IN getIncomeTransactions CONTROLLER", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getExpenseTransactions = async (req, res) => {
  try {
    if (!req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const expenseTransactions = await Transaction.find({
      user: req.user._id,
      type: "expense",
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(expenseTransactions);
  } catch (error) {
    console.error("ERROR IN getExpenseTransactions CONTROLLER", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
