const { Router } = require("express");
const brandController = require("../controllers/brandController");
const { validate } = require("../middlewares");
const { BRAND_UPDATE_SCHEMA } = require("../validationSchemas");

const router = new Router();

router.get("/after", brandController.getGreaterThanId);
router.get("/by-titles", brandController.getByTitles);

router
    .route("/")
    .get(brandController.getAll)
    .delete(brandController.deleteByIds);

router
    .route("/:id")
    .patch(validate(BRAND_UPDATE_SCHEMA), brandController.update);

module.exports = router;