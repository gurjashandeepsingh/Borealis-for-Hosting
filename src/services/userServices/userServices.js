import { User } from "../../models/userModel.js";
import { AuthenticationMiddleware } from "../../middleware/jwtMiddleware.js";
import { Menu } from "../../models/menuModel.js";
import { Business } from "../../models/businessModel.js";
import bcrypt from "bcrypt";
import { Item } from "../../models/itemModel.js";
import { Order } from "../../models/orderModel.js";
import { Cart } from "../../models/cartModel.js";

class UserService {
  /**
   * Registers a new user with the provided details.
   * @param {string} email - The email address of the user.
   * @param {string} name - The name of the user.
   * @param {string} password - The password for the user account.
   * @param {string} confirmPassword - The confirmation password to ensure correctness.
   * @param {string} phone - The phone number of the user.
   * @returns {Promise<Object>} A Promise that resolves to the registered user object if registration is successful.
   * @throws {Error} If the provided email already exists in the database.
   */
  async registerUser(email, name, password, confirmPassword, phone) {
    if (password === confirmPassword) {
      const checkIfAlreadyExisting = await User.findOne({ email: email });
      if (!checkIfAlreadyExisting) {
        password = await bcrypt.hash(password, 20);
        const newUser = new User({ name, email, password, phone });
        const registeredUser = await newUser.save();
        return registeredUser;
      } else {
        throw new Error("Email already exists");
      }
    }
  }

  /**
   * Logs in a user with the provided email and password.
   * @param {string} email - The email address of the user.
   * @param {string} password - The password for the user account.
   * @returns {Promise<Object>} A Promise that resolves to an object containing the authentication token and the user information if login is successful.
   * @throws {Error} If the provided email or password is incorrect.
   */
  async loginUser(email, password) {
    const searchUser = await User.findOne({ email });
    if (searchUser) {
      const isMatch = await bcrypt.compare(password, searchUser.password);
      if (isMatch) {
        const jwtTokenInstance = new AuthenticationMiddleware();
        const token = await jwtTokenInstance.generateToken(searchUser._id);
        return { token, searchUser };
      } else {
        console.log("Token Invalid");
      }
    }
  }

  /**
   * Updates a user with the provided user ID and updated object.
   * @param {string} userId - The ID of the user to be updated.
   * @param {Object} updatedObject - The object containing the updated user information.
   * @returns {Promise<Object>} A Promise that resolves to an object containing the updated user and the found updated user.
   * @throws {Error} If the user with the provided ID is not found.
   */
  async updateUser(userId, updatedObject) {
    const findUser = await User.findOne({ _id: userId });
    if (!findUser) {
      return "User not Found";
    }
    const updatedUser = await User.updateOne(
      { _id: findUser._id },
      { $set: updatedObject },
      { new: true }
    );
    const findUpdatedUSer = await User.findOne({ _id: userId });
    return { updatedUser, findUpdatedUSer };
  }

  /**
   * Finds a business with the provided business ID.
   * @param {string} businessId - The ID of the business to be found.
   * @returns {Promise<Object|string>} A Promise that resolves to the found business object if it exists, or a string message "Kitchen not found" if the business is not found.
   */
  async findBusiness(businessId) {
    const findBusiness = await Business.findOne({ _id: businessId });
    if (!findBusiness) {
      return "Kitchen not found";
    }
    const findMenuItems = await Item.find({ menuId: findBusiness.menuId });
    return { findBusiness, findMenuItems };
  }
  async showAllBusinesses() {
    try {
      const showAllBusinesses = await Business.find();
      if (!showAllBusinesses || showAllBusinesses.length === 0) {
        return "No businesses found";
      }

      const result = [];
      for (const business of showAllBusinesses) {
        console.log(business.menuId);
        // Fetch featured items for the current business
        const featuredItems = await Item.find({
          menuId: business.menuId,
        }).limit(4);
        // Convert the Mongoose document to a plain JavaScript object
        const businessObject = business.toObject();
        // Add the featuredItems key to the object
        businessObject.featuredItems = featuredItems;
        result.push(businessObject); // or do something else with the featured items
      }

      return result;
    } catch (error) {
      console.error("Error fetching businesses:", error);
      throw error; // Forward the error for handling at a higher level
    }
  }

