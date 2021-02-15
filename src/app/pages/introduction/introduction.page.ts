import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.page.html',
  styleUrls: ['./introduction.page.scss'],
})
export class IntroductionPage implements OnInit {

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  constructor(
    private navCtrl: NavController,
    private _firebaseService: FirebaseService,
    private _loadingService: LoadingService
  ) {
    const isLogin = this._firebaseService.isLoggedIn;

    this._loadingService.presentAlert('Intro', 'isLogin: ' + isLogin);
    if (this._firebaseService.isLoggedIn) {
      this.navCtrl.navigateRoot('/pages/dashboard', { animated: true, animationDirection: 'forward' });
      return;
    }
  }

  ngOnInit() {
  }

  start() {
    this.navCtrl.navigateRoot('/auth', { animated: true, animationDirection: 'forward' });
  }

}
