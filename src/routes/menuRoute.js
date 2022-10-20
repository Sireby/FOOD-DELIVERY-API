const express = require("express");
const menuController = require("../controllers/menuController");
const { auth, checkUser } = require("../middleware/authMiddleware");

const menuRouter = express.Router();

const { addMenuItem, updateMenuItem, getMenuItem, getMenuItems, deleteMenuItem } =
  menuController;

menuRouter
  .route("/product")
  .post(/* auth, checkUser("vendor"),*/ addMenuItem)
  //.put(auth, checkUser("vendor"), updateProduct)
  .get(/*auth,*/ getMenuItems)

  menuRouter.delete("/product/:id",/*auth,  checkUser("vendor", "admin"),*/ deleteMenuItem);

menuRouter.put("/product/:id", /*auth, checkUser("vendor"),*/ updateMenuItem);
menuRouter.get("/product/:id", getMenuItem);

module.exports = menuRouter;
