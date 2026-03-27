import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class customerLoginChecker implements NestMiddleware {
    constructor(
        private jwtService: JwtService,
        private config: ConfigService
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.headers.authorization) return res.status(HttpStatus.BAD_REQUEST).send("you must be logged in")
            let token = req.headers.authorization?.split(' ')[1]

            const decoded = this.jwtService.verify(token, { secret: this.config.get<string>('CUSTOMER_JWT_AUTH_SECRET') })
            res.locals.user = decoded

            next()
        } catch (e) {
            if (e.message === "jwt expired")
                return res.status(HttpStatus.UNAUTHORIZED).send("login again")

            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("login again")
        }
    }
}