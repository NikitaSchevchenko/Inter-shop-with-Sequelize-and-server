const { Store } = require("../db/models");
const { Op } = require("sequelize");

class StoreController {
    async getAll(req, res, next) {
        try {
            const stores = await Store.findAll({
                limit: 10,
                order: [["id", "ASC"]],
            });
            return res.json(stores);
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
                const storesCount = await Store.count();

                if (storesCount === 0) {
                    return res.json([]);
                }

                const middleOffset = Math.floor((storesCount - 1) / 2);
                const middleStore = await Store.findOne({
                    attributes: ["id"],
                    offset: middleOffset,
                    order: [["id", "ASC"]],
                });
                thresholdId = middleStore.id;
            }

            const stores = await Store.findAll({
                where: {
                    id: {
                        [Op.gte]: thresholdId,
                    },
                },
                order: [["id", "ASC"]],
            });
            return res.json(stores);
        } catch (err) {
            next(err);
        }
    }

    async getByTitles(req, res, next) {
        try {
            const titlesQuery = req.query.titles;
            if (!titlesQuery || typeof titlesQuery !== "string") {
                return res.status(400).json({
                    message: "Query parameter 'titles' is required (e.g., ?titles=Київ,Львів)",
                });
            }

            const storeTitles = titlesQuery
                .split(",")
                .map((title) => title.trim())
                .filter(Boolean);

            if (!storeTitles.length) {
                return res.status(400).json({ message: "Provide at least one store title" });
            }

            const stores = await Store.findAll({
                where: {
                    title: {
                        [Op.in]: storeTitles,
                    },
                },
            });

            if (!stores.length) {
                return res.status(404).json({
                    message: "None of the specified stores were found",
                });
            }

            return res.json(stores);
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

            const deletedCount = await Store.destroy({
                where: {
                    id: {
                        [Op.in]: ids,
                    },
                },
            });

            if (!deletedCount) {
                return res.status(404).json({
                    message: "No stores found with the given ids",
                });
            }

            return res.json({
                message: `Deleted ${deletedCount} store(s)`,
                deletedIds: ids,
            });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const storeId = Number(req.params.id);
            if (!Number.isInteger(storeId)) {
                return res.status(400).json({ message: "Store id must be an integer" });
            }

            if (!req.body || !Object.keys(req.body).length) {
                return res.status(400).json({ message: "Request body cannot be empty" });
            }

            const [updatedCount, updatedStores] = await Store.update(req.body, {
                where: {
                    id: storeId,
                },
                returning: true,
            });

            if (!updatedCount) {
                return res.status(404).json({ message: "Store not found" });
            }
            return res.json(updatedStores[0]);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new StoreController();