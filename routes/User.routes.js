import {Router} from "express"
import { registerUser } from "../controllers/User.controllers.js"
import { loginUser } from "../controllers/User.controllers.js";

const router = Router();

router.route("/registerUser").post(registerUser);
router.route("/loginUser").post(loginUser)


export default router;