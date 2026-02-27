import NewsItemComponent from "@/components/NewsItemcomponent";
import API_BASE from "@/config";
import { NewsItem } from "@/Types/Types";
import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const newsUri = `${API_BASE}news`
export default function Index() {
  const [loading,setLoading] = useState<boolean>(true);
  const newsListRef = useRef<NewsItem[]>([]);

  useEffect(() => {
    async function getNews(abSignal:AbortSignal){
      const request: Request = new Request(newsUri,{
        method: "GET",
        signal: abSignal
      });
      try{
        const resp:Response = await fetch(request);
        const newsData:NewsItem[] = await resp.json();
        newsListRef.current = newsData;
        setLoading(false);
      }
      catch(e){
        if(e instanceof Error){

        }
      }
    }
    const aborter:AbortController = new AbortController();
    getNews(aborter.signal);
    return () => {
      aborter.abort();
    };
  },[])

  return (
    <SafeAreaProvider>
      <SafeAreaView  className="bg-green-400 h-20">
        
      </SafeAreaView>
      <ScrollView className="bg-white rounded flex-1" contentContainerStyle={{
        alignItems: "center",
        justifyContent: "center"
      }}>
        {loading ? 
          <View>
            <Text>LOADING..</Text>
          </View>
          :
          <>
            {newsListRef.current.map(ni => {
              return <NewsItemComponent
                title={ni.title}
                content={ni.content}
                key={ni.id}/>
            })}
          </>
        } 
      </ScrollView>
    </SafeAreaProvider>
  );
}
