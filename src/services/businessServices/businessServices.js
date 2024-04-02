import { AuthenticationMiddleware } from "../../middleware/jwtMiddleware.js";
import { Business } from "../../models/businessModel.js";
import { Menu } from "../../models/menuModel.js";
import { Item } from "../../models/itemModel.js";
import bcrypt from "bcrypt";

class BusinessServices {
  /**
   * Register a new business.
   *
   * @param {string} businessName - The name of the business.
   * @param {string} chefName - The name of the chef.
   * @param {string} email - The email of the business.
   * @param {string} password - The password for the business account.
   * @param {string} confirmPassword - The confirmation password for the business account.
   * @param {string} phone - The phone number of the business.
   * @param {string} primaryCuisine - The primary cuisine of the business.
   * @param {boolean} veg - Indicates if the business offers vegetarian options.
   * @param {boolean} nonVeg - Indicates if the business offers non-vegetarian options.
   * @param {boolean} vegan - Indicates if the business offers vegan options.
   * @param {boolean} eggitarian - Indicates if the business offers eggitarian options.
   * @returns {Object} - An object containing the registered business and menu.
   * @throws {Error} - If the email already exists.
   * */
  async registerBusiness(
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
    eggitarian
  ) {
    if (password === confirmPassword) {
      const checkIfAlreadyExisting = await Business.findOne({ email: email });
      if (!checkIfAlreadyExisting) {
        password = await bcrypt.hash(password, 10);
        const newBusiness = new Business({
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
        });
        const registeredBusiness = await newBusiness.save();
        const newMenu = await new Menu({ businessId: newBusiness._id });
        const registeredMenu = await newMenu.save();
        registeredBusiness.menuId = registeredMenu._id;
        await registeredBusiness.save();
        return { registeredBusiness, registeredMenu };
      } else {
        throw new Error("Email already exists");
      }
    }
  }

  /**
   * Logs in a business.
   *
   * @param {string} email - The email of the business.
   * @param {string} password - The password of the business account.
   * @returns {Object} - An object containing the authentication token, the business information, and the menu.
   * @throws {Error} - If the email or password is invalid.
   */
  async loginBusiness(email, password) {
    const searchVendor = await Business.findOne({ email });
    if (searchVendor) {
      const isMatch = await bcrypt.compare(password, searchVendor.password);
      if (isMatch) {
        const jwtTokenInstance = new AuthenticationMiddleware();
        const token = await jwtTokenInstance.generateToken(searchVendor._id);
        const findMenu = await Menu.findOne({ businessId: searchVendor._id });
        const findItems = await Item.find({ menuId: findMenu._id });

        return { token, searchVendor, findMenu };
      } else {
        console.log("Token Invalid");
      }
    }
  }

  /**
   * Updates the information of a business.
   *
   * @param {string} businessId - The ID of the business.
   * @param {Object} updateObject - The object containing the fields to be updated.
   * @returns {Object|string} - Returns the updated business object if found, or a string indicating that the business was not found.
   */
  async updateBusinessInfo(businessId, updateObject) {
    const findBusiness = await Business.findById(businessId);
    if (!findBusiness) {
      return "Business not found";
    }
    const updatedField = await Business.findOneAndUpdate(
      { _id: businessId },
      updateObject,
      { new: true }
    );
    return updatedField;
  }

  /**
   * Accepts an order for a business.
   *
   * @param {string} businessId - The ID of the business.
   * @returns {Object|string} - Returns the updated business object if found, or a string indicating that the business was not found.
   */
  async acceptingOrder(businessId) {
    const findBusiness = await Business.findById(businessId);
    if (!findBusiness) {
      return "Business not found";
    }
    const startAccepting = await Business.findOneAndUpdate(
      { _id: findBusiness._id },
      { isAcceptingOrders: true },
      { new: true }
    );
    return startAccepting;
  }

  async notAcceptingOrder(businessId) {
    const findBusiness = await Business.findOne({ _id: businessId });
    if (!businessId) {
      return "Kitchen not found";
    }
    const updatedBusiness = await Business.findOneAndUpdate(
      {
        _id: findBusiness._id,
      },
      { isAcceptingOrders: false },
      { new: true }
    );
    return updatedBusiness;
  }

