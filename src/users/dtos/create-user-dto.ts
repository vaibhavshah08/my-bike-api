import{IsEmail , IsString} from 'class-validator';

export class CreateUserdto {
    @IsEmail()
    email: string;
    @IsString()
    password: string;
}