import { createParamDecorator } from '@nestjs/common';

export const UserLogon = createParamDecorator((data: string, request) => {
    return data ? request.user && request.user[data] : request.user;
});