const { Router } = require("express");
const storeController = require("../controllers/storeController");
const { validate } = require("../middlewares");
const { STORE_UPDATE_SCHEMA } = require("../validationSchemas");

const router = new Router();

router.get("/after", storeController.getGreaterThanId);
router.get("/by-titles", storeController.getByTitles);

router
    .route("/")
    .get(storeController.getAll)
    .delete(storeController.deleteByIds);

router
    .route("/:id")
    .patch(validate(STORE_UPDATE_SCHEMA), storeController.update);

module.exports = router;