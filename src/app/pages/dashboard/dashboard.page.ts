import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(
    private _firebaseService: FirebaseService,
    private _loadingService: LoadingService
  ) { }

  ngOnInit() {
  }

  signOut() {
    this._firebaseService.signOut().then(() => {
      this._loadingService.presentToast('Anda berhasil keluar');
    });
  }

}
