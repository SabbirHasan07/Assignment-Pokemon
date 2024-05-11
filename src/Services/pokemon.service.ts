import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
export const getAllSets =  async () =>{
  let allSets = await PokemonTCG.getAllSets();
  console.log(allSets)
  return allSets;
}


export const getSetById = async (setid: string ) => {
  let set = await PokemonTCG.findSetByID(setid)
  return set;
}



