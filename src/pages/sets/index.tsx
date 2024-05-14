
import { Set } from "pokemon-tcg-sdk-typescript/dist/sdk";
import Image from "next/image"


import { GetStaticProps } from "next";


import { DehydratedState, QueryClient, dehydrate } from "@tanstack/react-query";

import Link from "next/link";
import { useState } from "react";
import { QueryKeys } from "@/Services/enums";
import { getAllSets } from "@/Services/pokemon.service";
import { useSets, useUpdateSetsName } from "@/Services/Hooks";



export const getStaticProps: GetStaticProps<{ dehydratedState: DehydratedState; }> = async () => {
  console.log("I AM SERVER");


  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.sets],
    queryFn: async () => {
      const sets = await getAllSets();
      return sets;
    },
  });
  console.log("I am from server");
  return { props: { dehydratedState: dehydrate(queryClient) }, revalidate: 30 };
};

const SetList = (props: { serverSets: Set[] }) => {

  console.log(props);
  const { data: sets, isLoading, isError } = useSets();
  const {mutate: updateName} = useUpdateSetsName();
  const [setName, setSetName] = useState("");

  return (
    <div className="px-3 flex flex-wrap">
      {isLoading && "Loading...."}

      {sets?.map((set) => {
        return (
          <div>
           
              <div key={set.id} className="h-[300px] w-[300px]  flex-col mr-24 border-2 py-4 px-4 ml-6 mt-6 mb-6 rounded-md">
                <div className="relative w-[200px] h-[200px]">
                  <Image src={set?.images.logo || ""} fill alt="set logo"></Image>
                </div>
                <div className="text-center bg-gray-200 text-gray-600 py-2 text-xl font-bold mt-2">{set?.name || "loading...."}</div>
              </div>

           
            <div className="flex flex-col gap-2 ml-6 mb-12">
              <input
                name="set-name"
                className="border-2 w-72 px-2 py-1"
                type="text"
                placeholder="Set the Name"
                onKeyUp={(e) => {
                  setSetName(e.currentTarget.value);
                }}
              />
              <button
                onClick={()=>{
                  if(setName){
                    updateName({
                      setId: set.id as string,
                      setName: setName,
                    })
                  }
                }}
              ><p className="bg-gray-400 px-2 py-2 w-72 rounded-md text-white">Set Name</p></button>
            </div>
          </div>
        );

      })}
      {isError && "Error"}

    </div>

  );

}
export default SetList;