import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Sim } from '@ionic-native/sim/ngx';
import { NavController, Platform } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  form: FormGroup;
  phone: FormControl;

  regex = '^(^\+62)(\d{3,4}-?){2}\d{3,4}$';

  constructor(
    private fb: FormBuilder,
    private sim: Sim,
    private androidPermissions: AndroidPermissions,
    private platform: Platform,
    private navController: NavController,
    private _firebaseService: FirebaseService,
    private _loadingService: LoadingService
  ) {
    if (this._firebaseService.isLoggedIn) {
      this.navController.navigateRoot('/pages/dashboard', { animated: true, animationDirection: 'forward' });
      return;
    } else {
      this.initData();
    }
  }

  readSim() {
    this.sim.hasReadPermission().then((info) => {
      console.log('sim has read permission: ', info);
      this.sim.getSimInfo().then((simInfo) => {
        console.log('sim info: ', simInfo);
      });
    }).catch((err) => {
      console.log('sim does not have read permission: ', err);
      this.sim.requestReadPermission().then((result) => {
        console.log('sim request read permission granted: ', result);
        this.sim.getSimInfo().then((simInfo) => {
          console.log('sim info: ', simInfo);
        });
      }).catch((er) => {
        console.log('sim request read permission rejected: ', er);
      });
    });
  }

  async ngOnInit() {
  }

  initData() {
    this.phone = new FormControl('', [Validators.required]);

    this.form = this.fb.group({
      phone: this.phone
    });

    this.platform.ready().then(() => {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE).then((res) => {
        console.log('androidPermissions checkPermission: ', res);

        if (res.hasPermission === false) {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE).then((result) => {
            console.log('androidPermissions requestPermissions: ', result);
            this.readSim();
          }).catch(() => {
            console.log('androidPermission requestPermission rejected');
          });
        } else {
          this.readSim();
        }
      }).catch(() => {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE).then((result) => {
          console.log('androidPermissions requestPermissions: ', result);
          this.readSim();
        }).catch(() => {
          console.log('androidPermission requestPermission rejected');
        });
      })

    });
  }

  login(item) {
    const param = {
      role: item,
      no_handphone: this.phone.value
    }
    this.navController.navigateRoot('/otp', { queryParams: param });
  }

}