  /**
   * Adds an item to the menu.
   *
   * @param {string} name - The name of the item.
   * @param {number} price - The price of the item.
   * @param {string} description - The description of the item.
   * @param {string} tag - The tag of the item.
   * @param {string} menuId - The ID of the menu.
   * @returns {Object|string} - Returns the added item object if successful, or a string indicating that the item could not be added.
   */
  async addItemToMenu(name, price, description, tag, menuId) {
    const addItem = await new Item({
      name,
      price,
      description,
      tag,
      menuId,
    });
    if (!addItem) {
      return "Can't add item";
    }
    await addItem.save();
    return addItem;
  }

  /**
   * Updates an item in the menu.
   *
   * @param {string} itemId - The ID of the item to be updated.
   * @param {Object} updateObject - The object containing the fields to be updated.
   * @returns {Object|string} - Returns an object containing the update status and the updated item if successful, or a string indicating that the item was not found.
   */
  async updateItem(itemId, updateObject) {
    const findItem = await Item.findOne({ _id: itemId });
    if (!findItem) {
      return "Item not found";
    }
    const updateItem = await Item.updateOne(
      { _id: itemId },
      { $set: updateObject },
      { new: true }
    );
    const findUpdatedItem = await Item.findOne({ _id: itemId });
    return { updateItem, findUpdatedItem };
  }

  /**
   * Removes an item from the menu.
   *
   * @param {string} itemId - The ID of the item to be removed.
   * @returns {string} - Returns a string indicating the status of the item removal.
   */
  async removeItemFromMenu(itemId) {
    const deleteItem = await Item.findByIdAndDelete(itemId);
    if (deleteItem) {
      return "Item Deleted Successfully";
    }
    if (!deleteItem) {
      return "Item not deleted";
    }
  }

  async showAllItems(menuId) {
    const items = await Item.find({ menuId: menuId });
    if (!items) {
      return "No items found";
    }
    const featuredItemsArray = [];
    const featuredItems = items.filter((item) => {
      if (item.featured == true) {
        featuredItemsArray.push(item);
      }
    });
    const unfeaturedItemsArray = [];
    const unfeaturedItems = items.filter((item) => {
      if (item.available == false) {
        unfeaturedItemsArray.push(item);
      }
    });
    const availableItemsArray = [];
    const availableItems = items.filter((item) => {
      if (item.available == true) {
        availableItemsArray.push(item);
      }
    });
    const unavailableItemsArray = [];
    const unavailableItems = items.filter((item) => {
      if (item.available == false) {
        unavailableItemsArray.push(item);
      }
    });
    return {
      featuredItemsArray,
      unfeaturedItemsArray,
      availableItemsArray,
      unavailableItemsArray,
      items,
    };
  }

  async makeDishAvailable(itemId) {
    const findItem = await Item.findOne({ _id: itemId });
    if (!findItem) {
      return "Item not found";
    }
    const updatedItem = await Item.findOneAndUpdate(
      { _id: findItem._id },
      { available: true },
      { new: true }
    );
    return updatedItem;
  }

  async makeDishUnavailable(itemId) {
    const findItem = await Item.findOne({ _id: itemId });
    if (!findItem) {
      return "Item not found";
    }
    const updatedItem = await Item.findOneAndUpdate(
      { _id: findItem._id },
      { available: false },
      { new: true }
    );
    return updatedItem;
  }

  async makeItemFeatured(itemId) {
    const findItem = await Item.findOne({ _id: itemId });
    if (!findItem) {
      return "Item not found";
    }
    const updatedItem = await Item.findOneAndUpdate(
      { _id: findItem._id },
      { featured: true },
      { new: true }
    );
    return updatedItem;
  }

  async makeItemUnfeatured(itemId) {
    const findItem = await Item.findOne({ _id: itemId });
    if (!findItem) {
      return "Item not found";
    }
    const updatedItem = await Item.findOneAndUpdate(
      { _id: findItem._id },
      { featured: false },
      { new: true }
    );
    return updatedItem;
  }
}

export { BusinessServices };
