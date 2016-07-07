import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Rx';

import {AuthenticationService, AuthenticationState} from '../../services/authentication.service';
import {TaskListService} from '../../services/taskList.service';

const TASKLIST_ROUTE: string = '/list';

@Component({
  selector: 'homepage',
  template: require('./homepage.component.html'),
  styles: [require('./homepage.component.css')],
  providers: [TaskListService]
})

/**
 * AppComponent serves as main component that holds base components.
 */
export class HomepageComponent implements OnInit {
  // Copy of AuthenticationState to use in HTML.
  private authenticationStateReference = AuthenticationState;  // tslint:disable-line
  private loggedIn: AuthenticationState = AuthenticationState.Unknown;
  private loginSubscription: Subscription;

  constructor(
      private router: Router,
      private taskListService: TaskListService,
      private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.loginSubscription =
        this.authenticationService.loginState$.subscribe((state) => { this.loggedIn = state; });
  }

  ngOnDestroy() { this.loginSubscription.unsubscribe(); }

  getListId() {
    let id = this.taskListService.getNewTaskListId(this.authenticationService.getUid());
    this.router.navigate([TASKLIST_ROUTE, id]);
  }

  login() { this.authenticationService.login(); }

  logout() { this.authenticationService.logout(); }
}
