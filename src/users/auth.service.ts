import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { parseArgs, promisify } from "util";
import { promises } from "dns";
import { UserEntity } from "./user.entity";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    
    // static signup: any;
    constructor(private usersService: UsersService){}

    async signup(email: string, password: string):  Promise<UserEntity> {
        const users = await this.usersService.find(email);
        if (users.length) {
            throw new BadRequestException('Email in Use')
        }
        
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        const result = salt + '.' + hash.toString('hex');

        const user = await this.usersService.create(email,result);

        return user;

    }

    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email);
        if (!user){
            throw new NotFoundException('Error not Found!!!!');
        }

        const [salt, Shash]= user.password.split('.');
        const hash = (await scrypt(password, salt,32)) as Buffer; 

        if(Shash !== hash.toString('hex')){
            throw new BadRequestException('Wrong Password');
        }
        
        return user;
    }   
}