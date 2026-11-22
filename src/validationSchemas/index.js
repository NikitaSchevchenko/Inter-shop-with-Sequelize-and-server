const yup = require("yup");

const notEmptyObject = (schema) =>
    schema
        .noUnknown(true, "Невідоме поле в тілі запиту")
        .test(
            "not-empty",
            "Тіло запиту не може бути порожнім",
            (obj) => Boolean(obj && Object.keys(obj).length > 0)
        );

const ITEM_UPDATE_SCHEMA = notEmptyObject(
    yup.object({
        price: yup.number().typeError("Ціна має бути числом").positive().notRequired(),
        amount: yup.number().typeError("Кількість має бути числом").integer().min(0).notRequired(),
        categ_id: yup.number().integer().positive().notRequired(),
        type_id: yup.number().integer().positive().notRequired(),
        brand_id: yup.number().integer().positive().notRequired(),
        model_id: yup.number().integer().positive().notRequired(),
        store_id: yup.number().integer().positive().notRequired(),
    })
);

const ORDER_UPDATE_SCHEMA = notEmptyObject(
    yup.object({
        code: yup.string().trim().uuid("Некоректний формат UUID").notRequired(),
        date: yup.date().typeError("Некоректна дата").notRequired(),
        amount: yup.number().typeError("Сума має бути числом").positive().notRequired(),
        paid: yup.boolean().typeError("paid має бути true або false").notRequired(),
        customer_id: yup.number().integer().positive().notRequired(),
    })
);

const MODEL_UPDATE_SCHEMA = notEmptyObject(
    yup.object({
        title: yup.string().trim().min(1).max(255).notRequired(),
        brand_id: yup.number().integer().positive().notRequired(),
        description: yup.string().trim().max(500).notRequired(),
    })
);

// 4. Справочники с одинаковыми полями (title, description): Brands, Stores, ItemCategories, ItemTypes
const DICTIONARY_UPDATE_SCHEMA = notEmptyObject(
    yup.object({
        title: yup.string().trim().min(1).max(255).notRequired(),
        description: yup.string().trim().max(500).notRequired(),
    })
);

const CUSTOMER_UPDATE_SCHEMA = notEmptyObject(
    yup.object({
        name: yup.string().trim().min(1).max(255).notRequired(),
        email: yup.string().trim().email("Некоректний формат email").notRequired(),
    })
);

const ITEM_ORDER_UPDATE_SCHEMA = notEmptyObject(
    yup.object({
        item_id: yup.number().integer().positive().notRequired(),
        orders_id: yup.number().integer().positive().notRequired(),
    })
);

module.exports = {
    ITEM_UPDATE_SCHEMA,
    ORDER_UPDATE_SCHEMA,
    MODEL_UPDATE_SCHEMA,
    BRAND_UPDATE_SCHEMA: DICTIONARY_UPDATE_SCHEMA,
    STORE_UPDATE_SCHEMA: DICTIONARY_UPDATE_SCHEMA,
    ITEM_CATEGORY_UPDATE_SCHEMA: DICTIONARY_UPDATE_SCHEMA,
    ITEM_TYPE_UPDATE_SCHEMA: DICTIONARY_UPDATE_SCHEMA,
    CUSTOMER_UPDATE_SCHEMA,
    ITEM_ORDER_UPDATE_SCHEMA,
};