const Bookmark = require("../models/Bookmark");
const Job = require("../models/Job");

module.exports = {
  createBookmark: async (req, res) => {
    const jobId = new Bookmark(req.body.job);
    try {
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ status: 404, message: "Job not found" });
      }
      const newBookmark = new Bookmark({
        job: job,
        userId: req.user.id,
      });
      const savedBookmark = await newBookmark.save();
      const { __v, ...others } = savedBookmark._doc;
      const bookmarkData = {
        status: 200,
        message: "Bookmark created successfully",
        data: others,
      };
      res.status(200).json(bookmarkData);
    } catch (err) {
      const bookmarkData = {
        status: 500,
        message: "Bookmark not created",
      };
      res.status(500).json(bookmarkData);
    }
  },

  deleteBookmark: async (req, res) => {
    try {
      await Bookmark.findByIdAndDelete(req.params.id);
      const bookmarkData = {
        status: 200,
        message: "Bookmark deleted successfully",
      };
      res.status(200).json(bookmarkData);
    } catch (err) {
      const bookmarkData = {
        status: 500,
        message: "Bookmark not deleted",
      };
      res.status(500).json(bookmarkData);
    }
  },

  getBookmarks: async (req, res) => {
    try {
      const bookmarks = await Bookmark.find({ userId: req.params.userId });
      const bookmarkData = {
        status: 200,
        message: "Bookmarks retrieved successfully",
        data: bookmarks,
      };
      res.status(200).json(bookmarkData);
    } catch (err) {
      const bookmarkData = {
        status: 500,
        message: "Bookmarks not retrieved",
      };
      res.status(500).json(bookmarkData);
    }
  },
};
