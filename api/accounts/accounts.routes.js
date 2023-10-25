const express = require("express");
const router = express.Router();
const {
  getAllAccounts,
  createNewAccount,
  getAccountById,
  getAccountByUsername,
  deleteAccount,
  updateAccount,
  getVipAccounts,
} = require("./accounts.controllers");

router.get("/accounts", getAllAccounts);

router.post("/accounts", createNewAccount);

router.get("/accounts/:id", getAccountById);

router.get("/accounts/username/:username", getAccountByUsername);

router.delete("/accounts/:accountId", deleteAccount);

router.put("/accounts/:accountId", updateAccount);

router.get("/accounts/vip/accounts", getVipAccounts);

module.exports = router;
