import { Coupon } from "../../models/couponModel.js";

class CouponService {
  async discountAmount(amount, couponName) {
    const couponExists = await Coupon.findOne({ name: couponName });
    const date = new Date();
    if (
      couponExists &&
      date >= couponExists.validFrom &&
      date <= couponExists.validTo
    ) {
      const discount = (amount - couponExists.discountPercentage) / 10;
      amount = amount - discount;
      return amount;
    } else {
      throw new Error("Coupon not valid");
    }
  }
}

export { CouponService };
