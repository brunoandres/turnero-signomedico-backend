export interface User{
    id?: string
    readonly name: string;
    readonly email: string;
    readonly username: string;
    readonly password: string;
    readonly puesto?: string;
}
