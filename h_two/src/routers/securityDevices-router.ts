import {Router} from "express";
import {authRefreshMiddleware} from "../middlewares/authRefreshMiddleware";
import {securityDevicesService} from "../domain/securityDevices-service";
import {jwtService} from "../application/jwt-service";

export const securityDevicesRouter = Router({});

securityDevicesRouter.get('/devices', authRefreshMiddleware, async (req, res) =>{
    const refreshToken = req.cookies.refreshToken;
    const userId = await jwtService.getIdByToken(refreshToken)
    const sessions = await securityDevicesService.getActiveSessions(userId)
    res.status(200).send(sessions)
})

securityDevicesRouter.delete('/devices', authRefreshMiddleware, async (req, res) =>{
    const refreshToken = req.cookies.refreshToken;
    const userId = await jwtService.getIdByToken(refreshToken)
    const deviceId = await jwtService.getDeviceIdByToken(refreshToken)
    await securityDevicesService.deleteAllOther(userId, deviceId)
    res.sendStatus(204)
})

securityDevicesRouter.delete('/devices/:id', authRefreshMiddleware, async (req, res) =>{
    const refreshToken = req.cookies.refreshToken;
    const userId = await jwtService.getIdByToken(refreshToken)
    const deviceId = req.params.id
    const deleted = await securityDevicesService.deleteSessionByDeviceId(deviceId, userId)
    if (deleted === 0) res.sendStatus(403)
    else if (deleted===1) res.sendStatus(404)
    else res.sendStatus(204)
})