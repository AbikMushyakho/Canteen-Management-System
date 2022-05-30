const todayDate = () => {
  const date_ob = new Date();
  const date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  const year = date_ob.getFullYear();
  const nowDate = year + "-" + month + "-" + date;
  //   console.log(year + "-" + month + "-" + date);
  return nowDate;
};
const todayTime = () => {
  const date_ob = new Date();
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  const nowTime = hours + ":" + minutes;
  return nowTime;
};
module.exports = { todayDate, todayTime };
