import {Router} from "express"
import { registerUser } from "../controllers/User.controllers.js"
import { loginUser } from "../controllers/User.controllers.js";
import { logoutUser } from "../controllers/User.controllers.js";
import { uploadText } from "../controllers/textUpload.controller.js";

const router = Router();

router.route("/registerUser").post(registerUser);
router.route("/loginUser").post(loginUser)
router.post("/logout", logoutUser);
router.post("/uploadText", uploadText);


export default router;