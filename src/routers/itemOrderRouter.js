const { Router } = require("express");
const itemOrderController = require("../controllers/itemOrderController");
const { validate } = require("../middlewares");
const { ITEM_ORDER_UPDATE_SCHEMA } = require("../validationSchemas");

const router = new Router();

router.get("/after", itemOrderController.getGreaterThanOrderId);
router.get("/by-orders", itemOrderController.getByOrderIds);

router
    .route("/")
    .get(itemOrderController.getAll)
    .delete(itemOrderController.deleteByOrderIds);

router
    .route("/:id")
    .patch(validate(ITEM_ORDER_UPDATE_SCHEMA), itemOrderController.update);

module.exports = router;