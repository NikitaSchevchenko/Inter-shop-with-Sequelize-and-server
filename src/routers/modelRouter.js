const { Router } = require("express");
const modelController = require("../controllers/modelController");
const { validate } = require("../middlewares");
const { MODEL_UPDATE_SCHEMA } = require("../validationSchemas");

const router = new Router();

router.get("/after", modelController.getGreaterThanId);
router.get("/by-brands", modelController.getByBrandsName);

router
    .route("/")
    .get(modelController.getAll)
    .delete(modelController.deleteByIds);

router
    .route("/:id")
    .patch(validate(MODEL_UPDATE_SCHEMA), modelController.update);

module.exports = router;