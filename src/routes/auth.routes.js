import { Router } from "express";
import { login, panel, register } from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateSession.js";
import { validateData } from "../middlewares/validateData.js";
import { loginSchema } from "../schemas/auth.schema.js";
const router = Router()

router.post('/login', validateData(loginSchema) ,login)

router.post('/register',register)

router.get('/panel', authRequired, panel)


export default router