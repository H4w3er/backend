import {Request, Response, NextFunction} from "express";
import {RequestsToApiModel} from "../db/requests-to-api-type-db";

export const CRLChecking = async (req: Request, res: Response, next: NextFunction)=> {
    const ip = req.ip
    const url = req.originalUrl
    const date = new Date()
    if (ip!=undefined) {
        await RequestsToApiModel.insertOne({IP: ip, URL: url, date: date});
        date.setSeconds(date.getSeconds() - 10)
        const requestsCount = await RequestsToApiModel.find({IP: ip, URL: url, date: {$gte: date}}).lean()
        if (requestsCount.length > 5) res.sendStatus(429)
        else next()
    } else res.sendStatus(429)
}