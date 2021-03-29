import React, { useCallback, useEffect } from "react"

export const useFetchData = async (url: string,token: string) =>{
    
   const getData = useCallback(async (): Promise<void> => {
          try {
            const res = await fetch("http://localhost:4242/users/my_orders", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await res.json();
           return data
          } catch (err) {
            throw new Error(err);
          }
        }, []);

        useEffect(() => {
            getData()
        },[getData()])
}