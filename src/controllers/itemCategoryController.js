const { ItemCategory } = require("../db/models");
const { Op } = require("sequelize");

class ItemCategoryController {
    async getAll(req, res, next) {
        try {
            const categories = await ItemCategory.findAll({
                limit: 10,
                order: [["id", "ASC"]],
            });
            return res.json(categories);
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
                const categoriesCount = await ItemCategory.count();

                if (categoriesCount === 0) {
                    return res.json([]);
                }

                const middleOffset = Math.floor((categoriesCount - 1) / 2);
                const middleCategory = await ItemCategory.findOne({
                    attributes: ["id"],
                    offset: middleOffset,
                    order: [["id", "ASC"]],
                });
                thresholdId = middleCategory.id;
            }

            const categories = await ItemCategory.findAll({
                where: {
                    id: {
                        [Op.gte]: thresholdId,
                    },
                },
                order: [["id", "ASC"]],
            });
            return res.json(categories);
        } catch (err) {
            next(err);
        }
    }

    async getByTitles(req, res, next) {
        try {
            const titlesQuery = req.query.titles;
            if (!titlesQuery || typeof titlesQuery !== "string") {
                return res.status(400).json({
                    message: "Query parameter 'titles' is required (e.g., ?titles=Електроніка,Сантехніка)",
                });
            }

            const categoryTitles = titlesQuery
                .split(",")
                .map((title) => title.trim())
                .filter(Boolean);

            if (!categoryTitles.length) {
                return res.status(400).json({ message: "Provide at least one category title" });
            }

            const categories = await ItemCategory.findAll({
                where: {
                    title: {
                        [Op.in]: categoryTitles,
                    },
                },
            });

            if (!categories.length) {
                return res.status(404).json({
                    message: "None of the specified categories were found",
                });
            }

            return res.json(categories);
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

            const deletedCount = await ItemCategory.destroy({
                where: {
                    id: {
                        [Op.in]: ids,
                    },
                },
            });

            if (!deletedCount) {
                return res.status(404).json({
                    message: "No categories found with the given ids",
                });
            }

            return res.json({
                message: `Deleted ${deletedCount} category(ies)`,
                deletedIds: ids,
            });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const categoryId = Number(req.params.id);
            if (!Number.isInteger(categoryId)) {
                return res.status(400).json({ message: "Category id must be an integer" });
            }

            if (!req.body || !Object.keys(req.body).length) {
                return res.status(400).json({ message: "Request body cannot be empty" });
            }

            const [updatedCount, updatedCategories] = await ItemCategory.update(req.body, {
                where: {
                    id: categoryId,
                },
                returning: true,
            });

            if (!updatedCount) {
                return res.status(404).json({ message: "Category not found" });
            }
            return res.json(updatedCategories[0]);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ItemCategoryController();