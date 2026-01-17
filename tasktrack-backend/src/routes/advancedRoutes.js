const express = require("express");
const router = express.Router({ mergeParams: true });
const authMiddleware = require("../middleware/authMiddleware");
const {
  addSubtask,
  getSubtasks,
  toggleSubtask,
  deleteSubtask,
  updateSubtask,
} = require("../controllers/advancedController");

// all protected routes
router.use(authMiddleware);

router.post("/", addSubtask);

router.get("/", getSubtasks);

router.patch("/:subtaskId", toggleSubtask);

router.delete("/:subtaskId", deleteSubtask);

router.put("/:subtaskId", updateSubtask);

module.exports = router;
