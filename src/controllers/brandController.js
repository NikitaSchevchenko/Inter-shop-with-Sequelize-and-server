const { Brand } = require("../db/models");
const { Op } = require("sequelize");

class BrandController {
    async getAll(req, res, next) {
        try {
            const brands = await Brand.findAll({
                limit: 10,
                order: [["id", "ASC"]],
            });
            return res.json(brands);
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
                const brandsCount = await Brand.count();

                if (brandsCount === 0) {
                    return res.json([]);
                }

                const middleOffset = Math.floor((brandsCount - 1) / 2);
                const middleBrand = await Brand.findOne({
                    attributes: ["id"],
                    offset: middleOffset,
                    order: [["id", "ASC"]],
                });
                thresholdId = middleBrand.id;
            }

            const brands = await Brand.findAll({
                where: {
                    id: {
                        [Op.gte]: thresholdId,
                    },
                },
                order: [["id", "ASC"]],
            });
            return res.json(brands);
        } catch (err) {
            next(err);
        }
    }

    async getByTitles(req, res, next) {
        try {
            const titlesQuery = req.query.titles;
            if (!titlesQuery || typeof titlesQuery !== "string") {
                return res.status(400).json({
                    message: "Query parameter 'titles' is required (e.g., ?titles=Apple,Samsung,Sony)",
                });
            }

            const brandTitles = titlesQuery
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
            });

            if (!brands.length) {
                return res.status(404).json({
                    message: "None of the specified brands were found",
                });
            }

            return res.json(brands);
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

            const deletedCount = await Brand.destroy({
                where: {
                    id: {
                        [Op.in]: ids,
                    },
                },
            });

            if (!deletedCount) {
                return res.status(404).json({
                    message: "No brands found with the given ids",
                });
            }

            return res.json({
                message: `Deleted ${deletedCount} brand(s)`,
                deletedIds: ids,
            });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const brandId = Number(req.params.id);
            if (!Number.isInteger(brandId)) {
                return res.status(400).json({ message: "Brand id must be an integer" });
            }

            if (!req.body || !Object.keys(req.body).length) {
                return res.status(400).json({ message: "Request body cannot be empty" });
            }

            const [updatedCount, updatedBrands] = await Brand.update(req.body, {
                where: {
                    id: brandId,
                },
                returning: true,
            });

            if (!updatedCount) {
                return res.status(404).json({ message: "Brand not found" });
            }
            return res.json(updatedBrands[0]);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new BrandController();