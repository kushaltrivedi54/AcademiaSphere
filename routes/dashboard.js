import { Router } from "express";
import * as prefRoute from "../data/users/setPreference.js";
import routeError from "./routeerror.js";

const router = Router();

router
  .get("/", async (req, res) => {
    try {
      if (req.session.type === "Admin") {
        return res.render("admin/dashboard");
      }

      let renderObjs = {};
      return res.render("public/dashboard", renderObjs);

    } catch (e) {
      routeError(res, e);
    }
  })
  .post("/", async (req, res) => {
    try {
      const result = await prefRoute.setTheme(
        req.session.userid,
        req.body.darkmode
      );
      req.session.darkmode = req.body.darkmode;

      res.status(200).json({ message: "Theme updated successfully", result });
    } catch (e) {
      return res.status(e.status).json(e.message);
    }
  });

export default router;
