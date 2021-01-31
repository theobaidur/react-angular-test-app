import { Dossier } from "../redux/initialState";

export function getLastNames( state: Dossier ){
    const lastNames : string[] = [];
    state.myPerson && lastNames.push(state.myPerson.lastName);
    state.myPartner && lastNames.push(state.myPartner.lastName);
    /*state.myConnection && state.myConnection.children && 
    state.myConnection.children.forEach((c:Child) => {
        c.lastName && lastNames.push( c.lastName );
    })*/
    return Array.from(new Set(lastNames));
}