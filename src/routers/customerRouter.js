const { Router } = require("express");
const customerController = require("../controllers/customerController");
const { validate } = require("../middlewares");
const { CUSTOMER_UPDATE_SCHEMA } = require("../validationSchemas");

const router = new Router();

router.get("/after", customerController.getGreaterThanId);
router.get("/by-emails", customerController.getByEmails);
router.get("/top-buyer", customerController.getTopBuyer);
router.get("/most-expensive-buyer", customerController.getMostExpensiveItemBuyer);

router
    .route("/")
    .get(customerController.getAll)
    .delete(customerController.deleteByIds);

router
    .route("/:id")
    .patch(validate(CUSTOMER_UPDATE_SCHEMA), customerController.update);

module.exports = router;