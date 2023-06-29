import { Body, Controller, Post, Get , Param, Delete,Patch, Query, NotFoundException, Session, UseGuards } from '@nestjs/common';
import { CreateUserdto } from './dtos/create-user-dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user-dto';
import { serialize } from '../interceptors/serialize.interceptor';
import { Userdto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorators';
import { UserEntity } from './user.entity';
import { Authguard } from '../guards/auth.guards';


@Controller('auth')
@serialize(Userdto)

export class UsersController {
    constructor(
        private userService: UsersService,
        private authService: AuthService
        ) {}

    // @Get('/Whoami')
    // whoamI(@Session() Session: any) {
    //     return this.userService.findOne(Session.userId);
    // }

    @Get('/whoami')
    @UseGuards(Authguard)
    whoami(@CurrentUser() user: UserEntity) {
        return user;
    }

    @Post('/signout')
    signOut(@Session() Session: any){
        Session.userId = null;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserdto, @Session() session: any){
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserdto, @Session() session: any){
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }
    @Get('/:id')
    async findUser(@Param('id') id: string){
        const user = await this.userService.findOne(parseInt(id));
        if(!user) {
            throw new NotFoundException('User not Found!!');
        }
        return user;
    }

    @Get()
    findAllusers(@Query('email') email:string)
    {
        return this.userService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id:string)
    {
        return this.userService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto){
        return this.userService.update(parseInt(id),body);
    }


}
