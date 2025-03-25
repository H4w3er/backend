import {Router} from "express";
import {authRefreshMiddleware} from "../middlewares/authRefreshMiddleware";
import {securityDevicesService} from "../domain/securityDevices-service";

export const securityDevicesRouter = Router({});

securityDevicesRouter.get('/devices', authRefreshMiddleware, async (req, res) =>{
    const sessions = await securityDevicesService.getActiveSessions()
    res.send(sessions)
})

securityDevicesRouter.delete('/devices', authRefreshMiddleware, async (req, res) =>{

})

securityDevicesRouter.delete('/devices/:id', authRefreshMiddleware, async (req, res) =>{

})