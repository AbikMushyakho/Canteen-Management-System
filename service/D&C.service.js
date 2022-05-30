const D_C_Repository = require("../repository/d&c.repository");
const Payment_History_Repository = require("../repository/payment_histroy.repository");
const UserRepository = require("../repository/user.repository")
class D_C_Service {
  //finding one debit and credit account
  findOne = async (user_id) => {
    const user = await UserRepository.findById(user_id);
    if (!user) throw new Error("There are no existing user of this id");
    const find = await D_C_Repository.findOne(user_id);
    if (find) {
      return find;
    }
  };
  //finding all debit and credit account
  findAll = async () => {
    const find = await D_C_Repository.findAll();
    if (!find) {
      return false;
    }
    return find;
  };
  deleteByUserId = async (user_id) => {
    const user = await UserRepository.findById(user_id);
    if (!user) throw new Error("There are no existing user of this id");
    const find = await D_C_Repository.findOne(user_id);
    const advance_amount = parseInt(find.advance_amount);
    const total_credit_amount = parseInt(find.total_credit_amount);

    if (!find) { throw new Error("Users account not found"); }
    else if (advance_amount !== 0 || total_credit_amount !== 0) {
      throw new Error("User has Advance amount or Credit amount remaining. please check users credit account")

    }
    else {
      await D_C_Repository.deleteByUserId(user_id);
      return true;
    }
  }
  //updating one debit and credit account by id
  update = async (payload, id) => {
    //finding if the user is previously available or not
    const find = await this.findOne(id);
    if (!find) throw new Error("User Bill not found");
    //if found then updating previous amount

    //checking if the user has given advance  amount or not
    const AdvanceAmt = parseInt(find.advance_amount);
    //if the advance amount is zero then add new credit amount to total credit column
    if (AdvanceAmt == 0) {
      const privDue = parseInt(find.total_credit_amount);
      const newCredit = {
        total_credit_amount: payload.total_credit_amount + privDue,
      };
      const updateDue = await D_C_Repository.updateDue(newCredit, id);
      return updateDue;
    }
    //if advance amount is greater then deducting credit amount on it
    if (AdvanceAmt >= payload.total_credit_amount) {
      const data = {
        advance_amount: AdvanceAmt - payload.total_credit_amount,
      };
      const updateAmt = await D_C_Repository.updateDue(data, id);
      return updateAmt;
    }
    //has Advance amount but is less then new credit amount than deduct previous advance amount and add remaining to Credit amount column
    else if (AdvanceAmt < payload.total_credit_amount) {
      const data = {
        total_credit_amount: payload.total_credit_amount - AdvanceAmt,
        advance_amount: 0,
      };
      const updateCredit = await D_C_Repository.updateDue(data, id);
      return updateCredit;
    }
  };
  //adding new debit and credit account
  add = async (payload) => {
    const user = await UserRepository.findById(payload.user_id);
    if (!user) throw new Error("Wrong User")
    //if same user previous record found then updating it
    const find = await D_C_Repository.findOne(payload.user_id);
    if (find) {
      const updateD = await this.update(payload, payload.user_id);
      return updateD;
    }
    //not found then saving new debit and credit account
    const saveDue = await D_C_Repository.add(payload);
    if (!saveDue) {
      return false;
    }
    return true;
  };

  pay = async (io, payload, id) => {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error("There are no existing user of this id");
    payload.pay_amount = parseInt(payload.pay_amount)
    // var data = {}
    //finding user alc
    const findUser = await D_C_Repository.findOne(id);
    if (!findUser) {
      const data = {
        user_id: id,
        advance_amount: payload.pay_amount
      }
      const add = await D_C_Repository.add(data);
      const payment_history = {
        user_id: id,
        previous_amount: 0,
        advance_amount: payload.pay_amount,
        remaining_amount: 0,
        paid_amount: payload.pay_amount,
        status: "success"
      }
      await Payment_History_Repository.add(payment_history)
      io.emit("payment_notification", payment_history);

      return add
    }

    //if paying amount is les than or equal to remaining amount then updating
    const prevCreditAmount = parseInt(findUser.total_credit_amount);
    const prevAdvAmount = parseInt(findUser.advance_amount);

    if (prevCreditAmount !== 0) {
      //if previous credit amount is greater or equals to paying amount then deduct it
      if (prevCreditAmount >= payload.pay_amount) {
        const data = {
          total_credit_amount: prevCreditAmount - payload.pay_amount,
        };
        const updated = await D_C_Repository.updateDue(data, id);
        const payment_history = {
          user_id: id,
          previous_amount: prevCreditAmount,
          advance_amount: 0,
          remaining_amount: data.total_credit_amount,
          paid_amount: payload.pay_amount,
          status: "success"
        }
        await Payment_History_Repository.add(payment_history)
        io.emit("payment_notification", payment_history);

        return updated;
      }
      //paying amount is greater than remaining amount then adding in advance amount
      // (prevCreditAmount < payload.pay_amount)
      else {
        let advance_amount = payload.pay_amount - prevCreditAmount;
        advance_amount = advance_amount + prevAdvAmount;
        const data = {
          advance_amount: advance_amount,
          total_credit_amount: 0,
        };
        const updated = await D_C_Repository.updateDue(data, id);
        const payment_history = {
          user_id: id,
          previous_amount: prevCreditAmount,
          advance_amount: advance_amount,
          remaining_amount: 0,
          paid_amount: payload.pay_amount,
          status: "success"
        }
        await Payment_History_Repository.add(payment_history)
        io.emit("payment_notification", payment_history);

        return updated;
      }
    }
    //if previous credit is zero then store in advance
    else {
      let advance_amount = prevAdvAmount + payload.pay_amount;
      const data = {
        advance_amount: advance_amount,
        total_credit_amount: 0,
      };

      const updated = await D_C_Repository.updateDue(data, id);
      const payment_history = {
        user_id: id,
        previous_amount: 0,
        advance_amount: advance_amount,
        remaining_amount: 0,
        paid_amount: payload.pay_amount,
        status: "success"
      }
      await Payment_History_Repository.add(payment_history)
      io.emit("payment_notification", payment_history);

      return updated;
    }

  };
}
module.exports = new D_C_Service();
