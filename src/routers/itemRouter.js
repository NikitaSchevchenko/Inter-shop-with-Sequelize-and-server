const { Router } = require("express");
const itemController = require("../controllers/itemController");
const { validate } = require("../middlewares");
const { ITEM_UPDATE_SCHEMA } = require("../validationSchemas");

const router = new Router();

router.get("/after", itemController.getGreaterThanId);
router.get("/by-brands", itemController.getByBrandsName);

router
    .route("/")
    .get(itemController.getAll)
    .delete(itemController.deleteByIds);

router
    .route("/:id")
    .patch(validate(ITEM_UPDATE_SCHEMA), itemController.update);

module.exports = router;