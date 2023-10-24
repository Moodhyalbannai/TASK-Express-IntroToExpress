const { json } = require("express/lib/response");
const accounts = require("../../accounts");

const getAllAccounts = (req, res) => {
  res.status(200).json(accounts);
};

const createNewAccount = (req, res) => {
  const userId = accounts[accounts.length - 1];
  const username = req.body;
  const newAccount = { ...username, id: userId.id + 1, funds: 0 };
  accounts.push(newAccount);
  return res.status(201).json(accounts);
};

const getAccountById = (req, res) => {
  const { id } = req.params;
  const foundById = accounts.find((account) => {
    return account.id == id;
  });
  res.status(200).json(foundById);
};

const getAccountByUsername = (req, res) => {
  const { username } = req.params;
  const { currency } = req.query;
  const foundByName = accounts.find((account) => {
    return account.username == username;
  });
  if (!foundByName) {
    return res.status(404).json({ message: "Account by name not found" });
  }
  if (currency && currency.toLocaleLowerCase() == "usd") {
    const conversionRate = 3.3;
    const convertedFunds = foundByName.funds * conversionRate;

    res.status(200).json({
      ...foundByName,
      funds: `$${convertedFunds}`,
    });
  }

  res.status(200).json(foundByName);
};

const deleteAccount = (req, res) => {
  const { accountId } = req.params;
  const accountToDelete = accounts.find((account) => {
    return account.id == accountId;
  });
  if (!accountToDelete) {
    //if account is not found return message
    return res.status(404).json({ message: "Account not found" });
  }
  const updatedAccounts = accounts.filter(
    (account) => account.id != accountId //isolate the account with the specified accountId from the rest of the accounts
  ); //exclude the accounts that the user wants to delete
  //   console.log(accounts);
  accounts.length = 0; //clear the original array
  //   console.log(accounts);

  accounts.push(...updatedAccounts); //update the original array without the account deleted
  return res.status(200).json({ message: "Account deleted successfully" });
};

const updateAccount = (req, res) => {
  const { accountId } = req.params;
  const { username, funds } = req.body;
  const accountToUpdate = accounts.find((account) => {
    return account.id == accountId;
  });

  if (!accountToUpdate) {
    return res.status(404).json({ message: "Account not found" });
  }
  accountToUpdate.username = username;
  accountToUpdate.funds = funds;
  return res.status(200).json({
    message: "Account updated successfully",
    account: accountToUpdate,
  });
};

module.exports = {
  getAllAccounts,
  createNewAccount,
  getAccountById,
  getAccountByUsername,
  deleteAccount,
  updateAccount,
};
