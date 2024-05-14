//ssg with prefetch
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect, FC } from "react";
import { DehydratedState, QueryClient, dehydrate, useQueryClient } from '@tanstack/react-query';
import { Set, getAllSets } from "pokemon-tcg-sdk-typescript/dist/sdk";
import { GetStaticProps, GetStaticPaths } from "next";
import { getSetById } from "@/Services/pokemon.service";
import { QueryKeys } from "@/Services/enums";
import { useSet, useUpdateSetsName } from "@/Services/Hooks";



export const getStaticPaths: GetStaticPaths = async (context) => {
  let allSets = await getAllSets();
  console.log(allSets);
  let listOfSetIdObjects = allSets.map((x) => {
    return { params: { setid: x.id } };
  });
  return { paths: listOfSetIdObjects.splice(0, 10), fallback: "blocking" };
};



export const getStaticProps: GetStaticProps<{ dehydratedState: DehydratedState }> = async (context) => {
  console.log("I AM SERVER");

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.set, context?.params?.setid],
    queryFn: async () => {
      const set = await getSetById(context?.params?.setid as string);
      return set;
    },
  });

  return { props: { dehydratedState: dehydrate(queryClient) }, revalidate: 120 };
};



const SetPage: FC<any> = ({ serverSet }) => {
  const router = useRouter();
  const { data: set, isLoading, isError } = useSet(router.query.setid as string);
  console.log(set);
  console.log(set, isLoading);

  const { mutate: updateName } = useUpdateSetsName();
  const [setName, setSetName] = useState(set?.name);
  return (
    <div className="flex h-full">
      {isLoading && "Loading...."}
      <div key={set?.id} className="flex  flex-col mr-24 border-2 py-4 px-4 ml-6 mt-6 mb-6 rounded-md" >
        <div className="relative w-[300px] h-[300px]">
          <Image src={set?.images?.logo || ""} fill alt="set logo" />
        </div>
        <div className="text-center bg-gray-200 text-gray-600 py-2 text-3xl font-bold mt-2">{set?.name || "Loading..."}</div>
      </div>

      {isError && "Error"}

      <div className="flex flex-col gap-2 mt-48">
        <input
          name="set-name"
          className="border-2  px-2 py-1"
          type="text"
          placeholder="Set the Name"
          onKeyUp={(e) => {
            setSetName(e.currentTarget.value);
          }}
        />
        <button
          onClick={() => {
            if (setName) {
              updateName({
                setId: router.query.setid as string,
                setName: setName,
              });
            }
          }}
        ><p className="bg-gray-400 px-2 py-2 rounded-md text-white">Set Name</p></button>
      </div>
    </div>
  );
};


export default SetPage;



