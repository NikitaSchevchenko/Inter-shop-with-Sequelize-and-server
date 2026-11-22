const validate = (schema) => {
    return async (req, res, next) => {
        try {
            req.body = await schema.validate(req.body, {
                abortEarly: false,
            });
            next();
        } catch (err) {
            return res.status(400).json({
                error: "Помилка валідації",
                details: err.errors || err.message,
            });
        }
    };
};

module.exports = validate;