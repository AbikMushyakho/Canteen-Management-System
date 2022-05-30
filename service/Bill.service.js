const BillsRepository = require("../repository/bills.repository");
const roleRepository = require("../repository/role.repository");
const user_roleRepository = require("../repository/user_role.repository");
const D_C_Service = require("../service/D&C.service");

class BillService {
  //generate bill of user
  generateBill = async (payload) => {
    const generate = await BillsRepository.generateBill(payload);
    if (!generate) throw new Error("Bill not generated");
    if (generate.payment_method == "credit") {
      const amount = parseInt(generate.amount);
      const data = {
        user_id: generate.user_id,
        total_credit_amount: amount,
      };
      await D_C_Service.add(data);
    }
    return generate;
  };
  //cash bills of user form token
  CashBills = async (user_id) => {
    const Bills = await BillsRepository.CashBills(user_id);
    //mapping Bills array to calculate total amount
    const Total = Bills.map((b) => parseFloat(b.amount));
    const Total_no_of_Bills = Bills.length;
    //using array.reduce() function to get total bill amount
    const TotalAmount = Total.reduce((p, c) => p + c, 0);
    return { Bills, Total_no_of_Bills, TotalAmount };
  };
  //credit bills of user form token
  CreditBills = async (user_id) => {
    const Bills = await BillsRepository.CreditBills(user_id);
    const Total = Bills.map((b) => parseFloat(b.amount));
    const Total_no_of_Bills = Bills.length;
    const TotalAmount = Total.reduce((p, c) => p + c, 0);
    return { Bills, Total_no_of_Bills, TotalAmount };
  };
  //find all bill by user id
  findByUserId = async (user_id) => {
    const found = await BillsRepository.findByUserId(user_id);
    if (!found) return false;
    return found;
  };
  //Find one bill by reference code
  findByReferenceCode = async (code) => {
    try {
      const found = await BillsRepository.findByReferenceCode(code);
      if (!found.status && found.error) throw new Error("Not found");
      return found;
    } catch (error) {
      throw new Error(error);
    }
  };
  //findAll Bills
  findAll = async (user_id) => {
    const checkAssignedRole = await user_roleRepository.findByUserId(user_id);
    if (!checkAssignedRole) throw new Error("No role assigned");
    const checkRole = await roleRepository.findById(checkAssignedRole.role_id);
    if (!checkRole) throw new Error("Role not found");
    if (checkRole.role_name === "Admin" || checkRole.role_name === "Staff") {
      const found = await BillsRepository.findAll();
      return found;
    }
    const find = await this.findByUserId(user_id);
    return find;
  };
  // delete one bill by reference code
  deleteByReferenceCode = async (code) => {
    const found = await BillsRepository.findByReferenceCode(code);
    if (!found) throw new Error(`Bill of reference code :${code} not found `);
    await BillsRepository.deleteByReferenceCode(found.reference_code);
    return true;
  };
}
module.exports = new BillService();
