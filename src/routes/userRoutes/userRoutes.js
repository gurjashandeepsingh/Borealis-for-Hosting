import { body, query, validationResult } from "express-validator";
import { UserService } from "../../services/userServices/userServices.js";
import { logger } from "../../../winstonLogger.js";
import { AuthenticationMiddleware } from "../../middleware/jwtMiddleware.js";
import express from "express";
const router = express.Router();

const registerUserValidation = [
  body("email").toLowerCase().notEmpty().isEmail().withMessage("Email missing"),
  body("password").notEmpty().withMessage("Password Missing"),
  body("confirmPassword").notEmpty().withMessage("please confirm password"),
  body("phone").notEmpty().withMessage("Contact missing"),
  body("name").notEmpty().withMessage("Name Missing"),
];
router.post(
  "/registerUser",
  registerUserValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { email, name, password, confirmPassword, phone } = request.body;
      const ServiceInstance = await new UserService();
      const result = await ServiceInstance.registerUser(
        email,
        name,
        password,
        confirmPassword,
        phone
      );
      return response.status(200).send(result);
    } catch (error) {
      console.log(error);
      return response.status(400).send("Error While fetching");
    }
  }
);

const loginUserValidation = [
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Please provide a valid Email address"),
  body("password").notEmpty().withMessage("Please provide password"),
];
router.post("/loginUser", loginUserValidation, async (request, response) => {
  const validationError = validationResult(request);
  if (!validationError.isEmpty()) {
    return response.status(400).json({
      errors: validationError.array(),
    });
  }
  try {
    const { email, password } = request.body;
    const ServiceInstance = new UserService();
    const result = await ServiceInstance.loginUser(email, password);
    logger.info(result);
    response.status(200).send(result);
  } catch (error) {
    response.status(400).send(error);
    logger.error(error);
  }
});

const updateUserValidation = [
  body("userId").notEmpty().withMessage("Please provide userId"),
];
router.post("/updateUser", updateUserValidation, async (request, response) => {
  const validationError = validationResult(request);
  if (!validationError.isEmpty()) {
    return response.status(400).json({
      errors: validationError.array(),
    });
  }
  try {
    const { userId } = request.body;
    const ServiceInstance = new UserService();
    const result = await ServiceInstance.updateUser(userId, request.body);
    response.status(200).send(result);
  } catch (error) {
    response.status(400).send(error);
    console.log(error);
  }
});

const showAllItemsValidation = [
  body("menuId").notEmpty().withMessage("Please provide menuId"),
];
router.get(
  "/showAllItemsUser",
  showAllItemsValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { menuId } = request.body;
      const ServiceInstance = await new UserService();
      const result = await ServiceInstance.showAllItems(menuId);
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
      logger.error(error);
    }
  }
);

const getUserValidation = [
  body("userId").notEmpty().withMessage("Please provide userId"),
];
router.get("/findUser", getUserValidation, async (request, response) => {
  const validationError = validationResult(request);
  if (!validationError.isEmpty()) {
    return response.status(400).json({
      errors: validationError.array(),
    });
  }
  try {
    const { userId } = request.body;
    const ServiceInstance = new UserService();
    console.log(ServiceInstance);
    const result = await ServiceInstance.getUser(userId);
    console.log(result);
    response.status(200).send(result);
  } catch (error) {
    response.status(400).send(error);
    logger.error(error);
  }
});

const findBusinessValidation = [
  body("businessId").notEmpty().withMessage("Can't be empty"),
];
router.get(
  "/findBusiness",
  findBusinessValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { businessId } = request.body;
      const ServiceInstance = await new UserService();
      const result = await ServiceInstance.findBusiness(businessId);
      return response.status(200).send(result);
    } catch (error) {
      console.log(error);
      return response.status(400).send(error);
    }
  }
);

router.get("/showAllBusinesses", async (request, response) => {
  try {
    const ServiceInstance = await new UserService();
    const result = await ServiceInstance.showAllBusinesses();
    return response.status(200).send(result);
  } catch (error) {
    console.log(error);
    return response.status(400).send(error.message || error);
  }
});

const findItemValidation = [
  body("itemId").notEmpty().withMessage("product needs to be an object"),
];
router.get(
  "/findItemUser",
  // new AuthMiddleware().auth,
  findItemValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { itemId } = request.body;
      const ServiceInstance = await new UserService();
      const result = await ServiceInstance.findItemForUser(itemId);
      return response.status(200).send(result);
    } catch (error) {
      console.log(error);
      return response.status(400).send(error.message || error);
    }
  }
);

const addToCartValidation = [
  body("cartId")
    .optional()
    .isString()
    .withMessage("Cart id needs to be a string"),
  body("item").isObject().withMessage("item needs to be an object"),
];
router.post("/addToCart", addToCartValidation, async (request, response) => {
  const validationError = validationResult(request);
  if (!validationError.isEmpty()) {
    return response.status(400).json({
      errors: validationError.array(),
    });
  }
  try {
    const { cartId, item, userId } = request.body;
    // const { userId } = request.user;
    const ServiceInstance = await new UserService();
    const result = await ServiceInstance.addToCart(cartId, item, userId);
    response.status(200).send(result);
  } catch (error) {
    console.log(error);
    return response.status(400).send(error.message || error);
  }
});
const getActiveCartValidation = [
  body("userId").notEmpty().withMessage("item needs to be an object"),
];
router.get(
  "/getActiveCart",
  getActiveCartValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { userId } = request.body;
      const ServiceInstance = await new UserService();
      const result = await ServiceInstance.getActiveCart(userId);
      response.status(200).send(result);
    } catch (error) {
      console.log(error);
      return response.status(400).send(error.message || error);
    }
  }
);

const orderPlacementValidation = [
  body("cartId").notEmpty().withMessage("Provide Cart"),
  body("shippingAddress").notEmpty().withMessage("No Address Found"),
  body("userId").notEmpty().withMessage("Provide userId"),
];
router.post(
  "/orderPlacement",
  // new AuthMiddleware().auth,
  orderPlacementValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { cartId, shippingAddress, userId } = request.body;
      const ServiceInstance = new UserService();
      const result = await ServiceInstance.orderPlacement(
        cartId,
        shippingAddress,
        userId
      );
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error.message || error);
    }
  }
);

const orderHistoryValidation = [
  body("userId").notEmpty().withMessage("Provide UserID"),
];
router.get(
  "/orderHistoryUser",
  orderHistoryValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      throw new Error("Provide all parameters");
    }
    try {
      const { userId } = request.body;
      const ServiceInstance = await new UserService();
      const result = await ServiceInstance.orderHistory(userId);
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

const orderDetailsValidation = [
  body("orderId").notEmpty().withMessage("Provide OrderId"),
];
router.get(
  "/orderDetailsUser",
  // new AuthMiddleware().auth,
  orderDetailsValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { orderId } = request.body;
      const ServiceInstance = await new UserService();
      const result = await ServiceInstance.orderDetails(orderId);
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

const searchStringValidation = [
  query("searchString").notEmpty().withMessage("Please provide A search Term"),
];
router.get(
  "/searchProductUser",
  searchStringValidation,
  async (request, response) => {
    try {
      const { searchString } = request.query;
      const ServiceInstance = await new UserService();
      const result = await ServiceInstance.searchItems(searchString);
      return response.status(200).send(result);
      logger.info(result);
    } catch (error) {
      console.log(error);
      response.status(400).send(error);
    }
  }
);

export { router as userRoutes };
