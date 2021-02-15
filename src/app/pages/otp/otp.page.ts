import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoadingService } from 'src/app/services/loading.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {

  @ViewChild('first', { static: false }) firstInput: { setFocus: () => void; };
  @ViewChild('second', { static: false }) secondInput: { setFocus: () => void; };
  @ViewChild('third', { static: false }) thirdInput: { setFocus: () => void; };
  @ViewChild('fourth', { static: false }) fourthInput: { setFocus: () => void; };
  @ViewChild('fifth', { static: false }) fifthInput: { setFocus: () => void; };
  @ViewChild('sixth', { static: false }) sixthInput: { setFocus: () => void; };

  countdown = 30;
  reauthentication = false;
  verification = false;

  verificationId: any;

  noHp: any;

  otp: any;
  otp1: any;
  otp2: any;
  otp3: any;
  otp4: any;
  otp5: any;
  otp6: any;

  role: any;

  constructor(
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private _loadingService: LoadingService,
    private _storageService: StorageService,
    private _firebaseService: FirebaseService
  ) {
    if (this._firebaseService.isLoggedIn) {
      this.navController.navigateRoot('/pages/dashboard', { animated: true, animationDirection: 'forward' });
      return;
    } else {
      this.activatedRoute.queryParams.subscribe(param => {
        localStorage.setItem('userRole', param.role);
        this.noHp = param.no_handphone;
        this.verifyPhoneNumber(param.no_handphone);
      });
    }
  }

  async ngOnInit() {
  }

  verifyPhoneNumber(noHp) {
    setTimeout(() => {
      this._loadingService.presentLoading('Mengirim kode OTP...').then(() => {
        this._firebaseService.verifyPhoneNumber(noHp, 30).then((verificationId) => {
          this.verificationId = verificationId;
          this._loadingService.presentToast('Kode OTP telah dikirimkan ke ' + noHp);
          const timer = setInterval(() => {
            if (this.countdown === 0) {
              clearInterval(timer);
              this.reauthentication = true;
              this.countdown = 30;
            } else {
              this.countdown--;
            }
          }, 1000);
        }).catch((err) => {
          this._loadingService.presentAlert('Failed Verification', err);
        }).finally(() => {
          if (this._loadingService.isLoading) {
            this._loadingService.dismissLoading();
          }
        })
      });
    }, 800);
  }

  signInWithCredential() {
    setTimeout(() => {
      this._loadingService.presentLoading('Verifikasi OTP...').then(() => {

        this._firebaseService.signInWithVerificationId(this.verificationId, this.otp).then((res) => {
          this._loadingService.presentToast('Verifikasi Berhasil');
          this.navController.navigateRoot('/pages/dashboard', { animated: true, animationDirection: 'forward' });
        }).catch((err) => {
          this._loadingService.presentToast('Gagal verifikasi. Pastikan kode OTP sudah benar.');
        }).finally(() => {
          if (this._loadingService.isLoading) {
            this._loadingService.dismissLoading();
          }
        })
      });
    }, 800);
  }

  otpChange(order, event) {
    console.log('event: ', event);

    if (event.detail.value === '0' || event.detail.value === '1' || event.detail.value === '2' || event.detail.value === '3'
      || event.detail.value === '4' || event.detail.value === '5' || event.detail.value === '6' || event.detail.value === '7'
      || event.detail.value === '8' || event.detail.value === '9') {
      if (order === 'first') {
        this.secondInput.setFocus();
      }

      if (order === 'second') {
        this.thirdInput.setFocus();
      }

      if (order === 'third') {
        this.fourthInput.setFocus();
      }

      if (order === 'fourth') {
        this.fifthInput.setFocus();
      }

      if (order === 'fifth') {
        this.sixthInput.setFocus();
      }
    }
  }

  processVerification() {
    if (this.otp1 && this.otp2 && this.otp3 && this.otp4 && this.otp5 && this.otp6) {
      this.otp = this.otp1 + this.otp2 + this.otp3 + this.otp4 + this.otp5 + this.otp6;

      if (this.otp.length === 6) {
        this.verification = true;
      } else {
        this.verification = false;
      }
    } else {
      this.verification = false;
      this.otp = undefined;
    }
  }

  checkOtp() {
    setTimeout(() => {
      if (this.otp1 !== undefined && this.otp2 !== undefined && this.otp3 !== undefined && this.otp4 !== undefined && this.otp5 !== undefined && this.otp6 !== undefined) {
        this.otp = this.otp1 + this.otp2 + this.otp3 + this.otp4 + this.otp5 + this.otp6;
        if (this.otp.length === 6) {
          this.signInWithCredential();
        }
      }
    }, 2000);


  }

  changePhoneNo() {
    this.navController.navigateRoot('/auth', { animated: true, animationDirection: 'back' });
  }

}
