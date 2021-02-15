import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { NavController } from '@ionic/angular';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { FirebaseService } from '../services/firebase.service';
import { LoadingService } from '../services/loading.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    signed: any;
    role: any;

    constructor(
        private navCtrl: NavController,
        private _storageService: StorageService,
        private _firebaseService: FirebaseService,
        private _loadingService: LoadingService
    ) { }

    async canActivate() {
        this.role = await localStorage.getItem('userRole');

        if (this._firebaseService.isLoggedIn) {
            this.signed = true;
        } else {
            this.signed = false;
        }

        this._loadingService.presentAlert('Auth Guard', 'role: ' + this.role + '<br>signed: ' + this.signed);

        if (this.signed == true && this.role !== undefined && this.role !== null) {
            return true;
        } else {
            this._firebaseService.signOut();
            return false;
        }
    }
}
