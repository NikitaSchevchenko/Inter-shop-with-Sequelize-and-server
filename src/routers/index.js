const { Router } = require("express");
const itemRouter = require("./itemRouter");
const orderRouter = require("./orderRouter");
const modelRouter = require("./modelRouter");
const brandRouter = require("./brandRouter");
const customerRouter = require("./customerRouter");
const storeRouter = require("./storeRouter");
const itemCategoryRouter = require("./itemCategoryRouter");
const itemTypeRouter = require("./itemTypeRouter");
const itemOrderRouter = require("./itemOrderRouter");

const router = new Router();

router.use("/items", itemRouter);
router.use("/orders", orderRouter);
router.use("/models", modelRouter);
router.use("/brands", brandRouter);
router.use("/customers", customerRouter);
router.use("/stores", storeRouter);
router.use("/categories", itemCategoryRouter);
router.use("/types", itemTypeRouter);
router.use("/item-orders", itemOrderRouter);

module.exports = router;