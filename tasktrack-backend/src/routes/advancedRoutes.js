const express = require("express");
const router = express.Router({ mergeParams: true });
const authMiddleware = require("../middleware/authMiddleware");
const {
  addSubtask,
  getSubtasks,
  toggleSubtask,
  deleteSubtask,
} = require("../controllers/advancedController");

// all protected routes
router.use(authMiddleware);

router.post("/", addSubtask);

router.get("/", getSubtasks);

router.put("/:subtaskId", toggleSubtask);

router.delete("/:subtaskId", deleteSubtask);

module.exports = router;
