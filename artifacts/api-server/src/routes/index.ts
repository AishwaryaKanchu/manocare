import { Router, type IRouter } from "express";
import healthRouter from "./health";
import medicinesRouter from "./medicines";
import logRouter from "./log";

const router: IRouter = Router();

router.use(healthRouter);
router.use(medicinesRouter);
router.use(logRouter);

export default router;
