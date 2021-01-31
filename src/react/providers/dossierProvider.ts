import httpService from '../services/httpService';
import { Dossier } from '../redux/initialState';
import { httpActions } from '../constants/enums';
import { AngularBridge } from '../services/angularBridge';

interface DossierProvider {
  closeDossier: (callback: (x: any) => void, error: (x: any) => void) => void;
  getDossierInfo: (callback: (x: any, ownDossier: boolean) => void, error: (x: any) => void) => void;
  updateDossierInfo: (dossier: Dossier, callback: (x: number) => void, error: (x: any) => void) => void;
}

const dossierProvider: DossierProvider = {
  getDossierInfo(callback: (x: any, ownDossier: boolean) => void, error: (x: any) => void) {
    AngularBridge.getDossier()
                .then(dossier=>{
                  callback(dossier, true);
                })
                .catch(error);
  },
  async updateDossierInfo(dossier: Dossier, callback: (x: any) => void, error: (x: any) => void) {
    try{
      const { account, myConnection, myPartner, myPerson, specialist } = dossier;
      await AngularBridge.saveUser(account);
      await AngularBridge.saveDossier({myConnection, myPartner, myPerson, specialist})
      callback(true);
    } catch(e){
      error(e.toString())
    }
    
  },
  closeDossier(callback: (x: any) => void, err: (x: any) => void) {
    httpService.get('', { action: httpActions.CLOSE_DOSSIER }, callback, err);
  }
};

export default dossierProvider;
