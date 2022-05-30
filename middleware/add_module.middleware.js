class AutoModel {
  check = async (req) => {
    const url = req.route.path;
    let httpString = url.replace("/", ""); //removing http://
    httpString = httpString.substring(0, httpString.indexOf("/")); //getting the substring starting after http:// to the first /
    return httpString;
  };
}

module.exports = new AutoModel();
