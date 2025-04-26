import {injectable} from "inversify";
import {SecurityDevicesService} from "../domain/securityDevices-service";
import {JwtService} from "../application/jwt-service";
import {Request, Response} from "express";

const answersMap = new Map();
answersMap.set("accessRejected", 403)
answersMap.set("notFound", 404)
answersMap.set("successDelete", 204)

@injectable()
export class SecurityDevicesController {
    constructor(protected securityDevicesService: SecurityDevicesService,
                protected jwtService: JwtService) {
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

    async deleteSessionById(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const deviceId = req.params.id
        const userIdFromToken = await this.jwtService.getIdFromToken(refreshToken)
        const deleted = await this.securityDevicesService.deleteSessionByDeviceId(deviceId, userIdFromToken.userId)
        res.sendStatus(answersMap.get(deleted))
    }
}