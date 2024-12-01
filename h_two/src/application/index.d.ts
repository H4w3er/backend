import {UserDbType} from "../db/user-type-db";

declare global {
    namespace Express {
        export interface Request {
            user: UserDbType | null
        }
    }
}
