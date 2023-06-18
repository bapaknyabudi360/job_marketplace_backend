const router = require("express").Router();
const jobController = require("../controllers/jobController");
const {
  verifyTokenAndAuthorization,
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");

// CREATE JOB
router.post("/", verifyTokenAndAdmin, jobController.createJob);

// UPDATE JOB
router.put("/:id", verifyTokenAndAdmin, jobController.updateJob);

// DELETE JOB
router.delete("/:id", verifyTokenAndAdmin, jobController.deleteJob);

// GET JOB
router.get("/find/:id", verifyTokenAndAuthorization, jobController.getJob);

// GET ALL JOBS
router.get("/", verifyTokenAndAuthorization, jobController.getAllJobs);

// SEARCH JOBS
router.get(
  "/search/:key",
  verifyTokenAndAuthorization,
  jobController.searchJobs
);

module.exports = router;
