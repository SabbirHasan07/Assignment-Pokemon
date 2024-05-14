import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
export const getAllSets =  async () =>{
  let allSets = await PokemonTCG.getAllSets();
  console.log(allSets)
  return allSets;
}


export const getSetById = async (setId: string ) => {
  let set = await PokemonTCG.findSetByID(setId)
  return set;
}

export const editSetName = async (setId: string, setName: string) => {
   return new Promise((resolve, reject) => {
     resolve("set edited");
   });
 };

