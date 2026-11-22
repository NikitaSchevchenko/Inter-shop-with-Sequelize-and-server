const { ItemOrder } = require("../db/models");
const { Op } = require("sequelize");

class ItemOrderController {
    async getAll(req, res, next) {
        try {
            const itemOrders = await ItemOrder.findAll({
                limit: 10,
                order: [["orders_id", "ASC"]],
            });
            return res.json(itemOrders);
        } catch (err) {
            next(err);
        }
    }

    async getGreaterThanOrderId(req, res, next) {
        try {
            let thresholdId;
            const idParam = req.query.minId;

            if (idParam !== undefined) {
                thresholdId = Number(idParam);

                if (Number.isNaN(thresholdId)) {
                    return res.status(400).json({ message: "minId must be integer" });
                }
            } else {
                const count = await ItemOrder.count();

                if (count === 0) {
                    return res.json([]);
                }

                const middleOffset = Math.floor((count - 1) / 2);
                const middleRecord = await ItemOrder.findOne({
                    attributes: ["orders_id"],
                    offset: middleOffset,
                    order: [["orders_id", "ASC"]],
                });
                thresholdId = middleRecord.orders_id;
            }

            const itemOrders = await ItemOrder.findAll({
                where: {
                    orders_id: {
                        [Op.gte]: thresholdId,
                    },
                },
                order: [["orders_id", "ASC"]],
            });
            return res.json(itemOrders);
        } catch (err) {
            next(err);
        }
    }

    async getByOrderIds(req, res, next) {
        try {
            const orderIdsQuery = req.query.orderIds;
            if (!orderIdsQuery || typeof orderIdsQuery !== "string") {
                return res.status(400).json({
                    message: "Query parameter 'orderIds' is required (e.g., ?orderIds=1,2,3)",
                });
            }

            const orderIds = orderIdsQuery
                .split(",")
                .map((id) => Number(id.trim()))
                .filter((id) => Number.isInteger(id));

            if (!orderIds.length) {
                return res.status(400).json({ message: "Provide at least one valid order id" });
            }

            const itemOrders = await ItemOrder.findAll({
                where: {
                    orders_id: {
                        [Op.in]: orderIds,
                    },
                },
            });

            if (!itemOrders.length) {
                return res.status(404).json({
                    message: "No records found for the specified order ids",
                });
            }

            return res.json(itemOrders);
        } catch (err) {
            next(err);
        }
    }

    async deleteByOrderIds(req, res, next) {
        try {
            const { ids } = req.body;
            if (!Array.isArray(ids) || !ids.length) {
                return res.status(400).json({
                    message: "Body must contain a non-empty 'ids' array",
                });
            }

            const deletedCount = await ItemOrder.destroy({
                where: {
                    orders_id: {
                        [Op.in]: ids,
                    },
                },
            });

            if (!deletedCount) {
                return res.status(404).json({
                    message: "No records found with the given order ids",
                });
            }

            return res.json({
                message: `Deleted ${deletedCount} record(s)`,
                deletedOrderIds: ids,
            });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const orderId = Number(req.params.id);
            if (!Number.isInteger(orderId)) {
                return res.status(400).json({ message: "Order id must be an integer" });
            }

            const [updatedCount, updatedRecords] = await ItemOrder.update(req.body, {
                where: {
                    orders_id: orderId,
                },
                returning: true,
            });

            if (!updatedCount) {
                return res.status(404).json({ message: "Record not found" });
            }
            return res.json(updatedRecords[0]);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ItemOrderController();