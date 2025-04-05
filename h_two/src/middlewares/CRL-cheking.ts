import {Request, Response, NextFunction} from "express";
import {requestsToApiCollection} from "../db/mongo-db";

export const CRLChecking = async (req: Request, res: Response, next: NextFunction)=> {
    const ip = req.ip
    const url = req.originalUrl
    const date = new Date()
    if (ip!=undefined) {
        await requestsToApiCollection.insertOne({IP: ip, URL: url, date: date});
        date.setSeconds(date.getSeconds() - 10)
        const requestsCount = await requestsToApiCollection.find({IP: ip, URL: url, date: {$gte: date}}).toArray()
        if (requestsCount.length > 5) res.sendStatus(429)
        else next()
    } else res.sendStatus(429)
}