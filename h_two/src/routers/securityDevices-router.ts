import {Router} from "express";
import {authRefreshMiddleware} from "../middlewares/authRefreshMiddleware";
import {SecurityDevicesController} from "./security-devices-controller";
import {container} from "../composition-root";

export const securityDevicesRouter = Router({});

const securityDevicesController = container.get(SecurityDevicesController)

securityDevicesRouter.get('/devices', authRefreshMiddleware, securityDevicesController.getSessions.bind(securityDevicesController))

securityDevicesRouter.delete('/devices', authRefreshMiddleware, securityDevicesController.deleteOtherSessions.bind(securityDevicesController))

securityDevicesRouter.delete('/devices/:id', authRefreshMiddleware, securityDevicesController.deleteSessionById.bind(securityDevicesController))