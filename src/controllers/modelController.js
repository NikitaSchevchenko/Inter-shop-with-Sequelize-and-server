const { Model, Brand } = require("../db/models");
const { Op } = require("sequelize");

class ModelController {
    async getAll(req, res, next) {
        try {
            const models = await Model.findAll({
                limit: 10,
                order: [["id", "ASC"]],
            });
            return res.json(models);
        } catch (err) {
            next(err);
        }
    }

    async getGreaterThanId(req, res, next) {
        try {
            let thresholdId;
            const idParam = req.query.minId;

            if (idParam !== undefined) {
                thresholdId = Number(idParam);

                if (Number.isNaN(thresholdId)) {
                    return res.status(400).json({ message: "minId must be integer" });
                }
            } else {
                const modelsCount = await Model.count();

                if (modelsCount === 0) {
                    return res.json([]);
                }

                const middleOffset = Math.floor((modelsCount - 1) / 2);
                const middleModel = await Model.findOne({
                    attributes: ["id"],
                    offset: middleOffset,
                    order: [["id", "ASC"]],
                });
                thresholdId = middleModel.id;
            }

            const models = await Model.findAll({
                where: {
                    id: {
                        [Op.gte]: thresholdId,
                    },
                },
                order: [["id", "ASC"]],
            });
            return res.json(models);
        } catch (err) {
            next(err);
        }
    }

    async getByBrandsName(req, res, next) {
        try {
            const brandsQuery = req.query.brands;
            if (!brandsQuery || typeof brandsQuery !== "string") {
                return res.status(400).json({
                    message: "Query parameter 'brands' is required (e.g., ?brands=Apple,Samsung,Lenovo)",
                });
            }

            const brandTitles = brandsQuery
                .split(",")
                .map((title) => title.trim())
                .filter(Boolean);

            if (!brandTitles.length) {
                return res.status(400).json({ message: "Provide at least one brand title" });
            }

            const brands = await Brand.findAll({
                where: {
                    title: {
                        [Op.in]: brandTitles,
                    },
                },
                attributes: ["id"],
            });

            if (!brands.length) {
                return res.status(404).json({
                    message: "None of the specified brands were found",
                });
            }

            const brandIds = brands.map((brand) => brand.id);
            const models = await Model.findAll({
                where: {
                    brand_id: {
                        [Op.in]: brandIds,
                    },
                },
            });
            return res.json(models);
        } catch (err) {
            next(err);
        }
    }

    async deleteByIds(req, res, next) {
        try {
            const { ids } = req.body;
            if (!Array.isArray(ids) || !ids.length) {
                return res.status(400).json({
                    message: "Body must contain a non-empty 'ids' array",
                });
            }

            const deletedCount = await Model.destroy({
                where: {
                    id: {
                        [Op.in]: ids,
                    },
                },
            });

            if (!deletedCount) {
                return res.status(404).json({
                    message: "No models found with the given ids",
                });
            }

            return res.json({
                message: `Deleted ${deletedCount} model(s)`,
                deletedIds: ids,
            });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const modelId = Number(req.params.id);
            if (!Number.isInteger(modelId)) {
                return res.status(400).json({ message: "Model id must be an integer" });
            }

            if (!req.body || !Object.keys(req.body).length) {
                return res.status(400).json({ message: "Request body cannot be empty" });
            }

            const [updatedCount, updatedModels] = await Model.update(req.body, {
                where: {
                    id: modelId,
                },
                returning: true,
            });

            if (!updatedCount) {
                return res.status(404).json({ message: "Model not found" });
            }
            return res.json(updatedModels[0]);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ModelController();