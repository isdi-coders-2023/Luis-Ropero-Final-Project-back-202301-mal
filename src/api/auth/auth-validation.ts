import { Joi } from 'express-validation';

export const loginValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};

export const registerValidation = {
  body: Joi.object({
    name: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};

export const createTravelValidation = {
  body: Joi.object({
    userName: Joi.string(),
    continent: Joi.string(),
    stayingRuralArea: Joi.boolean(),
    chronicRespiratoryDisease: Joi.boolean(),
    intentionHaveChildren: Joi.boolean(),
    eggOrChickenProteinAllergy: Joi.boolean(),
    travelCreator: Joi.string(),
    travelImage: Joi.string(),
  }),
};
