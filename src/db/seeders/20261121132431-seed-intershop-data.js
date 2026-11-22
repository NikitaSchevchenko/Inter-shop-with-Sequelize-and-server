"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("item_categories", [
      { title: "Електроніка", description: "Електронні пристрої та аксесуари" },
      { title: "Побутова техніка", description: "Техніка для дому" },
      {
        title: "Комп'ютери та комплектуючі",
        description: "Комп'ютери, ноутбуки та комплектуючі",
      },
      {
        title: "Спортивні товари",
        description: "Товари для спорту та активного відпочинку",
      },
      {
        title: "Сантехніка",
        description: "Обладнання для ванної кімнати та кухні",
      },
      { title: "Ігрові товари", description: "Консолі, ігри та аксесуари" },
    ]);

    await queryInterface.bulkInsert("item_types", [
      { title: "Смартфон", description: "Мобільний телефон" },
      { title: "Ноутбук", description: "Портативний комп'ютер" },
      { title: "Монітор", description: "Пристрій виводу зображення" },
      { title: "Пральна машина", description: "Побутова техніка для прання" },
      { title: "Велосипед", description: "Двоколісний транспорт" },
      {
        title: "Ігрова консоль",
        description: "Пристрій для запуску відеоігор",
      },
    ]);

    await queryInterface.bulkInsert("brands", [
      { title: "Apple", description: "Американський бренд електроніки" },
      { title: "Samsung", description: "Південнокорейський бренд" },
      { title: "Lenovo", description: "Китайський бренд" },
      { title: "Bosch", description: "Німецький бренд побутової техніки" },
      { title: "Trek", description: "Виробник велосипедів" },
      { title: "Sony", description: "Японський виробник електроніки" },
    ]);

    await queryInterface.bulkInsert("stores", [
      { title: "Київ", description: "Центральний склад" },
      { title: "Львів", description: "Західний склад" },
      { title: "Одеса", description: "Південний склад" },
      { title: "Дніпро", description: "Центрально-східний склад" },
      { title: "Харків", description: "Східний склад" },
      { title: "Вінниця", description: "Регіональний склад" },
    ]);

    await queryInterface.bulkInsert("customers", [
      {
        name: "Іван Петренко",
        email: "ivan@gmail.com",
        password: bcrypt.hashSync("password123", 10),
      },
      {
        name: "Олена Коваль",
        email: "olena@gmail.com",
        password: bcrypt.hashSync("password123", 10),
      },
      {
        name: "Максим Шевченко",
        email: "maksym@gmail.com",
        password: bcrypt.hashSync("password123", 10),
      },
      {
        name: "Анна Іваненко",
        email: "anna@gmail.com",
        password: bcrypt.hashSync("password123", 10),
      },
      {
        name: "Дмитро Сидоренко",
        email: "dmytro@gmail.com",
        password: bcrypt.hashSync("password123", 10),
      },
      {
        name: "Марія Бондар",
        email: "maria@gmail.com",
        password: bcrypt.hashSync("password123", 10),
      },
    ]);

    await queryInterface.bulkInsert("models", [
      {
        title: "iPhone 16",
        brand_id: 1,
        description: "Флагманський смартфон Apple",
      },
      {
        title: "Galaxy S25",
        brand_id: 2,
        description: "Флагманський смартфон Samsung",
      },
      {
        title: "ThinkPad X1",
        brand_id: 3,
        description: "Бізнес-ноутбук Lenovo",
      },
      { title: "Serie 8", brand_id: 4, description: "Пральна машина Bosch" },
      {
        title: "Marlin 8",
        brand_id: 5,
        description: "Гірський велосипед Trek",
      },
      {
        title: "PlayStation 5 Slim",
        brand_id: 6,
        description: "Ігрова консоль Sony",
      },
      {
        title: "Lenovo Legion 5",
        brand_id: 3,
        description: "Ігровий ноутбук Lenovo",
      },
      { title: "Bosch KGN39", brand_id: 4, description: "Холодильник Bosch" },
    ]);

    await queryInterface.bulkInsert("items", [
      {
        categ_id: 1,
        type_id: 1,
        brand_id: 1,
        model_id: 1,
        store_id: 1,
        price: 49999.99,
        amount: 15,
      },
      {
        categ_id: 1,
        type_id: 1,
        brand_id: 2,
        model_id: 2,
        store_id: 2,
        price: 42999.99,
        amount: 20,
      },
      {
        categ_id: 3,
        type_id: 2,
        brand_id: 3,
        model_id: 3,
        store_id: 3,
        price: 68999.99,
        amount: 8,
      },
      {
        categ_id: 2,
        type_id: 4,
        brand_id: 4,
        model_id: 4,
        store_id: 4,
        price: 25999.99,
        amount: 12,
      },
      {
        categ_id: 4,
        type_id: 5,
        brand_id: 5,
        model_id: 5,
        store_id: 5,
        price: 31999.99,
        amount: 6,
      },
      {
        categ_id: 6,
        type_id: 6,
        brand_id: 6,
        model_id: 6,
        store_id: 6,
        price: 24999.99,
        amount: 10,
      },
      {
        categ_id: 3,
        type_id: 2,
        brand_id: 3,
        model_id: 7,
        store_id: 5,
        price: 31999.99,
        amount: 25,
      },
    ]);

    await queryInterface.bulkInsert("orders", [
      {
        code: "550e8400-e29b-41d4-a716-446655440000",
        date: new Date("2026-09-01 10:00"),
        amount: 100000,
        paid: true,
        customer_id: 1,
      },
      {
        code: "550e8400-e29b-41d4-a716-446655440001",
        date: new Date("2026-09-02 14:30"),
        amount: 43000,
        paid: false,
        customer_id: 2,
      },
      {
        code: "550e8400-e29b-41d4-a716-446655440002",
        date: new Date("2026-09-03 09:15"),
        amount: 69000,
        paid: true,
        customer_id: 3,
      },
      {
        code: "550e8400-e29b-41d4-a716-446655440003",
        date: new Date("2026-09-04 18:20"),
        amount: 78000,
        paid: true,
        customer_id: 4,
      },
      {
        code: "550e8400-e29b-41d4-a716-446655440004",
        date: new Date("2026-09-05 12:40"),
        amount: 64000,
        paid: false,
        customer_id: 5,
      },
      {
        code: "550e8400-e29b-41d4-a716-446655440005",
        date: new Date("2026-09-06 11:10"),
        amount: 50000,
        paid: true,
        customer_id: 6,
      },
      {
        code: "550e8400-e29b-41d4-a716-446655440006",
        date: new Date("2026-09-06 14:45"),
        amount: 86000,
        paid: true,
        customer_id: 2,
      },
    ]);

    await queryInterface.bulkInsert("item_order", [
      { item_id: 1, orders_id: 1 },
      { item_id: 2, orders_id: 2 },
      { item_id: 3, orders_id: 3 },
      { item_id: 4, orders_id: 4 },
      { item_id: 5, orders_id: 5 },
      { item_id: 6, orders_id: 6 },
    ]);
  },

  async down(queryInterface) {
    const options = { truncate: true, restartIdentity: true, cascade: true };

    await queryInterface.bulkDelete("item_order", null, options);
    await queryInterface.bulkDelete("orders", null, options);
    await queryInterface.bulkDelete("items", null, options);
    await queryInterface.bulkDelete("models", null, options);
    await queryInterface.bulkDelete("customers", null, options);
    await queryInterface.bulkDelete("stores", null, options);
    await queryInterface.bulkDelete("brands", null, options);
    await queryInterface.bulkDelete("item_types", null, options);
    await queryInterface.bulkDelete("item_categories", null, options);
  },
};
