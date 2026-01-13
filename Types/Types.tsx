export interface TimedPrice {
    price: number,
    date: string
}
export interface PositionEntry{
    name:string,
    acqPrice:number,
    acqQntty:number
    curQntty:number,
}
export interface Portfolio{
    ownerEmail:string,
    name:string,
    positions:PositionEntry[]
}
export interface AssetData {
    symbol: string,
    longName: string,
    description:string
}

export type StockTicker = AssetData | null;

export interface User {
    id: string;
    fname: string;
    lname: string;
    email: string;
}

export type AuthState = {
    logged: boolean;
    login: (email:string, password:string) => void;
    logout: () => void;
    user: User | null;
}
