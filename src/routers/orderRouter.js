const { Router } = require("express");
const orderController = require("../controllers/orderController");
const { validate } = require("../middlewares");
const { ORDER_UPDATE_SCHEMA } = require("../validationSchemas");

const router = new Router();

router.get("/after", orderController.getGreaterThanId);
router.get("/by-customers", orderController.getByCustomerEmails);

router
    .route("/")
    .get(orderController.getAll)
    .delete(orderController.deleteByIds);

router
    .route("/:id")
    .patch(validate(ORDER_UPDATE_SCHEMA), orderController.update);

module.exports = router;