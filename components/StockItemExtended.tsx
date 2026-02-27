import { API_BASE_URL, AuthContext } from "@/contexts/AuthContext";
import { PortfolioContext } from "@/contexts/PortfolioContext";
import { BoundsPair, ChartData, LineChartData, LineChartDataItem, PositionConfirmation, PositionCreationRequest, PositionDirection, PositionVerification, StockItemExtendedProps, TimedPrice } from "@/Types/Types";
import { useContext, useEffect, useRef, useState } from "react";
import { Alert, Dimensions, Text, TextInput, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import SelectDropdown from 'react-native-select-dropdown';
import ThemedButton from "./ThemedButton";

export default function StockItemExtended({symbol,tickerType,closeModal}:StockItemExtendedProps){
    const [loading,setLoading] = useState<boolean>(true);
    const [currArr,setCurrArr] = useState<LineChartData>(null!);
    const selectedPtfIdRef = useRef<string>("");
    const [quantity,setQuantity] = useState<number>(0);
    const [positionCreated,setPositionCreated] = useState<boolean | null>(null);
    const {fetchWrapper,loggedIn} = useContext(AuthContext);
    const {portfolios} = useContext(PortfolioContext);
    const priceBoundArrRef = useRef<BoundsPair[]>([]);
    const currIndexRef = useRef<number>(-1); //necessary for chart bounds rendering
    const lineChartDataRef = useRef<LineChartData[]>([]);
    const ptfDropDownItemsRef = useRef<object[]>([]);
    const posTypeRef = useRef<PositionDirection | null>(null);

    const screenWidth = Dimensions.get("screen").width;
    const hisotryUri = `${API_BASE_URL}tickers/${tickerType}/${symbol}/history`;
    
    useEffect(() => {
        const getHistory = async function(signal:AbortSignal){
            try{
                const boundsPriceArr:BoundsPair[] = [];
                const request:Request = new Request(hisotryUri,{
                    method: "GET",
                    signal: signal
                });
                const response: Response = await fetchWrapper(request);
                const charts: ChartData = await response.json();
                
                const oneDayBounds = getBounds(charts.lastDayPrices);
                const twoWeekBounds = getBounds(charts.lastTwoWeekPrices);
                const twoMonthBounds = getBounds(charts.lastTwoMonthPrices);
                const oneYearBounds = getBounds(charts.lastYearPrices);
                const fiveYearBound = getBounds(charts.lastFiveYearPrices);
                initData(charts);
                boundsPriceArr.push(oneDayBounds,twoWeekBounds,twoMonthBounds,oneYearBounds,fiveYearBound);

                priceBoundArrRef.current = boundsPriceArr;
                currIndexRef.current = 0;
                setCurrArr(lineChartDataRef.current[0]);

                const formattedPtfs:object[] = portfolios.map(ptf => 
                    {
                        return {title: ptf.displayName,id:ptf.id};
                    });
                ptfDropDownItemsRef.current = formattedPtfs;
            }
            catch(e){
                if(e instanceof Error){
                    console.log(e.message);
                }
            }
            finally{
                setLoading(false);
            }
        }

        const controller:AbortController = new AbortController();
        const token:AbortSignal = controller.signal;
        getHistory(token);
        return () => controller.abort();
    },[])

    useEffect(() => {
        console.log("[LOG] Should've re-rendered!");
    },[positionCreated])


    function initData(chartData:ChartData): void{
        function formatDateDayTime(str:string):string{
            const dayTime: string | undefined = str.split("T").at(1);
            if (dayTime){
                return dayTime.slice(0,5);
            }
            throw new Error("bad date format, couldn't extract date");
        }

        function formatDateCalendarDate(str:string):string {
            const dayTime: string | undefined = str.split("T").at(0);
            if (dayTime){
                return dayTime.slice(5,10);
            }
            throw new Error("bad date format, couldn't extract date");
        }
        
        function getChartDataItem(timedPrices:TimedPrice[],formatDate: (str:string) => string):
            LineChartData
        {
            let currChartData:LineChartData = {data: []};
            let counter: number = 0;
            for (let tp of timedPrices){
                const item:LineChartDataItem = {value:tp.price};
                if(counter % STEP === 0){
                    
                    item.label = formatDate(tp.date);
                    item.labelTextStyle = {color: "white"}
                }
                currChartData.data.push(item);
                counter++;
            }
            return currChartData;
        }
        const STEP: number = 5;
        const data: LineChartData[] = [];
        data.push(getChartDataItem(chartData.lastDayPrices,formatDateDayTime));
        data.push(getChartDataItem(chartData.lastTwoWeekPrices,formatDateCalendarDate));
        data.push(getChartDataItem(chartData.lastTwoMonthPrices,formatDateCalendarDate));
        data.push(getChartDataItem(chartData.lastYearPrices,formatDateCalendarDate));
        data.push(getChartDataItem(chartData.lastFiveYearPrices,formatDateCalendarDate));
        
        lineChartDataRef.current = data;
    }

    function getBounds(arr: TimedPrice[]):BoundsPair {
        let min = Number.MAX_VALUE;
        let max = Number.MIN_VALUE;
        for(let td of arr){
            min = td.price < min ? td.price : min;
            max = td.price >= min ? td.price : min;
        }
        const ans:BoundsPair = {lowerBound:min, upperBound:max};
        console.log(JSON.stringify(ans));
        return ans;
    }

    function changeCurrentChart(index: number) {
        switch(index){
            case 0:
                currIndexRef.current = 0;
                setCurrArr(lineChartDataRef.current[0]);
                break;
            case 1:
                currIndexRef.current = 1;
                setCurrArr(lineChartDataRef.current[1]);
                break;
            case 2:
                currIndexRef.current = 2;
                setCurrArr(lineChartDataRef.current[2]);
                break;
            case 3:
                currIndexRef.current = 3;
                setCurrArr(lineChartDataRef.current[3]);
                break;
            case 4:
                currIndexRef.current = 4;
                setCurrArr(lineChartDataRef.current[4]);
                break;
        }
    }
    function createLongRequest() {
        posTypeRef.current = PositionDirection.LONG;
    }

    function createShortRequest() {
        posTypeRef.current = PositionDirection.SHORT;
    }

    async function createPositionRequest(){
        const ptfId:string = selectedPtfIdRef.current;
        const currQuantity:number = quantity;
        const posReqUri = `${API_BASE_URL}portfolios/${ptfId}/position-request`;
        let request:Request | null = null;
        if(posTypeRef.current === null){
            alert("Choose SHORT/LONG");
            return;
        }
        if(ptfId === ""){
            alert("Choose portfolio");
            return;
        }
        if(currQuantity === 0){
            alert("Choose proper quantity");
            return;
        }
        const posCreationReq:PositionCreationRequest = {
            Symbol: symbol,
            PositionType: posTypeRef.current,
            Quantity: quantity
        }
        const jsonBody:string = JSON.stringify(posCreationReq);
        console.log("postBody: " + jsonBody);
        request = new Request(posReqUri,{
            method: "POST",
            body: jsonBody
        });
        try{
            const resp:Response = await fetchWrapper(request);
            console.log(resp.status);
            if(resp.status === 403){
                const problem:string = await resp.json();
                alert(problem);
                return;
            }
            if(resp.status === 501){
                alert("Internal Error, Try again later, sorry");
                return;
            }
            const verification: PositionVerification = await resp.json();
            console.log(`Verification: ${JSON.stringify(verification)}`);
            confirmAlert(verification,ptfId);
        }
        catch(e){
            if(e instanceof Error){
                console.log(`[LOG] in createPosRequest ${e.message}`);
            }
        }
    }
    function confirmAlert(verification: PositionVerification,ptfId:string){
        const msg:string = `Position for ${symbol}, with price: ${verification.price} \n
            for ${verification.quantity} units.`
        Alert.alert("Confirm Position:",msg,[
            {
                text: "Confirm",
                onPress: () => sendConfirmation(verification,true)
            },
            {
                text: "Deny",
                onPress: () => sendConfirmation(verification,false)
            }
        ])
        async function sendConfirmation(verification: PositionVerification,decision: boolean) {
            const uri:string = `${API_BASE_URL}portfolios/${ptfId}/position-confirmation`;
            const posConf:PositionConfirmation = {
                VerificationId: verification.id,
                Confirmed: decision
            }
            const jsonBody:string = JSON.stringify(posConf);
            const request:Request = new Request(uri,{
                method: "POST",
                body:jsonBody
            })
            const response:Response = await fetchWrapper(request);
            if(response.status !== 200 && response.status !== 201){
                console.log(`[LOG] response status = ${response.status}`);
                setPositionCreated(false);
            }
            else{
                setPositionCreated(true);
            }
        }
    }

    return (
        <View className="items-center">
            {!loading ? 
            (<>
            <View className="bg-gray-900 w-full pt-6">
            <LineChart 
                    areaChart
                    data={currArr.data}
                    height={240}
                    spacing={80}
                    width={screenWidth}
                    showVerticalLines
                    verticalLinesUptoDataPoint
                    color="#00ff83"
                    thickness={2}
                    startFillColor="rgba(20,105,81,0.3)"
                    endFillColor="rgba(20,85,81,0.01)"
                    startOpacity={0.9}
                    endOpacity={0.3}
                    initialSpacing={30}
                    noOfSections={6}
                    yAxisColor="white"
                    yAxisThickness={0}
                    rulesType="solid"
                    rulesColor="white"
                    yAxisTextStyle={{color: 'white'}}
                    xAxisColor="lightgray"
                    verticalLinesColor={"white"}
                    yAxisOffset={priceBoundArrRef.current[currIndexRef.current].lowerBound}
                    yAxisLabelWidth={60}
                    xAxisIndicesWidth={20}
                    xAxisIndicesColor={"white"}
                    xAxisLabelsVerticalShift={40}
                    noOfSectionsBelowXAxis={1}
                    xAxisTextNumberOfLines={2}
                    // stepValue={(priceBoundArrRef.current[currIndexRef.current].upperBound -
                    //     priceBoundArrRef.current[currIndexRef.current].lowerBound)}
                ></LineChart>
            </View>
            
                <View className="w-full flex-row gap-4 items-center justify-center ">
                    <ThemedButton 
                        textColor="white"
                        textSize="2xl"
                        bgStyle="pt-2 mt-4 w-16 h-14 border-2 rounded-3xl bg-gray-900"
                        text="24H" onPress={() => changeCurrentChart(0)}
                    ></ThemedButton>
                    <ThemedButton 
                        textColor="white"
                        textSize="2xl"
                        bgStyle="pt-2 mt-4 w-16 h-14 border-2 rounded-3xl bg-gray-900"
                        text="2W" onPress={() => changeCurrentChart(1)}
                    ></ThemedButton>
                    <ThemedButton 
                        textColor="white"
                        textSize="2xl"
                        bgStyle="pt-2 mt-4 w-16 h-14 border-2 rounded-3xl bg-gray-900"
                        text="2M" onPress={() => changeCurrentChart(2)}
                    ></ThemedButton>
                    <ThemedButton 
                        textColor="white"
                        textSize="2xl"
                        bgStyle="pt-2 mt-4 w-16 h-14 border-2 rounded-3xl bg-gray-900"
                        text="1Y" onPress={() => changeCurrentChart(3)}
                    ></ThemedButton>
                    <ThemedButton 
                        textColor="white"
                        textSize="2xl"
                        bgStyle="pt-2 mt-4 w-16 h-14 border-2 rounded-3xl bg-gray-900"
                        text="5Y" onPress={() => changeCurrentChart(4)}
                    ></ThemedButton>
                </View>
                {loggedIn ? 
                <View>
                    <View className="border h-14 rounded-xl mt-6 justify-center items-center">
                    <SelectDropdown
                        data = {ptfDropDownItemsRef.current}
                        onSelect = {(selectedItem,index)=> selectedPtfIdRef.current = selectedItem.id}
                        renderButton = {(selectedItem,isOpened) =>{
                            return (
                                <View className="w-96" style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',                                    
                                }}>
                                    <Text style={{
                                        fontSize: 24,
                                        color: '#151E26'
                                    }}>{"SELECT PORTFOLIO"}</Text>
                                </View>
                            );
                        }}
                        renderItem = {(item,index,isSelected) => {
                            return (
                                <View style={{
                                    backgroundColor: '#D2D9DF',
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{
                                        paddingTop: 15,
                                        height: 60,
                                        fontWeight: 'bold',
                                        fontSize: 18,
                                        color: '#151E26',
                                    }}>{item.title}</Text>
                                </View>
                            );
                        }}
                        showsVerticalScrollIndicator={true}
                        dropdownStyle={{
                            borderRadius: 8,
                            backgroundColor: '#E9ECEF'}}>

                    </SelectDropdown>
                    </View>
                    <View className="items-center justify-center">
                        <View className="w-full flex-row gap-2">
                            <ThemedButton 
                                textColor="black"
                                textSize="2xl"
                                bgStyle="pt-2 mt-4 w-48 h-14 border-2 rounded-3xl bg-emerald-400"
                                text="LONG" onPress={() => createLongRequest()}
                            ></ThemedButton>
                            <ThemedButton 
                                textColor="black"
                                textSize="2xl"
                                bgStyle="pt-2 mt-4 w-48 h-14 border-2 rounded-3xl bg-red-400"
                                text="SHORT" onPress={() => createShortRequest()}
                            ></ThemedButton>
                        </View>
                        <TextInput
                            style={{
                                fontSize: 24,
                                color: '#151E26',
                                padding: 10,
                                borderWidth: 1,
                                borderRadius: 10,
                                marginTop: 10,
                                width: Math.floor(screenWidth * 0.86),
                                textAlign: 'center'
                            }}
                            onChangeText={(val:string) => {
                                if(val === ""){
                                    setQuantity(0);
                                    return;
                                }
                                if(isNaN(Number.parseInt(val)) === false)
                                    setQuantity(Number.parseInt(val));
                            }}
                            value={quantity === 0 ? "" : quantity.toString()}
                            placeholder="Select Quantity"></TextInput>
                        <ThemedButton 
                            textColor="white"
                            textSize="2xl"
                            bgStyle="pt-2 mt-4 w-48 h-14 border-2 rounded-3xl bg-gray-950"
                            text="OPEN POSITION" onPress={() => createPositionRequest()}
                        ></ThemedButton>
                        {positionCreated === null ? <></> :
                        <View className="justify-center items-center">
                            <Text>{positionCreated ? "CREATED" : "CREATION FAILED"}</Text>
                        </View>}
                    </View>
                </View> :
                <></>
                }
                <ThemedButton 
                    textColor="black"
                    textSize="2xl"
                    bgStyle="py-5 mt-4 w-96 h-20 border-2 rounded-3xl bg-emerald-400 p-1"
                    text="GO BACK" onPress={() => closeModal()}
                ></ThemedButton>       
            </>):
            (<>
            <View className="bg-gray-900 items-center">
                <Text>LOADING</Text>
            </View>
            </>)
        } 
        </View>
    )
}