import {Request, Response, NextFunction} from "express";
import {requestsToApiCollection} from "../db/mongo-db";

export const CRLChecking = async (req: Request, res: Response, next: NextFunction)=> {
    const ip = req.headers['x-forwarded-for']
    const url = req.baseUrl
    const date = new Date()
    date.setSeconds(date.getSeconds() - 10)
    if (ip!=undefined) {
        await requestsToApiCollection.insertOne({IP: ip, URL: url, date: date});
        const requestsCount = await requestsToApiCollection.find({IP: ip, URL: url, date: {$gte: date}}).toArray()
        if (requestsCount.length > 5) res.sendStatus(429)
        else next()
    } else res.sendStatus(429)
}