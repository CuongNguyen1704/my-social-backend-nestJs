    import { PassportStrategy } from "@nestjs/passport";
    import { ExtractJwt, Strategy } from "passport-jwt";
    import { UserService } from "../user/user.service";
    import { Injectable, UnauthorizedException } from "@nestjs/common";

    @Injectable()
    export class JwtStrategy extends PassportStrategy(Strategy){
        constructor (private readonly userService: UserService){
            super({
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                ignoreExpiration: false,
                secretOrKey: 'key'
            });
        }

        async validate(payload:any){
            const email = payload.email;
            // console.log
            // const password = payload.password;
            // await this.userService.veryfiPassword(password)
            const user = await this.userService.findByEmail(email)

            if(user?.lastPasswordChange && payload.iat  * 1000 < user.lastPasswordChange.getTime()){
                throw new UnauthorizedException("Token Invalid to password change")
            }
            return user
        }
    }