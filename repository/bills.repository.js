const ReferralCodeGenerator = require("referral-code-generator");
const { bills, user } = require("../lib/DatabaseConnection");

class BillsRepository {
  generateBill = async (payload) => {
    const referenceCode = ReferralCodeGenerator.alphaNumeric("uppercase", 3, 3);
    payload.reference_code = referenceCode;
    const generated = await bills.create(payload);
    if (!generated) {
      return false;
    }
    return generated;
  };
  CashBills = async (user_id) => {
    const cash = await bills.findAll({
      where: {
        user_id: user_id,
      },
      attributes: {
        exclude: ["created_at", "updated_at"],
      },
    });
    const cash_bills = cash.filter((bill) => bill.payment_method !== 'credit');
    return cash_bills;
  };
  CreditBills = async (user_id) => {
    const creditBills = await bills.findAll({
      where: {
        user_id: user_id,
        payment_method: "credit",
      },
      attributes: {
        exclude: ["created_at", "updated_at"],
      },
    });
    return creditBills;
  };
  findById = async (id) => {
    const found = await bills.findOne({
      where: {
        id: id,
      },
      include: {
        model: user,
        attributes: {
          exclude: ["created_at", "updated_at", "password", "id"],
        },
      },
      attributes: {
        exclude: ["created_at", "updated_at"],
      },
    });
    if (!found) {
      return false;
    }
    return found;
  };

  findByUserId = async (user_id) => {
    const Bills = await bills.findAll({
      where: {
        user_id: user_id,
      },
      attributes: {
        exclude: ["created_at", "updated_at"],
      },
    });
    if (Bills.length == 0) {
      return false;
    }
    const Total = Bills.map((bill) => parseFloat(bill.amount));
    const Total_no_of_Bills = Bills.length;
    const TotalAmount = Total.reduce((p, c) => p + c, 0);
    return { Bills, Total_no_of_Bills, TotalAmount };
  };

  findByReferenceCode = async (code) => {
    try {
      const found = await bills.findOne({
        where: {
          reference_code: code,
        },
        include: {
          model: user,
          attributes: {
            exclude: ["created_at", "updated_at", "password", "id"],
          },
        },
      });
      if (!found) {
        return { status: false, error: "not found" };
      }
      return found;
    } catch (error) {
      return { status: false, error };
    }
  };
  findAll = async () => {
    const Bills = await bills.findAll({
      include: {
        model: user,
        attributes: {
          exclude: ["id", "password", "ppSizeImage"],
        },
      },

    });
    if (Bills.length == 0) {
      return false;
    }
    const Total = Bills.map((bill) => parseFloat(bill.amount));
    const Total_no_of_Bills = Bills.length;
    const TotalAmount = Total.reduce((p, c) => p + c, 0);
    return { Bills, Total_no_of_Bills, TotalAmount };
  };
  deleteByReferenceCode = async (code) => {
    await bills.destroy({
      where: {
        reference_code: code,
      },
    });

    return true;
  };
}
module.exports = new BillsRepository();
