import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    isLoading = false;
    isToast = false;

    appVersion: any;

    constructor(
        private loadingController: LoadingController,
        private toastController: ToastController,
        private alertController: AlertController
    ) {
    }

    async presentLoading(msg) {
        this.isLoading = true;
        return await this.loadingController.create({
            message: msg,
            duration: 60000,
            animated: true
        }).then(a => {
            a.present().then(() => {
                if (!this.isLoading) {
                    a.dismiss(); // .then(() => console.log('abort presenting'));
                }
            });
        });
    }

    async dismissLoading() {
        this.isLoading = false;
        return await this.loadingController.dismiss().then(() => console.log(''));
    }

    async presentToast(msg, pos?: 'top' | 'bottom' | 'middle') {
        this.isToast = true;
        const toast = await this.toastController.create({
            message: msg,
            position: pos,
            duration: 3000,
            animated: true
        });
        toast.present();
    }

    async presentToastWithOptions(msg, pos?: 'top' | 'bottom' | 'middle') {
        this.isToast = true;
        const toast = await this.toastController.create({
            message: msg,
            position: pos,
            animated: true
        });
        toast.present();
    }

    async dismissToast() {
        this.isToast = false;
        return await this.toastController.dismiss().then(() => console.log(''));
    }

    async presentAlert(head, msg) {
        const alert = await this.alertController.create({
            header: head,
            message: msg,
            buttons: ['Close']
        });

        await alert.present();
    }
}
