import { Dossier } from "../redux/initialState";
import { Account } from "../redux/types";

const USER_DATA = 'user_data';
const DOSSIER_DATA = 'dossier_data';

export const AngularBridge = {
    getStorage(key: string, defaultValue = ''){
        return localStorage.getItem(key) || defaultValue;
    },
    setStorage(key: string, value?: string){
        if(value){
            localStorage.setItem(key, value);
        } else {
            localStorage.removeItem(key);
        }
    },
    hasUserData(){
        return this.getStorage(USER_DATA);
    },
    hasDossierData(){
        return this.getStorage(DOSSIER_DATA);
    },
    async getUser(){
        const cache = this.getStorage(USER_DATA);
        return cache ? JSON.parse(cache) : null;
    },
    async saveUser(user?:Account) {
        this.setStorage(USER_DATA, user ? JSON.stringify(user) : user)
        return user;
    },
    async getDossier(){
        const cache = this.getStorage(DOSSIER_DATA);
        const dossier: Dossier = cache ? JSON.parse(cache) : {};
        return dossier;
    },
    async saveDossier(data?: any){
        this.setStorage(DOSSIER_DATA, data ? JSON.stringify(data) : data);
        return data;
    }
}
