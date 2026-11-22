const { Customer, Order, Item, sequelize } = require("../db/models");
const { Op, fn, col, literal, QueryTypes } = require("sequelize");

class CustomerController {
  async getAll(req, res, next) {
    try {
      const customers = await Customer.findAll({
        limit: 10,
        order: [["id", "ASC"]],
      });
      return res.json(customers);
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
        const customersCount = await Customer.count();

        if (customersCount === 0) {
          return res.json([]);
        }

        const middleOffset = Math.floor((customersCount - 1) / 2);
        const middleCustomer = await Customer.findOne({
          attributes: ["id"],
          offset: middleOffset,
          order: [["id", "ASC"]],
        });
        thresholdId = middleCustomer.id;
      }

      const customers = await Customer.findAll({
        where: {
          id: {
            [Op.gte]: thresholdId,
          },
        },
        order: [["id", "ASC"]],
      });
      return res.json(customers);
    } catch (err) {
      next(err);
    }
  }

  async getByEmails(req, res, next) {
    try {
      const emailsQuery = req.query.emails;
      if (!emailsQuery || typeof emailsQuery !== "string") {
        return res.status(400).json({
          message:
            "Query parameter 'emails' is required (e.g., ?emails=ivan@gmail.com,olena@gmail.com)",
        });
      }

      const customerEmails = emailsQuery
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean);

      if (!customerEmails.length) {
        return res
          .status(400)
          .json({ message: "Provide at least one customer email" });
      }

      const customers = await Customer.findAll({
        where: {
          email: {
            [Op.in]: customerEmails,
          },
        },
      });

      if (!customers.length) {
        return res.status(404).json({
          message: "None of the specified customers were found",
        });
      }

      return res.json(customers);
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

      const deletedCount = await Customer.destroy({
        where: {
          id: {
            [Op.in]: ids,
          },
        },
      });

      if (!deletedCount) {
        return res.status(404).json({
          message: "No customers found with the given ids",
        });
      }

      return res.json({
        message: `Deleted ${deletedCount} customer(s)`,
        deletedIds: ids,
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const customerId = Number(req.params.id);
      if (!Number.isInteger(customerId)) {
        return res
          .status(400)
          .json({ message: "Customer id must be an integer" });
      }

      if (!req.body || !Object.keys(req.body).length) {
        return res
          .status(400)
          .json({ message: "Request body cannot be empty" });
      }

      const [updatedCount, updatedCustomers] = await Customer.update(req.body, {
        where: {
          id: customerId,
        },
        returning: true,
      });

      if (!updatedCount) {
        return res.status(404).json({ message: "Customer not found" });
      }
      return res.json(updatedCustomers[0]);
    } catch (err) {
      next(err);
    }
  }

  async getTopBuyer(req, res, next) {
    try {
      const topBuyers = await Customer.findAll({
        attributes: [
          "id",
          "name",
          [fn("COUNT", col("Orders.id")), "ordersCount"],
        ],
        include: [
          {
            model: Order,
            attributes: [],
            required: true,
          },
        ],
        group: ["Customer.id", "Customer.name"],
        having: literal(`COUNT("Orders"."id") = (
                SELECT MAX(orders_count)
                FROM (
                    SELECT COUNT(*) AS orders_count
                    FROM orders
                    GROUP BY customer_id
                ) t
            )`),
      });

      return res.json(topBuyers);
    } catch (err) {
      next(err);
    }
  }

  async getMostExpensiveItemBuyer(req, res, next) {
    try {
      const result = await sequelize.query(
        `SELECT c.id, c.name, i.price
             FROM customers c
             JOIN orders o ON c.id = o.customer_id
             JOIN item_order oi ON o.id = oi.orders_id
             JOIN items i ON oi.item_id = i.id
             ORDER BY i.price DESC
             FETCH FIRST 1 ROWS WITH TIES;`,
        { type: QueryTypes.SELECT },
      );
      return res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CustomerController();
