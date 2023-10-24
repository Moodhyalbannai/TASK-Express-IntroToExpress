const express = require("express");

const accountsRouter = require("./api/accounts/accounts.routes");

const app = express();
app.use(express.json());

app.use("/api", accountsRouter);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
