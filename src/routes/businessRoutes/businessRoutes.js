import { body, query, validationResult } from "express-validator";
import { BusinessServices } from "../../services/businessServices/businessServices.js";
import { logger } from "../../../winstonLogger.js";
import express from "express";
import { AuthenticationMiddleware } from "../../middleware/jwtMiddleware.js";
const router = express.Router();

const registerVendorValidation = [
  body("businessName").notEmpty().withMessage("businessName Missing"),
  body("chefName").notEmpty().withMessage("chefName missing"),
  body("email").notEmpty().withMessage("email Missing"),
  body("password").notEmpty().withMessage("Password Missing"),
  body("confirmPassword").notEmpty().withMessage("please confirm password"),
  body("phone").notEmpty().withMessage("Contact missing"),
  body("address").notEmpty().withMessage("Provide address"),
  body("primaryCuisine")
    .notEmpty()
    .withMessage("Please provide the cuisine you will be serving"),
];
router.post(
  "/registerBusiness",
  registerVendorValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const {
        businessName,
        chefName,
        email,
        password,
        confirmPassword,
        phone,
        address,
        primaryCuisine,
        veg,
        nonVeg,
        vegan,
        eggitarian,
        calender,
      } = request.body;
      const registrationServiceInstance = new BusinessServices();
      const register = await registrationServiceInstance.registerBusiness(
        businessName,
        chefName,
        email,
        password,
        confirmPassword,
        phone,
        address,
        primaryCuisine,
        veg,
        nonVeg,
        vegan,
        eggitarian,
        calender
      );
      response.status(200).send(register);
    } catch (error) {
      response.status(400).send("Error While fetching");
      console.log(error);
    }
  }
);

const loginVendorValidation = [
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Please provide a valid Email address"),
  body("password").notEmpty().withMessage("Please provide password"),
];
router.post(
  "/loginBusiness",
  loginVendorValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { email, password } = request.body;
      const loginUserInstance = await new BusinessServices();
      const result = await loginUserInstance.loginBusiness(email, password);
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
      console.log(error);
    }
  }
);

const updateBusinessInfoValidation = [
  query("businessId").notEmpty().withMessage("Can't be empty"),
];
router.post(
  "/updateBusinessInfo",
  new AuthenticationMiddleware().isAuthenticate,
  updateBusinessInfoValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { businessId } = request.query;
      const ServiceInstance = await new BusinessServices();
      const result = await ServiceInstance.updateBusinessInfo(
        businessId,
        request.body
      );
      return response.status(200).send(result);
    } catch (error) {
      console.log(error);
      return response.status(400).send(error);
    }
  }
);

