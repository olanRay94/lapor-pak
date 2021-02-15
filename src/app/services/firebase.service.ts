import { Injectable } from '@angular/core';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { LoadingService } from './loading.service';
import { StorageService } from './storage.service';
@Injectable({
    providedIn: 'root'
})
export class FirebaseService {

    isLoggedIn = false;
    userInfo: any;
    userRole: any;

    constructor(
        private firebaseX: FirebaseX,
        private navCtrl: NavController,
        private _storageService: StorageService,
        private _loadingService: LoadingService,
        private firebaseAuthentication: FirebaseAuthentication
    ) {
        this.firebaseAuthentication.onAuthStateChanged().subscribe(userInfo => {
            console.log('firebaseService userInfo: ', userInfo);
            if (userInfo) {
                this.userInfo = userInfo;
                this.isLoggedIn = true;
            } else {
                this.userInfo = null;
                this.isLoggedIn = false;
            }
        })
        // this.firebaseX.setAnalyticsCollectionEnabled(true);
    }



    /**
     *
     * @param name set screen view name for analytics
     */
    setScreenName(name) {
        this.firebaseX.setScreenName(name);
    }

    signOut() {
        return new Promise<any>(async (resolve, reject) => {
            await this.firebaseAuthentication.signOut();
            await this._storageService.clearStorageData().then(() => {
                this.navCtrl.navigateRoot('/auth', { animated: true, animationDirection: 'forward' });
                resolve(true);
            }).catch((err) => {
                reject(false);
            });
        });
    }

    verifyPhoneNumber(phoneNo, duration) {
        return new Promise<any>(async (resolve, reject) => {
            this.firebaseAuthentication.verifyPhoneNumber(phoneNo, duration).then((credential) => {
                resolve(credential);
            }).catch((err) => {
                reject(err);
            })
        });
    }

    signInWithVerificationId(verificationId, code) {
        return new Promise<any>(async (resolve, reject) => {
            this.firebaseAuthentication.signInWithVerificationId(verificationId, code).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    }


}
