import Joi from "joi";

export const validateEmail = (email: string) => {
  const schema = Joi.string().email();
  return schema.validate(email);
};

export const validatePassword = (password: string) => {
  const schema = Joi.string().min(6);
  return schema.validate(password);
};