const acceptingOrdersValidation = [
  query("businessId").notEmpty().withMessage("Please provide businessId"),
];
router.post(
  "/acceptingOrders",
  new AuthenticationMiddleware().isAuthenticate,
  acceptingOrdersValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { businessId } = request.query;
      const ServiceInstance = await new BusinessServices();
      const result = await ServiceInstance.acceptingOrder(businessId);
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

const notAcceptingOrdersValidation = [
  query("businessId").notEmpty().withMessage("Please provide businessId"),
];
router.post(
  "/notAcceptingOrders",
  new AuthenticationMiddleware().isAuthenticate,
  notAcceptingOrdersValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { businessId } = request.query;
      const ServiceInstance = await new BusinessServices();
      const result = await ServiceInstance.notAcceptingOrder(businessId);
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

const addItemValidation = [
  body("name").notEmpty().withMessage("Can't be Empty"),
  body("price").notEmpty().withMessage("Can't be Empty"),
  body("description").notEmpty().withMessage("Can't be Empty"),
  body("tag").notEmpty().withMessage("Can't be Empty"),
  query("menuId").notEmpty().withMessage("Can't be Empty"),
];
router.post(
  "/addItem",
  new AuthenticationMiddleware().isAuthenticate,
  addItemValidation,
  async (request, response) => {
    const validationError = validationResult(Request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { name, price, description, tag } = request.body;
      const { menuId } = request.query;
      const addItemServiceInstance = await new BusinessServices();
      const result = await addItemServiceInstance.addItemToMenu(
        name,
        price,
        description,
        tag,
        menuId
      );
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

const updateItemValidation = [
  query("itemId").notEmpty().withMessage("Can't be empty"),
];
router.post(
  "/updateItem",
  new AuthenticationMiddleware().isAuthenticate,
  updateItemValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { itemId } = request.query;
      const ServiceInstance = await new BusinessServices();
      const result = await ServiceInstance.updateItem(itemId, request.body);
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

const removeItemValidation = [
  query("itemId").notEmpty().withMessage("Can't be Empty"),
];
router.post(
  "/removeItem",
  new AuthenticationMiddleware().isAuthenticate,
  removeItemValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { itemId } = request.query;
      const addItemServiceInstance = await new BusinessServices();
      const result = await addItemServiceInstance.removeItemFromMenu(itemId);
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

const showItemValidation = [
  query("itemId").notEmpty().withMessage("Provide ItemId"),
];
router.get(
  "/showItem",
  new AuthenticationMiddleware().isAuthenticate,
  showItemValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      logger.error("Provide all paramters");
    }
    try {
      const { itemId } = request.query;
      const ServiceInstance = await new BusinessServices();
      const result = await ServiceInstance.showItem(itemId);
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

const showItemsValidation = [
  query("menuId").notEmpty().withMessage("Can't be Empty"),
];
router.post(
  "/showItemsVendor",
  showItemsValidation,
  async (request, response) => {
    const validationError = validationResult(Request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { menuId } = request.query;
      const ServiceInstance = await new BusinessServices();
      const result = await ServiceInstance.showAllItems(menuId);
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

const itemAvailableValidation = [
  query("itemId").notEmpty().withMessage("Provide itemId"),
];
router.post(
  "/makeDishAvailable",
  new AuthenticationMiddleware().isAuthenticate,
  itemAvailableValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      throw new Error("Provide itemId");
    }
    try {
      const { itemId } = request.query;
      const ServiceInstance = await new BusinessServices();
      const result = await ServiceInstance.makeDishAvailable(itemId);
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

const itemUnavailableValidation = [
  query("itemId").notEmpty().withMessage("Provide itemId"),
];
router.post(
  "/makeDishUnavailable",
  new AuthenticationMiddleware().isAuthenticate,
  itemUnavailableValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      throw new Error("Provide itemId");
    }
    try {
      const { itemId } = request.query;
      const ServiceInstance = await new BusinessServices();
      const result = await ServiceInstance.makeDishUnavailable(itemId);
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

const featuredItemValidation = [
  query("itemId").notEmpty().withMessage("Provide itemId"),
];
router.post(
  "/makeItemFeatured",
  new AuthenticationMiddleware().isAuthenticate,
  featuredItemValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      throw new Error("Provide itemId");
    }
    try {
      const { itemId } = request.query;
      const ServiceInstance = await new BusinessServices();
      const result = await ServiceInstance.makeItemFeatured(itemId);
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

const UnfeaturedItemValidation = [
  query("itemId").notEmpty().withMessage("Provide itemId"),
];
router.post(
  "/makeItemUnfeatured",
  new AuthenticationMiddleware().isAuthenticate,
  UnfeaturedItemValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      throw new Error("Provide itemId");
    }
    try {
      const { itemId } = request.query;
      const ServiceInstance = await new BusinessServices();
      const result = await ServiceInstance.makeItemUnfeatured(itemId);
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

const isArchivedValidation = [
  body("itemId").notEmpty().withMessage("Provide itemId"),
];
router.post(
  "/archiveItem",
  // new AuthenticationMiddleware().isAuthenticate,
  isArchivedValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      throw new Error("Provide itemId");
    }
    try {
      const { itemId } = request.body;
      const ServiceInstance = await new BusinessServices();
      const result = await ServiceInstance.archiveOrUnarchiveAnItem(itemId);
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

export { router as businessRoutes };
