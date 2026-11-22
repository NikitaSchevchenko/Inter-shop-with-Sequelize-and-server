const { Order, Customer } = require("../db/models");
const { Op } = require("sequelize");

class OrderController {
    async getAll(req, res, next) {
        try {
            const orders = await Order.findAll({
                limit: 10,
                order: [["id", "ASC"]],
            });
            return res.json(orders);
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
                const ordersCount = await Order.count();

                if (ordersCount === 0) {
                    return res.json([]);
                }

                const middleOffset = Math.floor((ordersCount - 1) / 2);
                const middleOrder = await Order.findOne({
                    attributes: ["id"],
                    offset: middleOffset,
                    order: [["id", "ASC"]],
                });
                thresholdId = middleOrder.id;
            }

            const orders = await Order.findAll({
                where: {
                    id: {
                        [Op.gte]: thresholdId,
                    },
                },
                order: [["id", "ASC"]],
            });
            return res.json(orders);
        } catch (err) {
            next(err);
        }
    }

    async getByCustomerEmails(req, res, next) {
        try {
            const emailsQuery = req.query.emails;
            if (!emailsQuery || typeof emailsQuery !== "string") {
                return res.status(400).json({
                    message: "Query parameter 'emails' is required (e.g., ?emails=ivan@gmail.com,olena@gmail.com)",
                });
            }

            const customerEmails = emailsQuery
                .split(",")
                .map((email) => email.trim())
                .filter(Boolean);

            if (!customerEmails.length) {
                return res.status(400).json({ message: "Provide at least one customer email" });
            }

            const customers = await Customer.findAll({
                where: {
                    email: {
                        [Op.in]: customerEmails,
                    },
                },
                attributes: ["id"],
            });

            if (!customers.length) {
                return res.status(404).json({
                    message: "None of the specified customers were found",
                });
            }

            const customerIds = customers.map((customer) => customer.id);
            const orders = await Order.findAll({
                where: {
                    customer_id: {
                        [Op.in]: customerIds,
                    },
                },
            });
            return res.json(orders);
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

            const deletedCount = await Order.destroy({
                where: {
                    id: {
                        [Op.in]: ids,
                    },
                },
            });

            if (!deletedCount) {
                return res.status(404).json({
                    message: "No orders found with the given ids",
                });
            }

            return res.json({
                message: `Deleted ${deletedCount} order(s)`,
                deletedIds: ids,
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

            if (!req.body || !Object.keys(req.body).length) {
                return res.status(400).json({ message: "Request body cannot be empty" });
            }

            const [updatedCount, updatedOrders] = await Order.update(req.body, {
                where: {
                    id: orderId,
                },
                returning: true,
            });

            if (!updatedCount) {
                return res.status(404).json({ message: "Order not found" });
            }
            return res.json(updatedOrders[0]);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new OrderController();