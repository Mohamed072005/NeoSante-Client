import {jwtDecode} from "jwt-decode";


export class JwtDecoder {
    static decode<T>(token: string): T {
        try {
            const decoded = jwtDecode<T>(token);
            return decoded;
        }catch (err: unknown){
            console.log(err);
            throw err;
        }
    }

    static isTokenExpired(expDate: number): boolean {
        try {
            const currentTime = Math.floor(Date.now() / 1000);
            return expDate < currentTime;
        }catch (err: unknown){
            console.log(err);
            throw err;
        }
    }
}