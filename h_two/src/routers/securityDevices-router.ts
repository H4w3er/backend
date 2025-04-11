import {Router} from "express";
import {authRefreshMiddleware} from "../middlewares/authRefreshMiddleware";
import {securityDevicesService} from "../domain/securityDevices-service";
import {jwtService} from "../application/jwt-service";

export const securityDevicesRouter = Router({});

const answersMap = new Map();
answersMap.set("accessRejected", 403)
answersMap.set("notFound", 404)
answersMap.set("successDelete", 204)

securityDevicesRouter.get('/devices', authRefreshMiddleware, async (req, res) =>{
    const refreshToken = req.cookies.refreshToken;
    const verifiedToken = await jwtService.getIdFromToken(refreshToken)
    await securityDevicesService.sessionUpdate(verifiedToken.userId, verifiedToken.deviceId, refreshToken)

    const sessions = await securityDevicesService.getActiveSessions(verifiedToken.userId)
    res.status(200).send(sessions)
})

securityDevicesRouter.delete('/devices', authRefreshMiddleware, async (req, res) =>{
    const refreshToken = req.cookies.refreshToken;
    const verifiedToken = await jwtService.getIdFromToken(refreshToken)
    await securityDevicesService.deleteAllOther(verifiedToken.userId, verifiedToken.deviceId)
    res.sendStatus(204)
})

securityDevicesRouter.delete('/devices/:id', authRefreshMiddleware, async (req, res) =>{
    const refreshToken = req.cookies.refreshToken;
    const deviceId = req.params.id
    const userIdFromToken = await jwtService.getIdFromToken(refreshToken)
    const deleted = await securityDevicesService.deleteSessionByDeviceId(deviceId, userIdFromToken.userId)

    res.sendStatus(answersMap.get(deleted))
})