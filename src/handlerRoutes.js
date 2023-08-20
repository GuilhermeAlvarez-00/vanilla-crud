const router = require("./routes");

const handler = (req, res) => {
  const method = req.method;
  const url = req.url;

  const urlSplit = url.split("/").filter(Boolean);

  const resultRoute = router.filter(
    (item) =>
      item.url.startsWith(`/${urlSplit[0]}`) &&
      item.method.toLowerCase() === method.toLowerCase()
  );

  const runRouter = resultRoute.find((item) => {
    const routeUrlSplit = item.url.split("/").filter(Boolean);

    return urlSplit.length === routeUrlSplit.length;
  });

  if (!runRouter) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: "not found" }));
  }

  const routerSplitUrl = runRouter.url.split("/");

  const objParams = {};

  routerSplitUrl.forEach((item, index) => {
    if (item.startsWith(":")) {
      objParams[item.replace(":", "")] = urlSplit[index];
    }
  });

  req
    .on("data", (data) => {
      const body = JSON.parse(data);

      req.body = body;
    })
    .on("end", () => {
      req.params = objParams;
      return runRouter.controller(req, res);
    });
};

module.exports = { handler };
