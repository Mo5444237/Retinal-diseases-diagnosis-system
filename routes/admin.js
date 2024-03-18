const app = require("express");
const isAuth = require("../middlewares/is-auth");
const {
  getMessages,
  getMessageDetails,
  sendReply,
  addAdmin,
  deleteAdmin,
  getAdmins,
  getAdminDetails,
} = require("../controllers/admin");
const isAdmin = require("../middlewares/is-admin");
const {
  addAdminValiadion,
  replyToMessageValiadion,
} = require("../validation/admin");
const router = app.Router();

router.use(isAuth, isAdmin);

router.get("/messages", getMessages);
router.get("/messages/:messageId", getMessageDetails);
router.post("/messages/reply", replyToMessageValiadion, sendReply);

router.get("/all", getAdmins);
router.get("/:adminId", getAdminDetails);
router.post("/add-admin", addAdminValiadion, addAdmin);
router.delete("/delete-admin", deleteAdmin);

module.exports = router;
