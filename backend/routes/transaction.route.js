import express from "express";
import {
  addTransaction,
  deleteTransaction,
  getAllTransactions,
  getExpenseTransactions,
  getIncomeTransactions,
  updateTransaction,
} from "../controllers/transaction.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.use(protectRoute);

router.get("/all", getAllTransactions);
router.get("/income", getIncomeTransactions);
router.get("/expense", getExpenseTransactions);

router.post("/add", addTransaction);
router.delete("/delete/:id", deleteTransaction);
router.put("/update/:id", updateTransaction);

export default router;