  /**
   * Retrieves all items from the menu with the provided menu ID.
   * @param {string} menuId - The ID of the menu.
   * @returns {Promise<Array<Object>|string>} A Promise that resolves to an array of item objects if items are found, or a string message "No items found" if no items are found.
   */
  async showAllItems(menuId) {
    const items = await Item.find({ menuId: menuId });
    if (!items) {
      return "No items found";
    }
    return items;
  }

  async findItemForUser(itemId) {
    const findItem = await Item.findOne({ _id: itemId });
    if (!findItem) {
      return "Item not found";
    }
    return { findItem };
  }

  async addToCart(cartId, item, userId) {
    let cartToAddTo = await new Cart();
    if (cartId) {
      cartToAddTo = await Cart.findOne({ _id: cartId, isActive: true });
      if (!cartToAddTo) throw new Error("Cart does not exist or is inactive");
      const existingItemInProduct = cartToAddTo.items.filter(
        (particularItem) =>
          JSON.stringify(item.id) == JSON.stringify(particularItem._id)
      );
      if (existingItemInProduct && existingItemInProduct.length == 1) {
        // Assuming 'itemToRemove' represents the object you want to remove from the array
        cartToAddTo.items = cartToAddTo.items.filter(
          (particularItem) => particularItem !== existingItemInProduct[0]
        );
        item.quantity += existingItemInProduct[0].quantity;
      }
    } else {
      await Cart.updateMany({ userId }, { isActive: false });
    }
    const existingProduct = await Item.findOne({ _id: item.id });
    if (!existingProduct) throw new Error("Item does not exist");
    if (item.quantity < 0) item.quantity = 0;
    if (item.quantity !== 0) {
      cartToAddTo.items.push({
        itemId: item.id,
        quantity: item.quantity,
        amount: existingProduct.price * item.quantity,
      });
    }
    cartToAddTo.userId = userId;
    cartToAddTo.save();
    return cartToAddTo;
  }

  async getActiveCart(userId) {
    const currentCart = await Cart.findOne({ userId: userId, isActive: true });
    const totalAmount = currentCart.items.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.amount;
    }, 0);
    return { currentCart, totalAmount };
  }

  // async orderPlacement(cartId, shippingAddress, userId) {
  //   const findCart = await Cart.findOne({
  //     _id: cartId,
  //     isActive: true,
  //     userId,
  //   });
  //   if (!findCart) {
  //     throw new Error("Cart not found or inactive");
  //   }
  //   let amount = 0;
  //   const itemIds = [];
  //   findCart.items.forEach((item) => {
  //     itemIds.push(item._id);
  //   });
  //   const itemsObj = {};
  //   const items = await Item.find({ _id: { $in: itemIds } });
  //   items.forEach((item) => {
  //     itemsObj[item._id] = item;
  //   });
  //   findCart.items.forEach((item) => {
  //     if (productsObj[item.productId]) {
  //       amount += productsObj[item.productId].price * item.quantity;
  //     }
  //   });
  //   const newOrder = new order({
  //     amount,
  //     items: findCart.items,
  //     userId,
  //     shippingAddress: shippingAddress,
  //   });
  //   findCart.isActive = false;
  //   findCart.save();
  //   newOrder.save();
  //   return newOrder;
  // }

  async orderPlacement(cartId, shippingAddress, userId) {
    const findCart = await Cart.findOne({
      _id: cartId,
      userId,
      isActive: true,
    });
    if (!findCart) {
      return "No such cart found";
    }
    const totalAmount = findCart.items.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.amount;
    }, 0);
    const newOrder = new Order({
      amount: totalAmount,
      items: findCart.items,
      userId,
      shippingAddress,
      status: "order Placed",
    });
    findCart.isActive = false;
    findCart.save();
    newOrder.save();
    return newOrder;
  }

  async orderHistory(userId) {
    const orderHistory = await Order.find({ userId });
    if (!orderHistory) {
      return "No orders found";
    }
    return { orderHistory };
  }

  async orderDetails(orderId) {
    const orderDetails = await Order.findOne({ _id: orderId });
    if (!orderDetails) {
      return "Can't fetch order details";
    }
    return orderDetails;
  }

  async searchItems(searchString) {
    const regexExpression = new RegExp(`.*(${searchString}).*`, "i");
    const items = await Item.find({
      $or: [
        { name: { $regex: regexExpression } },
        { description: { $regex: regexExpression } },
        { tag: { $regex: regexExpression } },
      ],
    });
    if (!items) {
      return "Unable to find anything related to your search";
    }
    return items;
  }
}

export { UserService };
