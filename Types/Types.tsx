import { PropsWithChildren } from "react";
import { StyleProp, TextStyle } from "react-native";

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
    longName:string;
    symbol:string;
    price:number;
    isUp: boolean;
}
export interface StockItemWrapperProp{
    longName:string;
    symbol:string;
    price:number;
    isUp: boolean;
    setModalInfo: (symbol:string) => Promise<void>;
}
export interface StockItemExtendedProps{
    symbol:string;
    tickerType:string;
    closeModal: () => void;
}
export interface ChartData{
    symbol:string;
    lastDayPrices: TimedPrice[];
    lastTwoWeekPrices: TimedPrice[];
    lastTwoMonthPrices: TimedPrice[];
    lastYearPrices: TimedPrice[];
    lastFiveYearPrices: TimedPrice[];
}
export interface LineChartData{
    data: LineChartDataItem[];
}
export interface LineChartDataItem{
    value: number;
    label?: string;
    labelTextStyle?: StyleProp<TextStyle>;
}
export interface StockItemWrapperProps{
    itemProp: StockItemProp;
    withChilrenProp: PropsWithChildren;
}
export interface PortfolioAddProp{
    closeModal: () => void;
}
export interface BoundsPair{
    lowerBound:number;
    upperBound:number;
}
export interface TimedPrice {
    price: number;
    date: string;
}
export interface ReportModalProps{
    closeModal: () => void;
    report: Report | null;
}
export interface PositionItemProp{
    ptfId: string;
    position: PositionEntry;
}
export interface PositionListProp{
    ptfId: string;
    positions: PositionEntry[];
}
export interface AuthenticationRequest{
    Username:string;
    Password:string;
}
export interface PositionEntry{
    id:string;
    symbol:string;
    quantity:number;
    price:number;
    positionType: PositionDirection;
}
export interface PositionCreationRequest{
    Symbol:string;
    Quantity:number;
    PositionType: PositionDirection
}
export interface ProblemResult{
    problem:string;
}
export interface PositionVerification{
    id:string;
    quantity: number;
    price: number;
}
export interface PositionConfirmation{
    VerificationId:string;
    Confirmed:boolean;
}
export enum PositionDirection{
    LONG = "LONG",
    SHORT = "SHORT"
}
export interface PortfolioCreationRequest{
    DisplayName:string;
    PtfType: PortfolioType;
}
export enum PortfolioType{
    REGULAR = "REGULAR",
    ADVANCED = "ADVANCED",
} 
export interface Portfolio{
    displayName:string;
    id:string;
    positions: PositionEntry[];
    portfolioType: string;
}

export interface PortfolioItemProps{
    portfolioData:Portfolio;
    closeModal: () => void;
}
export interface PortfolioIdentifier{
    id:string;
    displayName:string;
}
export interface AssetData {
    symbol: string;
    longName: string;
    description:string;
    tickerType:string;
    price: number;// | null;
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
    balance: string;
}
export interface Report {
    currentBalance: number;
    totalPortfoliosWorth: number;
    openShortPositionsCount: number;
    openLongPositionsCount: number;
    perAssetGain: AssetToGain[];
}
export interface AssetToGain{
    assetName:string;
    gain: number;
}
export type AuthState = {
    login: (email:string, password:string) => Promise<void>;
    loggedIn: boolean;
    logout: () => void;
    getProfile: () => Profile | null;
    fetchWrapper: (req:Request) => Promise<Response>;
}

export interface NewsItem{
    id:string;
    title: string;
    content: string;
}
export interface NewsItemProps{
    title:string;
    content:string;
}
export type PortfolioState = {
    portfolios: Portfolio[];
    addPortfolio: (ptf:Portfolio) => void;
    clearPortfolios: () => void;
    removePosition: (ptfId:string,posId:string) => void;
    getPortfolioByDisplayName: (name:string) => Portfolio | null;
    fetchPortfolios: (abortSignal:AbortSignal | null) => Promise<void>;
}
