export interface RegistrationForm{
    Username:string;
    Email:string;
    Password:string;
    FirstName:string;
    LastName:string;
}
export interface TickerContainerProps{
    tickerType:string;
}
export interface AuthenticationResponse{
    idToken:string;
    accessToken:string;
    refreshToken:string;
}
export interface StockItemProp{
    assetType:string;
    longName:string;
    symbol:string;
    price:number | null;
}
export interface TimedPrice {
    price: number;
    date: string;
}
export interface AuthenticationRequest{
    Username:string;
    Password:string;
}
export interface PositionEntry{
    Symbol:string;
    InitialPrice:number;
    Quantity:number;
}
export interface PortfolioCreationRequest{
    DisplayName:string;
    PtfType: PortfolioType;
}
export interface Portfolio{
    DisplayName:string;
    Positions:PositionEntry[];
}
export interface AssetData {
    symbol: string;
    longName: string;
    description:string;
    tickerType:string;
    price: number | null;
}
export type StockTicker = AssetData;
export interface TimedDataWithSymbol{
    date:string;
    price:number;
    symbol:string
}
export interface Profile {
    firstName: string;
    lastName: string;
    email: string;
}
export enum PortfolioType{
    REGULAR = "REGULAR",
    ADVANCED = "ADVANCED",
} 

export type AuthState = {
    login: (email:string, password:string) => Promise<void>;
    loggedIn: boolean;
    logout: () => void;
    profile: Profile | null;
    fetchWrapper: (req:Request) => Promise<Response>;
}

export type PortfolioState = {
    portfolios: Portfolio[];
    addPortfolio: (ptf:Portfolio) => void;
    clearPortfolios: () => void;
    getPortfolioByDisplayName: (name:string) => Portfolio | null;
}
