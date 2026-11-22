const { Router } = require("express");
const itemTypeController = require("../controllers/itemTypeController");
const { validate } = require("../middlewares");
const { ITEM_TYPE_UPDATE_SCHEMA } = require("../validationSchemas");

const router = new Router();

router.get("/after", itemTypeController.getGreaterThanId);
router.get("/by-titles", itemTypeController.getByTitles);

router
    .route("/")
    .get(itemTypeController.getAll)
    .delete(itemTypeController.deleteByIds);

router
    .route("/:id")
    .patch(validate(ITEM_TYPE_UPDATE_SCHEMA), itemTypeController.update);

module.exports = router;