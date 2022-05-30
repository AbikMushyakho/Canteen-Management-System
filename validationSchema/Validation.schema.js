const Joi = require("joi");
const UserValidation = (data) => {
  const UserSchema = Joi.object({
    full_name: Joi.string().max(100).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: Joi.string().max(255).required(),
    gender: Joi.string().required(),
    phone_no: Joi.string().min(10).max(16).required(),
    address: Joi.string().max(255).required(),
  });
  return UserSchema.validate(data);
};

const FoodValidation = (data) => {
  const FoodSchema = Joi.object({
    item_name: Joi.string().min(2).max(255).required(),
    price: Joi.required(),
    category_id: Joi.number().required(),
    // food_image: Joi.string().required(),
  });
  return FoodSchema.validate(data);
};
const OrderValidation = (data) => {
  const OrderSchema = Joi.object({
    food_item_id: Joi.number().required(),
    quantity: Joi.number().max(100).min(1).required(),
    delivery_location: Joi.string().min(3).max(255).required(),
    payment_method: Joi.string().min(4).max(10).required(),
  });
  return OrderSchema.validate(data);
};

module.exports = { UserValidation, FoodValidation, OrderValidation };
