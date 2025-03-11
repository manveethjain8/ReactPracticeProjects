import{useState, useEffect} from 'react';
import axios from 'axios';

const useAxiosFetch=(dataURL)=>{
    const [data, setData]=useState([]);

    useEffect(()=>{
        let isMounted=true;
        const source=axios.CancelToken.source();

        const fetchData=async (url)=>{
            try{
                const response=await axios.get(url,{cancelToken:source.token});
                if(isMounted){
                    setData(response.data);
                }
            }catch(err){
                if(isMounted){
                    console.error(err);
                    setData([]);
                }
            }
        }
        fetchData(dataURL);
        const cleanUp=()=>{
            isMounted=false;
            source.cancel();
        }
        return cleanUp;
    },[dataURL]);

    return {data}
}   

export default useAxiosFetch;