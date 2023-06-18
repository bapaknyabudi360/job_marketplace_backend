const Bookmark = require("../models/Bookmark");

module.exports = {
  createBookmark: async (req, res) => {
    const newBookmark = new Bookmark(req.body);
    try {
      const savedBookmark = await newBookmark.save();
      const { __v, ...others } = savedBookmark._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  deleteBookmark: async (req, res) => {
    try {
      await Bookmark.findByIdAndDelete(req.params.id);
      res.status(200).json("Bookmark has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getBookmarks: async (req, res) => {
    try {
      const bookmarks = await Bookmark.find({ userId: req.params.userId });
      res.status(200).json(bookmarks);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
