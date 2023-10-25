const { json } = require("express/lib/response");
const Account = require("../../model/Account");

const getAllAccounts = async (req, res) => {
  const account = await Account.find();
  res.status(200).json(account);
};

const createNewAccount = async (req, res) => {
  // const userId = accounts[accounts.length - 1]; //with mongo db, we don't need the iD, it will be generated automatically
  const { username } = req.body;
  // const newAccount = { ...username, id: userId.id + 1, funds: 0 };
  // accounts.push(newAccount);
  const account = await Account.create({
    username,
    funds: 0,
  });
  return res.status(201).json(account);
};

const getAccountById = async (req, res) => {
  const { id } = req.params;
  // const foundById = accounts.find((account) => {
  //   return account.id == id;
  const foundById = await Account.findById({ _id: id });
  res.status(200).json(foundById);
};

// const getAccountByUsername = async (req, res) => {
//   const { username } = req.params;
//   const { currency } = req.query;
//   // const foundByName = accounts.find((account) => {
//   //   return account.username == username});
//   const foundByName = await Account.findOne({ username: username });
//   if (!foundByName) {
//     return res.status(404).json({ message: "Account by name not found" });
//   }
//   if (currency && currency.toLocaleLowerCase() == "usd") {
//     const conversionRate = 3.3;
//     const convertedFunds = foundByName.funds * conversionRate;

//     res.status(200).json({
//       ...foundByName,
//       funds: `$${convertedFunds}`,
//     });
//   }

//   res.status(200).json(foundByName);
// };

const getAccountByUsername = async (req, res) => {
  const { username } = req.params;
  const { currency } = req.query;

  try {
    const foundByName = await Account.findOne({ username: username });

    if (!foundByName) {
      return res.status(404).json({ message: "Account by name not found" });
    }

    if (currency && currency.toLowerCase() === "usd") {
      const conversionRate = 3.3;
      const convertedFunds = foundByName.funds * conversionRate;

      return res.status(200).json({
        ...foundByName.toObject(),
        funds: `$${convertedFunds}`,
      });
    }

    return res.status(200).json(foundByName);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

const deleteAccount = async (req, res) => {
  const { accountId } = req.params;
  const accountToDelete = await Account.findOne({ _id: accountId });
  if (!accountToDelete) {
    //if account is not found return message
    return res.status(404).json({ message: "Account not found" });
  }
  // const updatedAccounts = await Account.filter(
  //   (account) => account.id != accountId //isolate the account with the specified accountId from the rest of the accounts
  // ); //exclude the accounts that the user wants to delete
  // //   console.log(accounts);
  // accounts.length = 0; //clear the original array
  // //   console.log(accounts);
  // accounts.push(...updatedAccounts); //update the original array without the account deleted
  await Account.deleteOne({ _id: accountId });

  return res.status(200).json({ message: "Account deleted successfully" });
};

const updateAccount = async (req, res) => {
  const { accountId } = req.params;
  const { username, funds } = req.body;
  const accountToUpdate = await Account.findByIdAndUpdate(
    accountId,
    {
      username,
      funds,
    },
    { new: true } //show the updated account don't just find & update then stop!
  );

  if (!accountToUpdate) {
    return res.status(404).json({ message: "Account not found" });
  }

  // accountToUpdate.username = username;
  // accountToUpdate.funds = funds;
  return res.status(200).json({
    message: "Account updated successfully",
    Updated_Account: accountToUpdate,
  });
};

const getVipAccounts = async (req, res) => {
  const { balance } = req.query;
  if (!balance) {
    return res.status(400).json({ message: "Balance parameter is required" });
  }
  try {
    const vipAccounts = await Account.find({
      funds: { $gte: parseInt(balance) },
    });
    res.status(200).json(vipAccounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllAccounts,
  createNewAccount,
  getAccountById,
  getAccountByUsername,
  deleteAccount,
  updateAccount,
  getVipAccounts,
};
