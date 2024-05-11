
import { useState, useEffect } from "react";
import { Set, getAllSets } from "pokemon-tcg-sdk-typescript/dist/sdk";
import Image from "next/image"


import { GetStaticProps } from "next";

import { DehydratedState,QueryClient, dehydrate } from "@tanstack/react-query";
import { QueryKeys } from "@/Services/enums";
import { useSets } from "@/Services/Hooks";


export const getStaticProps: GetStaticProps<{dehydratedState: DehydratedState;}> = async () =>{
        console.log("I AM SERVER");


        const queryClient = new QueryClient();
        await queryClient.prefetchQuery({
          queryKey: [QueryKeys.sets],
          queryFn: async () =>{
            const sets = await getAllSets();
            return sets;
          },
        });
        console.log("I am from server");
        return {props: {dehydratedState: dehydrate(queryClient)} , revalidate: 30};
};

const Cards = (props: {serverSets: Set[]}) => {

    console.log(props);
    
    const {data: sets, isLoading , isError} = useSets();
    return (
        <div className="px-3 flex flex-wrap">
            {isLoading && "Loading...."}
            {sets?.map((set) =>{
               return (
                  <div key={set.id} className="flex px-3 flex-col">
                      <div className="relative w-[100px] h-[100px]">
                            <Image src={set?.images.logo || ""} fill alt="set logo"></Image>
                      </div>
                      <div className="">{set?.name || "loading...."}</div>
                  </div>
               );
                      
              })}
              {isError && "Error"}
        </div>
    );
  
}
export default Cards;




