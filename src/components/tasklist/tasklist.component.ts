import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {Subscription} from 'rxjs/Rx';

import {AuthenticationService} from '../../services/authentication.service';
import {TaskItem} from '../../services/taskItem';
import {TaskListService} from '../../services/taskList.service';
import {AddTaskComponent} from '../addTask/addTask.component';

@Component({
  selector: 'task-list',
  template: require('./taskList.component.html'),
  styles: [require('./taskList.component.css')],
  directives: [AddTaskComponent as any],
  providers: [TaskListService]
})

/**
 * TaskListComponent renders the table containing a list of TaskItems.
 */
export class TaskListComponent implements OnInit {
  private isInputFocused: boolean;
  private id: string;
  private canEdit: boolean;

  private taskListName: FirebaseObjectObservable<any>;
  private tasks: FirebaseListObservable<any[]>;
  private taskListOwnerSub: Subscription;

  // TODO get rid of this and have editListName take an argument.
  private listName: string;

  constructor(
      private route: ActivatedRoute,
      private authenticationService: AuthenticationService,
      private taskListService: TaskListService) {}

  ngOnInit() {
    this.isInputFocused = false;
    this.id = this.route.snapshot.params['id'];

    this.taskListName = this.taskListService.getTaskListName(this.id);
    this.tasks = this.taskListService.getTasks(this.id);
    let taskListOwner = this.taskListService.getOwner(this.id);

    this.taskListOwnerSub = taskListOwner.subscribe((owner) => {
      // TODO this is a race condition. Need to ensure authentication status is resolved.
      this.canEdit = owner.$value === this.authenticationService.getUserId();
    });
  }

  ngOnDestroy() { this.taskListOwnerSub.unsubscribe(); }

  /**
   * @param task
   */
  addTask(task: TaskItem) { this.tasks.push(task); }

  /**
   *
   * @param taskId
   */
  removeTask(taskId: string) { this.tasks.remove(taskId); }

  markTaskVisited(taskId: string) { this.tasks.update(taskId, {visited: true}); }

  editListName() {
    this.isInputFocused = !this.isInputFocused;
    this.taskListName.set(this.listName);
  }
}