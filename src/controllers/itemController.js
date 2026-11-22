const { Item, Brand } = require("../db/models");
const { Op, where } = require("sequelize");

class ItemController {
  async getAll(req, res, next) {
    try {
      const items = await Item.findAll({
        limit: 10,
        order: [["id", "ASC"]],
      });
      return res.json(items);
    } catch (err) {
      next(err);
    }
  }

  async getGreaterThanId(req, res, next) {
    try {
      let treshholdId;
      const idParam = req.query.minId;

      if (idParam !== undefined) {
        treshholdId = Number(idParam);

        if (Number.isNaN(treshholdId)) {
          return res.status(400).json({ message: "minId must be integer" });
        }
      } else {
        const itemsCount = await Item.count();

        if (itemsCount === 0) {
          return res.json([]);
        }

        const middleOffset = Math.floor((itemsCount - 1) / 2);
        const middleItem = await Item.findOne({
          attributes: ["id"],
          offset: middleOffset,
          order: [["id", "ASC"]],
        });
        treshholdId = middleItem.id;
      }

      const items = await Item.findAll({
        where: {
          id: {
            [Op.gte]: treshholdId,
          },
        },
        order: [["id", "ASC"]],
      });
      return res.json(items);
    } catch (err) {
      next(err);
    }
  }

  async getByBrandsName(req, res, next) {
    try {
      const brandsQuery = req.query.brands;
      if (!brandsQuery || typeof brandsQuery !== "string") {
        return res.status(400).json({
          message:
            "Query parameter 'brands' is required (e.g., ?brands=Apple,Samsung,Lenovo)",
        });
      }
      const brandTitles = brandsQuery
        .split(",")
        .map((title) => title.trim())
        .filter(Boolean);

      if (!brandTitles.length) {
        return res
          .status(400)
          .json({ message: "Provide at least one brand title" });
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
      const items = await Item.findAll({
        where: {
          brand_id: {
            [Op.in]: brandIds,
          },
        },
      });
      return res.json(items);
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

      const deletedCount = await Item.destroy({
        where: {
          id: {
            [Op.in]: ids,
          },
        },
      });

      if (!deletedCount) {
        return res.status(404).json({
          message: "No items found with the given ids",
        });
      }

      return res.json({
        message: `Deleted ${deletedCount} item(s)`,
        deletedIds: ids,
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const itemId = Number(req.params.id);
      if (!Number.isInteger(itemId)) {
        return res.status(400).json({ message: "Item id must be an integer" });
      }

      if (!req.body || !Object.keys(req.body).length) {
        return res
          .status(400)
          .json({ message: "Request body cannot be empty" });
      }

      const [updatedCount, updatedItems] = await Item.update(req.body, {
        where: {
          id: itemId,
        },
        returning: true,
      });

      if (!updatedCount) {
        return res.status(404).json({ message: "Item not found" });
      }
      return res.json(updatedItems[0]);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ItemController();
