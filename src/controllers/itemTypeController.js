const { ItemType } = require("../db/models");
const { Op } = require("sequelize");

class ItemTypeController {
    async getAll(req, res, next) {
        try {
            const types = await ItemType.findAll({
                limit: 10,
                order: [["id", "ASC"]],
            });
            return res.json(types);
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
                const typesCount = await ItemType.count();

                if (typesCount === 0) {
                    return res.json([]);
                }

                const middleOffset = Math.floor((typesCount - 1) / 2);
                const middleType = await ItemType.findOne({
                    attributes: ["id"],
                    offset: middleOffset,
                    order: [["id", "ASC"]],
                });
                thresholdId = middleType.id;
            }

            const types = await ItemType.findAll({
                where: {
                    id: {
                        [Op.gte]: thresholdId,
                    },
                },
                order: [["id", "ASC"]],
            });
            return res.json(types);
        } catch (err) {
            next(err);
        }
    }

    async getByTitles(req, res, next) {
        try {
            const titlesQuery = req.query.titles;
            if (!titlesQuery || typeof titlesQuery !== "string") {
                return res.status(400).json({
                    message: "Query parameter 'titles' is required (e.g., ?titles=Смартфон,Ноутбук)",
                });
            }

            const typeTitles = titlesQuery
                .split(",")
                .map((title) => title.trim())
                .filter(Boolean);

            if (!typeTitles.length) {
                return res.status(400).json({ message: "Provide at least one type title" });
            }

            const types = await ItemType.findAll({
                where: {
                    title: {
                        [Op.in]: typeTitles,
                    },
                },
            });

            if (!types.length) {
                return res.status(404).json({
                    message: "None of the specified types were found",
                });
            }

            return res.json(types);
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

            const deletedCount = await ItemType.destroy({
                where: {
                    id: {
                        [Op.in]: ids,
                    },
                },
            });

            if (!deletedCount) {
                return res.status(404).json({
                    message: "No types found with the given ids",
                });
            }

            return res.json({
                message: `Deleted ${deletedCount} type(s)`,
                deletedIds: ids,
            });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const typeId = Number(req.params.id);
            if (!Number.isInteger(typeId)) {
                return res.status(400).json({ message: "Type id must be an integer" });
            }

            if (!req.body || !Object.keys(req.body).length) {
                return res.status(400).json({ message: "Request body cannot be empty" });
            }

            const [updatedCount, updatedTypes] = await ItemType.update(req.body, {
                where: {
                    id: typeId,
                },
                returning: true,
            });

            if (!updatedCount) {
                return res.status(404).json({ message: "Type not found" });
            }
            return res.json(updatedTypes[0]);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ItemTypeController();