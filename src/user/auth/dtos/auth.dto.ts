import { UserStatus, UserType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  firstname: string;

  @IsOptional()
  @MaxLength(30)
  lastname?: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone?: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(UserStatus)
  user_status?: UserStatus;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  productKey?: string;
}

export class SignInDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class GenerateProductKeyDto {
  @IsEmail()
  email: string;

  @IsEnum(UserType)
  userType: UserType;
}
