import {ObjectId} from "mongodb";


export class UserDbTypeCommon {
    constructor(public _id: ObjectId,
        public userName: string,
        public email: string,
        public passwordHash: string,
        public passwordSalt: string,
        public createdAt: string,
        public emailConfirm: {
             confCode: string,
             isConfirmed: boolean
        },
        public refreshTokenBlackList: Array<string>

    )
    {}
}

export class UserViewType {
    constructor(public id: ObjectId,
                public login: string,
                public email: string,
                public createdAt: string
    ) {

    }
}