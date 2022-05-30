const path = require("path");
const glob = require("glob");

module.exports.initializeRoutes = (app) => {
  const routes = glob.sync(path.resolve(`./routes/*.routes.js`));
  try {
    // routes.map((route) => require(route)(app));
    routes.forEach((route) => {
      require(route)(app);
    });
    console.log(routes);
  } catch (ex) {
    console.log(ex);
  }
};
