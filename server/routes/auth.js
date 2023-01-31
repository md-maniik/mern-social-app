import {login, register, deleteAll, getusers} from "../controllers/auth.js"
import express from "express";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/delete', deleteAll);
router.get('/get', getusers);

export default router