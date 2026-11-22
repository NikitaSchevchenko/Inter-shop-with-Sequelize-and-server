const { Router } = require("express");
const itemCategoryController = require("../controllers/itemCategoryController");
const { validate } = require("../middlewares");
const { ITEM_CATEGORY_UPDATE_SCHEMA } = require("../validationSchemas");

const router = new Router();

router.get("/after", itemCategoryController.getGreaterThanId);
router.get("/by-titles", itemCategoryController.getByTitles);

router
    .route("/")
    .get(itemCategoryController.getAll)
    .delete(itemCategoryController.deleteByIds);

router
    .route("/:id")
    .patch(validate(ITEM_CATEGORY_UPDATE_SCHEMA), itemCategoryController.update);

module.exports = router;