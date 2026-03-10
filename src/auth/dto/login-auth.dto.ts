import { IsEmail, IsOptional, IsString, MinLength } from "class-validator"

export class LoginAuthDto{
    @IsString()
    email: string
    @IsString()
    @MinLength(4)
    password: string
}