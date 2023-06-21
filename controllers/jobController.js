const Jobs = require("../models/Job");

module.exports = {
  createJob: async (req, res) => {
    const newJob = new Jobs(req.body);
    try {
      const savedJob = await newJob.save();
      const { __v, ...others } = savedJob._doc;
      const jobData = {
        status: 200,
        message: "Job created successfully",
        data: others,
      };
      res.status(200).json(jobData);
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
      const { __v, createdAt, ...others } = updatedJob._doc;
      const jobData = {
        status: 200,
        message: "Job updated successfully",
        data: others,
      };
      res.status(200).json(jobData);
    } catch (err) {
      const jobData = {
        status: 500,
        message: "Job not updated",
      };
      res.status(500).json(jobData);
    }
  },

  deleteJob: async (req, res) => {
    try {
      await Jobs.findByIdAndDelete(req.params.id);
      const jobData = {
        status: 200,
        message: "Job deleted successfully",
      };
      res.status(200).json(jobData);
    } catch (err) {
      const jobData = {
        status: 500,
        message: "Job not deleted",
      };
      res.status(500).json(jobData);
    }
  },

  getJob: async (req, res) => {
    try {
      const job = await Jobs.findById(req.params.id);
      const { __v, createdAt, ...others } = job._doc;
      const jobData = {
        status: 200,
        message: "Job retrieved successfully",
        data: others,
      };
      res.status(200).json(jobData);
    } catch (err) {
      const jobData = {
        status: 500,
        message: "Job not retrieved",
      };
      res.status(500).json(jobData);
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
      const jobData = {
        status: 200,
        message: "Jobs retrieved successfully",
        data: jobs,
      };
      res.status(200).json(jobData);
    } catch (err) {
      const jobData = {
        status: 500,
        message: "Jobs not retrieved",
      };
      res.status(500).json(jobData);
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
      const jobData = {
        status: 200,
        message: "Jobs retrieved successfully",
        data: jobs,
      };
      res.status(200).json(jobData);
    } catch (err) {
      const jobData = {
        status: 500,
        message: "Jobs not retrieved",
      };
      res.status(500).json(jobData);
    }
  },
};
