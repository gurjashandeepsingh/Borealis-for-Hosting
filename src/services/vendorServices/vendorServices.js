import { Vendor } from "../../models/vendorMOdel.js";
import { AuthenticationMiddleware } from "../../middleware/jwtMiddleware.js";
import { Business } from "../../models/businessModel.js";
import { Menu } from "../../models/menuModel.js";
import { Item } from "../../models/itemModel.js";
import bcrypt from "bcrypt";

class VendorServices {
  // 01 - Vendor Registration
  async registerVendor(
    name,
    email,
    password,
    confirmPassword,
    phone,
    openingTime,
    closingTime,
    cuisine
  ) {
    if (password === confirmPassword) {
      const checkIfAlreadyExisting = await Vendor.findOne({ email: email });
      if (!checkIfAlreadyExisting) {
        password = await bcrypt.hash(password, 10);
        const newBusiness = new Business({
          name,
          openingTime,
          closingTime,
          cuisine,
        });
        const registeredBusiness = await newBusiness.save();
        const newMenu = await new Menu({ businessId: newBusiness._id });
        const newVendor = new Vendor({
          name,
          email,
          password,
          phone,
          businessId: newBusiness._id,
          menuId: newMenu._id,
        });
        const registeredVendor = await newVendor.save();
        const registeredMenu = await newMenu.save();
        return { registeredVendor, registeredBusiness, registeredMenu };
      } else {
        throw new Error("Email already exists");
      }
    }
  }

  // 02 - Vendor Login
  async loginVendor(email, password) {
    const searchVendor = await Vendor.findOne({ email });
    if (searchVendor) {
      const isMatch = await bcrypt.compare(password, searchVendor.password);
      if (isMatch) {
        const jwtTokenInstance = new AuthenticationMiddleware();
        const token = await jwtTokenInstance.generateToken(searchVendor._id);
        console.log(token);
        console.log(searchVendor);
        return { token, searchVendor };
      } else {
        console.log("Token Invalid");
      }
    }
  }

  //   03 - Update vendor Information
  async updateVendorInfo(fieldName, fieldValue, vendorId) {
    let newInfo;
    const updateObject = [];
    updateObject[fieldName] = fieldValue;
    const findVendor = await Vendor.findOne({ _id: vendorId });
    console.log(findVendor);
    if (!findVendor) throw new Error("Can't find item");
    newInfo = await Item.updateOne(
      { _id: vendorId },
      { $set: { [fieldName]: fieldValue } },
      { new: true }
    );
    console.log(newInfo);
    if (!newInfo) {
      throw new Error("Can't update item");
    }
    return newInfo;
  }

  //   04 - Add Item to Menu
  async addItemToMenu(
    menuId,
    name,
    type,
    description,
    cuisine,
    dietaryRestriction,
    price,
    tag
  ) {
    const ExistingMenu = await Menu.findById(menuId);
    if (!ExistingMenu) {
      return "Menu not found";
    }
    const addItem = await new Item({
      name,
      type,
      description,
      cuisine,
      dietaryRestriction,
      price,
      tag,
      menuId: ExistingMenu._id,
    });
    const registeredItem = await addItem.save();
    return registeredItem;
  }

  //   05 - Remove Item from Menu
  async removeItemFromMenu(menuId, itemId) {
    const findItemAndDelete = await findOneAndDelete({ _id: itemId });
    if (!findItemAndDelete) throw new Error("Can't find Item");
    return "item Deleted";
  }

  // 06 - Update Item in Menu
  async updateItem(fieldName, fieldValue, itemId) {
    let newInfo;
    const updateObject = [];
    updateObject[fieldName] = fieldValue;
    const updateItemInMenu = await Item.findById(itemId);
    if (!updateItemInMenu) throw new Error("Can/t find item");
    newInfo = await Item.updateOne(
      { _id: updateItemInMenu._id },
      { $set: { [fieldName]: fieldValue } },
      { new: true }
    );
    if (!newInfo) {
      throw new Error("Can't update item");
    }
    return newInfo;
  }

  // 07 - update business info
  async updateBusiness(fieldName, fieldValue, businessId) {
    let newInfo;
    const updateObject = [];
    updateObject[fieldName] = fieldValue;
    const findBusiness = await Business.findById(businessId);
    if (!findBusiness) throw new Error("Can't find item");
    newInfo = await Business.updateOne(
      { _id: findBusiness._id },
      { $set: { [fieldName]: fieldValue } },
      { new: true }
    );
    if (!newInfo) {
      throw new Error("Can't update item");
    }
    return newInfo;
  }
}

export { VendorServices };
