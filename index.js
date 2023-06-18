const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const jobRoute = require("./routes/job");
const bookmarkRoute = require("./routes/bookmark");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

app.use(express.json());

app.use("/api/", authRoute);

app.use("/api/users", userRoute);

app.use("/api/jobs", jobRoute);

app.use("/api/bookmarks", bookmarkRoute);

app.listen(process.env.PORT || 3001, () =>
  console.log(`Example app listening on port ${process.env.PORT || 3001}!`)
);
