import {Router, Request, Response} from "express";
import {authRefreshMiddleware} from "../middlewares/authRefreshMiddleware";
import {SecurityDevicesService} from "../domain/securityDevices-service";
import {JwtService} from "../application/jwt-service";

export const securityDevicesRouter = Router({});

const answersMap = new Map();
answersMap.set("accessRejected", 403)
answersMap.set("notFound", 404)
answersMap.set("successDelete", 204)

class SecurityDevicesController {
    securityDevicesService: SecurityDevicesService
    jwtService: JwtService

    constructor() {
        this.securityDevicesService = new SecurityDevicesService()
        this.jwtService = new JwtService()
    }

    async getSessions(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const verifiedToken = await this.jwtService.getIdFromToken(refreshToken)
        await this.securityDevicesService.sessionUpdate(verifiedToken.userId, verifiedToken.deviceId, refreshToken)

        const sessions = await this.securityDevicesService.getActiveSessions(verifiedToken.userId)
        res.status(200).send(sessions)
    }
    async deleteOtherSessions(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const verifiedToken = await this.jwtService.getIdFromToken(refreshToken)
        await this.securityDevicesService.deleteAllOther(verifiedToken.userId, verifiedToken.deviceId)
        res.sendStatus(204)
    }
    async deleteSessionById(req: Request, res: Response){
        const refreshToken = req.cookies.refreshToken;
        const deviceId = req.params.id
        const userIdFromToken = await this.jwtService.getIdFromToken(refreshToken)
        const deleted = await this.securityDevicesService.deleteSessionByDeviceId(deviceId, userIdFromToken.userId)
        res.sendStatus(answersMap.get(deleted))
    }
}

const securityDevicesController = new SecurityDevicesController()

securityDevicesRouter.get('/devices', authRefreshMiddleware, securityDevicesController.getSessions.bind(securityDevicesController))

securityDevicesRouter.delete('/devices', authRefreshMiddleware, securityDevicesController.deleteOtherSessions.bind(securityDevicesController))

securityDevicesRouter.delete('/devices/:id', authRefreshMiddleware, securityDevicesController.deleteSessionById.bind(securityDevicesController))