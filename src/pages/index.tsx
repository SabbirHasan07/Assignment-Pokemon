
import { Set, getAllSets } from "pokemon-tcg-sdk-typescript/dist/sdk";
import Image from "next/image"
import { GetStaticProps } from "next";
import { DehydratedState, QueryClient, dehydrate } from "@tanstack/react-query";
import { QueryKeys } from "@/Services/enums";
import { useSets } from "@/Services/Hooks";
import { SparklesPreview } from "@/Components/Elements/SparklesPreview";
import Body from "@/Components/Body/Body";


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
const Home = (props: { serverSets: Set[] }) => {
  const { data: sets, isLoading, isError } = useSets();
  return (
    <div>
      
      <div className="m-2"> <Body /></div>
      <div className="px-3 lg:grid lg:grid-cols-4">
        {isLoading && "Loading...."}
        {sets?.map((set) => {
          return (
            <div key={set.id} className="group flex px-3 flex-col border-2 h-60 w-80 m-2 p-4 rounded-md shadow-md cursor-pointer relative">
              <div className="relative w-full h-full mb-4">
                <Image src={set?.images.logo || ""} fill alt="set logo" className="object-contain group-hover:scale-105 transition duration-300 ease-in-out"></Image>
              </div>
              <div className="text-center text-xl font-bold">{set?.name || "loading...."}</div>
              <div className="absolute flex justify-center items-center opacity-0 top-0 bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent group-hover:opacity-100 transition duration-300 ease-in-out">
                <button  className="px-4 py-1 rounded-[20px] bg-orange-500 text-white scale-125 group-hover:scale-100 duration-300 ease-in-out transform opacity-0 group-hover:opacity-100 ">Quick View</button>
              </div>
            </div>
          );

        })}
        {isError && "Error"}
      </div>
      
    </div>
  );

}
export default Home;