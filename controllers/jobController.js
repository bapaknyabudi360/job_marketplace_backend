const Jobs = require("../models/Job");

module.exports = {
  createJob: async (req, res) => {
    const newJob = new Jobs(req.body);
    try {
      const savedJob = await newJob.save();
      const { __v, createdAt, updatedAt, ...others } = savedJob._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  updateJob: async (req, res) => {
    try {
      const updatedJob = await Jobs.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      const { __v, createdAt, updatedAt, ...others } = updatedJob._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  deleteJob: async (req, res) => {
    try {
      await Jobs.findByIdAndDelete(req.params.id);
      res.status(200).json("Job has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getJob: async (req, res) => {
    try {
      const job = await Jobs.findById(req.params.id);
      const { __v, createdAt, updatedAt, ...others } = job._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getAllJobs: async (req, res) => {
    const queryNew = req.query.new;
    const queryCategory = req.query.category;
    try {
      let jobs;
      if (queryNew) {
        jobs = await Jobs.find().sort({ createdAt: -1 }).limit(5);
      } else if (queryCategory) {
        jobs = await Jobs.find({
          categories: {
            $in: [queryCategory],
          },
        });
      } else {
        jobs = await Jobs.find();
      }
      res.status(200).json(jobs);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  searchJobs: async (req, res) => {
    try {
      const jobs = await Jobs.aggregate([
        {
          $search: {
            index: "jobsearch",
            text: {
              query: req.params.key,
              path: {
                wildcard: "*",
              },
            },
          },
        },
      ]);
      res.status(200).json(jobs);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
