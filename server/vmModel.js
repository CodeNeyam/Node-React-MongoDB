const mongoose = require("mongoose");

const vmSchema = new mongoose.Schema(
  {
    "Package name": String,
    "Date of collection": String,
    "Installed version": String,
    "Latest version": String,
    CVEs: {
      Details: String,
      "id-cve": String,
    },
    "Release notes": String,
  },
  { collection: "vms" }
);

const VM = mongoose.model("VM", vmSchema);

module.exports = VM;
