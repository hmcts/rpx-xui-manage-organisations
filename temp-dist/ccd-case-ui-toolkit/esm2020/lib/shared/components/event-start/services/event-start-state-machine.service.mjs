import { Injectable } from '@angular/core';
import { StateMachine } from '@edium/fsm';
import { EventStartStates } from '../models';
import * as i0 from "@angular/core";
const EVENT_STATE_MACHINE = 'EVENT STATE MACHINE';
export class EventStartStateMachineService {
    initialiseStateMachine(context) {
        return new StateMachine(EVENT_STATE_MACHINE, context);
    }
    createStates(stateMachine) {
        // Initial state
        this.stateCheckForMatchingTasks = stateMachine.createState(EventStartStates.CHECK_FOR_MATCHING_TASKS, false, this.entryActionForStateCheckForMatchingTasks);
        // States based on number of tasks available
        this.stateNoTask = stateMachine.createState(EventStartStates.NO_TASK, false, this.entryActionForStateNoTask);
        this.stateOneOrMoreTasks = stateMachine.createState(EventStartStates.ONE_OR_MORE_TASKS, false, this.entryActionForStateOneOrMoreTasks);
        // States based on number of tasks assigned to user
        this.stateTaskUnassigned = stateMachine.createState(EventStartStates.TASK_UNASSIGNED, false, this.entryActionForStateTaskUnAssigned);
        this.stateTaskAssignedToUser = stateMachine.createState(EventStartStates.TASK_ASSIGNED_TO_USER, false, this.entryActionForStateTaskAssignedToUser);
        this.stateOneTaskAssignedToUser = stateMachine.createState(EventStartStates.ONE_TASK_ASSIGNED_TO_USER, false, this.entryActionForStateOneTaskAssignedToUser);
        this.stateMultipleTasksAssignedToUser = stateMachine.createState(EventStartStates.MULTIPLE_TASKS_ASSIGNED_TO_USER, false, this.entryActionForStateMultipleTasksAssignedToUser);
        // Create final state, the second param isComplete is set to true to make sure state machine finished running
        this.stateFinal = stateMachine.createState(EventStartStates.FINAL, true, this.finalAction);
    }
    addTransitions() {
        // Initial transition
        this.addTransitionsForStateCheckForMatchingTasks();
        // Transitions based on number of tasks available
        this.addTransitionsForStateNoTask();
        this.addTransitionsForStateOneOrMoreTasks();
        // Transitions based on number of tasks assigned to user
        this.addTransitionsForStateTaskUnassigned();
        this.addTransitionsForStateTaskAssignedToUser();
        this.addTransitionsForStateOneTaskAssignedToUser();
        this.addTransitionsForStateMultipleTasksAssignedToUser();
    }
    startStateMachine(stateMachine) {
        stateMachine.start(this.stateCheckForMatchingTasks);
    }
    /**
     * Initial entry action for state check for matching tasks, decided based on the number of tasks
     */
    entryActionForStateCheckForMatchingTasks(state, context) {
        const taskCount = context && context.tasks ? context.tasks.length : 0;
        if (taskCount === 0) {
            // Trigger state no task
            state.trigger(EventStartStates.NO_TASK);
        }
        else {
            // Trigger state one or more tasks
            state.trigger(EventStartStates.ONE_OR_MORE_TASKS);
        }
    }
    entryActionForStateNoTask(state, context) {
        // Trigger final state to complete processing of state machine
        state.trigger(EventStartStates.FINAL);
        // Navigate to no tasks available error page
        context.router.navigate([`/cases/case-details/${context.caseId}/no-tasks-available`], { relativeTo: context.route });
    }
    entryActionForStateOneOrMoreTasks(state, context) {
        state.trigger(EventStartStates.TASK_ASSIGNED_TO_USER);
    }
    entryActionForStateMultipleTasks(state, context) {
        state.trigger(EventStartStates.MULTIPLE_TASKS_ASSIGNED_TO_USER);
    }
    entryActionForStateTaskAssignedToUser(state, context) {
        // Get number of tasks assigned to user
        const userInfoStr = context.sessionStorageService.getItem('userDetails');
        const userInfo = JSON.parse(userInfoStr);
        const tasksAssignedToUser = context.tasks.filter(x => x.task_state !== 'unassigned' && x.assignee === userInfo.id || x.assignee === userInfo.uid);
        // Check if user initiated the event from task tab
        const isEventInitiatedFromTaskTab = context.taskId !== undefined && tasksAssignedToUser.findIndex(x => x.id === context.taskId) > -1;
        if (isEventInitiatedFromTaskTab) {
            // User initiated event from task tab
            state.trigger(EventStartStates.ONE_TASK_ASSIGNED_TO_USER);
        }
        else {
            // User initiated event from dropdown
            switch (tasksAssignedToUser.length) {
                case 0:
                    // No tasks assigned to user, trigger state task unassigned
                    state.trigger(EventStartStates.TASK_UNASSIGNED);
                    break;
                case 1:
                    // One task assigned to user
                    state.trigger(EventStartStates.ONE_TASK_ASSIGNED_TO_USER);
                    break;
                default:
                    // Multiple tasks assigned to user, trigger state multiple tasks assigned to user
                    state.trigger(EventStartStates.MULTIPLE_TASKS_ASSIGNED_TO_USER);
                    break;
            }
        }
    }
    entryActionForStateTaskUnAssigned(state, context) {
        let navigationURL = '';
        let theQueryParams = {};
        if (context.tasks[0].assignee) {
            // Task is assigned to some other user, navigate to task assigned error page
            navigationURL = `/cases/case-details/${context.caseId}/task-assigned`;
            theQueryParams = context.tasks[0];
        }
        else {
            // Task is unassigned, navigate to task unassigned error page
            navigationURL = `/cases/case-details/${context.caseId}/task-unassigned`;
        }
        // Trigger final state to complete processing of state machine
        state.trigger(EventStartStates.FINAL);
        // Navigate
        context.router.navigate([`${navigationURL}`], { queryParams: theQueryParams, relativeTo: context.route });
    }
    entryActionForStateOneTaskAssignedToUser(state, context) {
        // Trigger final state to complete processing of state machine
        state.trigger(EventStartStates.FINAL);
        // Get task assigned to user
        let task = context.tasks.find(x => x.id === context.taskId);
        if (!task) {
            task = context.tasks[0];
        }
        // Store task to session
        context.sessionStorageService.setItem('taskToComplete', JSON.stringify(task));
        // Allow user to perform the event
        context.router.navigate([`/cases/case-details/${context.caseId}/trigger/${context.eventId}`], { queryParams: { isComplete: true }, relativeTo: context.route });
    }
    entryActionForStateMultipleTasksAssignedToUser(state, context) {
        // Trigger final state to complete processing of state machine
        state.trigger(EventStartStates.FINAL);
        // Navigate to multiple tasks exist error page
        context.router.navigate([`/cases/case-details/${context.caseId}/multiple-tasks-exist`], { relativeTo: context.route });
    }
    finalAction(state) {
        // Final actions can be performed here, the state machine finished running
        // console.log('FINAL', state);
        return;
    }
    addTransitionsForStateCheckForMatchingTasks() {
        // No tasks
        this.stateCheckForMatchingTasks.addTransition(EventStartStates.NO_TASK, this.stateNoTask);
        // One task
        this.stateCheckForMatchingTasks.addTransition(EventStartStates.ONE_OR_MORE_TASKS, this.stateOneOrMoreTasks);
    }
    addTransitionsForStateNoTask() {
        this.stateNoTask.addTransition(EventStartStates.FINAL, this.stateFinal);
    }
    addTransitionsForStateOneOrMoreTasks() {
        this.stateOneOrMoreTasks.addTransition(EventStartStates.TASK_ASSIGNED_TO_USER, this.stateTaskAssignedToUser);
    }
    addTransitionsForStateTaskUnassigned() {
        this.stateTaskUnassigned.addTransition(EventStartStates.FINAL, this.stateFinal);
    }
    addTransitionsForStateTaskAssignedToUser() {
        this.stateTaskAssignedToUser.addTransition(EventStartStates.ONE_TASK_ASSIGNED_TO_USER, this.stateOneTaskAssignedToUser);
        this.stateTaskAssignedToUser.addTransition(EventStartStates.TASK_UNASSIGNED, this.stateTaskUnassigned);
        this.stateTaskAssignedToUser.addTransition(EventStartStates.MULTIPLE_TASKS_ASSIGNED_TO_USER, this.stateMultipleTasksAssignedToUser);
        this.stateTaskAssignedToUser.addTransition(EventStartStates.FINAL, this.stateFinal);
    }
    addTransitionsForStateOneTaskAssignedToUser() {
        this.stateOneTaskAssignedToUser.addTransition(EventStartStates.FINAL, this.stateFinal);
    }
    addTransitionsForStateMultipleTasksAssignedToUser() {
        this.stateMultipleTasksAssignedToUser.addTransition(EventStartStates.FINAL, this.stateFinal);
    }
}
EventStartStateMachineService.ɵfac = function EventStartStateMachineService_Factory(t) { return new (t || EventStartStateMachineService)(); };
EventStartStateMachineService.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: EventStartStateMachineService, factory: EventStartStateMachineService.ɵfac });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(EventStartStateMachineService, [{
        type: Injectable
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtc3RhcnQtc3RhdGUtbWFjaGluZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY2NkLWNhc2UtdWktdG9vbGtpdC9zcmMvbGliL3NoYXJlZC9jb21wb25lbnRzL2V2ZW50LXN0YXJ0L3NlcnZpY2VzL2V2ZW50LXN0YXJ0LXN0YXRlLW1hY2hpbmUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBUyxZQUFZLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDakQsT0FBTyxFQUFpQyxnQkFBZ0IsRUFBRSxNQUFNLFdBQVcsQ0FBQzs7QUFFNUUsTUFBTSxtQkFBbUIsR0FBRyxxQkFBcUIsQ0FBQztBQUdsRCxNQUFNLE9BQU8sNkJBQTZCO0lBV2pDLHNCQUFzQixDQUFDLE9BQXNDO1FBQ2xFLE9BQU8sSUFBSSxZQUFZLENBQUMsbUJBQW1CLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVNLFlBQVksQ0FBQyxZQUEwQjtRQUM1QyxnQkFBZ0I7UUFDaEIsSUFBSSxDQUFDLDBCQUEwQixHQUFHLFlBQVksQ0FBQyxXQUFXLENBQ3hELGdCQUFnQixDQUFDLHdCQUF3QixFQUN6QyxLQUFLLEVBQ0wsSUFBSSxDQUFDLHdDQUF3QyxDQUM5QyxDQUFDO1FBRUYsNENBQTRDO1FBQzVDLElBQUksQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDLFdBQVcsQ0FDekMsZ0JBQWdCLENBQUMsT0FBTyxFQUN4QixLQUFLLEVBQ0wsSUFBSSxDQUFDLHlCQUF5QixDQUMvQixDQUFDO1FBQ0YsSUFBSSxDQUFDLG1CQUFtQixHQUFHLFlBQVksQ0FBQyxXQUFXLENBQ2pELGdCQUFnQixDQUFDLGlCQUFpQixFQUNsQyxLQUFLLEVBQ0wsSUFBSSxDQUFDLGlDQUFpQyxDQUN2QyxDQUFDO1FB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QTZCLFdBQTdCLDZCQUE2Qjt1RkFBN0IsNkJBQTZCO2NBRHpDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQYXJhbXMgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgU3RhdGUsIFN0YXRlTWFjaGluZSB9IGZyb20gJ0BlZGl1bS9mc20nO1xuaW1wb3J0IHsgRXZlbnRTdGFydFN0YXRlTWFjaGluZUNvbnRleHQsIEV2ZW50U3RhcnRTdGF0ZXMgfSBmcm9tICcuLi9tb2RlbHMnO1xuXG5jb25zdCBFVkVOVF9TVEFURV9NQUNISU5FID0gJ0VWRU5UIFNUQVRFIE1BQ0hJTkUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRXZlbnRTdGFydFN0YXRlTWFjaGluZVNlcnZpY2Uge1xuICBwdWJsaWMgc3RhdGVDaGVja0Zvck1hdGNoaW5nVGFza3M6IFN0YXRlO1xuICBwdWJsaWMgc3RhdGVOb1Rhc2s6IFN0YXRlO1xuICBwdWJsaWMgc3RhdGVPbmVUYXNrOiBTdGF0ZTtcbiAgcHVibGljIHN0YXRlT25lT3JNb3JlVGFza3M6IFN0YXRlO1xuICBwdWJsaWMgc3RhdGVUYXNrQXNzaWduZWRUb1VzZXI6IFN0YXRlO1xuICBwdWJsaWMgc3RhdGVPbmVUYXNrQXNzaWduZWRUb1VzZXI6IFN0YXRlO1xuICBwdWJsaWMgc3RhdGVNdWx0aXBsZVRhc2tzQXNzaWduZWRUb1VzZXI6IFN0YXRlO1xuICBwdWJsaWMgc3RhdGVUYXNrVW5hc3NpZ25lZDogU3RhdGU7XG4gIHB1YmxpYyBzdGF0ZUZpbmFsOiBTdGF0ZTtcblxuICBwdWJsaWMgaW5pdGlhbGlzZVN0YXRlTWFjaGluZShjb250ZXh0OiBFdmVudFN0YXJ0U3RhdGVNYWNoaW5lQ29udGV4dCk6IFN0YXRlTWFjaGluZSB7XG4gICAgcmV0dXJuIG5ldyBTdGF0ZU1hY2hpbmUoRVZFTlRfU1RBVEVfTUFDSElORSwgY29udGV4dCk7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlU3RhdGVzKHN0YXRlTWFjaGluZTogU3RhdGVNYWNoaW5lKTogdm9pZCB7XG4gICAgLy8gSW5pdGlhbCBzdGF0ZVxuICAgIHRoaXMuc3RhdGVDaGVja0Zvck1hdGNoaW5nVGFza3MgPSBzdGF0ZU1hY2hpbmUuY3JlYXRlU3RhdGUoXG4gICAgICBFdmVudFN0YXJ0U3RhdGVzLkNIRUNLX0ZPUl9NQVRDSElOR19UQVNLUyxcbiAgICAgIGZhbHNlLFxuICAgICAgdGhpcy5lbnRyeUFjdGlvbkZvclN0YXRlQ2hlY2tGb3JNYXRjaGluZ1Rhc2tzXG4gICAgKTtcblxuICAgIC8vIFN0YXRlcyBiYXNlZCBvbiBudW1iZXIgb2YgdGFza3MgYXZhaWxhYmxlXG4gICAgdGhpcy5zdGF0ZU5vVGFzayA9IHN0YXRlTWFjaGluZS5jcmVhdGVTdGF0ZShcbiAgICAgIEV2ZW50U3RhcnRTdGF0ZXMuTk9fVEFTSyxcbiAgICAgIGZhbHNlLFxuICAgICAgdGhpcy5lbnRyeUFjdGlvbkZvclN0YXRlTm9UYXNrXG4gICAgKTtcbiAgICB0aGlzLnN0YXRlT25lT3JNb3JlVGFza3MgPSBzdGF0ZU1hY2hpbmUuY3JlYXRlU3RhdGUoXG4gICAgICBFdmVudFN0YXJ0U3RhdGVzLk9ORV9PUl9NT1JFX1RBU0tTLFxuICAgICAgZmFsc2UsXG4gICAgICB0aGlzLmVudHJ5QWN0aW9uRm9yU3RhdGVPbmVPck1vcmVUYXNrc1xuICAgICk7XG5cbiAgICAvLyBTdGF0ZXMgYmFzZWQgb24gbnVtYmVyIG9mIHRhc2tzIGFzc2lnbmVkIHRvIHVzZXJcbiAgICB0aGlzLnN0YXRlVGFza1VuYXNzaWduZWQgPSBzdGF0ZU1hY2hpbmUuY3JlYXRlU3RhdGUoXG4gICAgICBFdmVudFN0YXJ0U3RhdGVzLlRBU0tfVU5BU1NJR05FRCxcbiAgICAgIGZhbHNlLFxuICAgICAgdGhpcy5lbnRyeUFjdGlvbkZvclN0YXRlVGFza1VuQXNzaWduZWRcbiAgICApO1xuICAgIHRoaXMuc3RhdGVUYXNrQXNzaWduZWRUb1VzZXIgPSBzdGF0ZU1hY2hpbmUuY3JlYXRlU3RhdGUoXG4gICAgICBFdmVudFN0YXJ0U3RhdGVzLlRBU0tfQVNTSUdORURfVE9fVVNFUixcbiAgICAgIGZhbHNlLFxuICAgICAgdGhpcy5lbnRyeUFjdGlvbkZvclN0YXRlVGFza0Fzc2lnbmVkVG9Vc2VyXG4gICAgKTtcbiAgICB0aGlzLnN0YXRlT25lVGFza0Fzc2lnbmVkVG9Vc2VyID0gc3RhdGVNYWNoaW5lLmNyZWF0ZVN0YXRlKFxuICAgICAgRXZlbnRTdGFydFN0YXRlcy5PTkVfVEFTS19BU1NJR05FRF9UT19VU0VSLFxuICAgICAgZmFsc2UsXG4gICAgICB0aGlzLmVudHJ5QWN0aW9uRm9yU3RhdGVPbmVUYXNrQXNzaWduZWRUb1VzZXJcbiAgICApO1xuICAgIHRoaXMuc3RhdGVNdWx0aXBsZVRhc2tzQXNzaWduZWRUb1VzZXIgPSBzdGF0ZU1hY2hpbmUuY3JlYXRlU3RhdGUoXG4gICAgICBFdmVudFN0YXJ0U3RhdGVzLk1VTFRJUExFX1RBU0tTX0FTU0lHTkVEX1RPX1VTRVIsXG4gICAgICBmYWxzZSxcbiAgICAgIHRoaXMuZW50cnlBY3Rpb25Gb3JTdGF0ZU11bHRpcGxlVGFza3NBc3NpZ25lZFRvVXNlclxuICAgICk7XG5cbiAgICAvLyBDcmVhdGUgZmluYWwgc3RhdGUsIHRoZSBzZWNvbmQgcGFyYW0gaXNDb21wbGV0ZSBpcyBzZXQgdG8gdHJ1ZSB0byBtYWtlIHN1cmUgc3RhdGUgbWFjaGluZSBmaW5pc2hlZCBydW5uaW5nXG4gICAgdGhpcy5zdGF0ZUZpbmFsID0gc3RhdGVNYWNoaW5lLmNyZWF0ZVN0YXRlKFxuICAgICAgRXZlbnRTdGFydFN0YXRlcy5GSU5BTCxcbiAgICAgIHRydWUsXG4gICAgICB0aGlzLmZpbmFsQWN0aW9uXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUcmFuc2l0aW9ucygpOiB2b2lkIHtcbiAgICAvLyBJbml0aWFsIHRyYW5zaXRpb25cbiAgICB0aGlzLmFkZFRyYW5zaXRpb25zRm9yU3RhdGVDaGVja0Zvck1hdGNoaW5nVGFza3MoKTtcblxuICAgIC8vIFRyYW5zaXRpb25zIGJhc2VkIG9uIG51bWJlciBvZiB0YXNrcyBhdmFpbGFibGVcbiAgICB0aGlzLmFkZFRyYW5zaXRpb25zRm9yU3RhdGVOb1Rhc2soKTtcbiAgICB0aGlzLmFkZFRyYW5zaXRpb25zRm9yU3RhdGVPbmVPck1vcmVUYXNrcygpO1xuXG4gICAgLy8gVHJhbnNpdGlvbnMgYmFzZWQgb24gbnVtYmVyIG9mIHRhc2tzIGFzc2lnbmVkIHRvIHVzZXJcbiAgICB0aGlzLmFkZFRyYW5zaXRpb25zRm9yU3RhdGVUYXNrVW5hc3NpZ25lZCgpO1xuICAgIHRoaXMuYWRkVHJhbnNpdGlvbnNGb3JTdGF0ZVRhc2tBc3NpZ25lZFRvVXNlcigpO1xuICAgIHRoaXMuYWRkVHJhbnNpdGlvbnNGb3JTdGF0ZU9uZVRhc2tBc3NpZ25lZFRvVXNlcigpO1xuICAgIHRoaXMuYWRkVHJhbnNpdGlvbnNGb3JTdGF0ZU11bHRpcGxlVGFza3NBc3NpZ25lZFRvVXNlcigpO1xuICB9XG5cbiAgcHVibGljIHN0YXJ0U3RhdGVNYWNoaW5lKHN0YXRlTWFjaGluZTogU3RhdGVNYWNoaW5lKTogdm9pZCB7XG4gICAgc3RhdGVNYWNoaW5lLnN0YXJ0KHRoaXMuc3RhdGVDaGVja0Zvck1hdGNoaW5nVGFza3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWwgZW50cnkgYWN0aW9uIGZvciBzdGF0ZSBjaGVjayBmb3IgbWF0Y2hpbmcgdGFza3MsIGRlY2lkZWQgYmFzZWQgb24gdGhlIG51bWJlciBvZiB0YXNrc1xuICAgKi9cbiAgcHVibGljIGVudHJ5QWN0aW9uRm9yU3RhdGVDaGVja0Zvck1hdGNoaW5nVGFza3Moc3RhdGU6IFN0YXRlLCBjb250ZXh0OiBFdmVudFN0YXJ0U3RhdGVNYWNoaW5lQ29udGV4dCk6IHZvaWQge1xuICAgIGNvbnN0IHRhc2tDb3VudCA9IGNvbnRleHQgJiYgY29udGV4dC50YXNrcyA/IGNvbnRleHQudGFza3MubGVuZ3RoIDogMDtcblxuICAgIGlmICh0YXNrQ291bnQgPT09IDApIHtcbiAgICAgIC8vIFRyaWdnZXIgc3RhdGUgbm8gdGFza1xuICAgICAgc3RhdGUudHJpZ2dlcihFdmVudFN0YXJ0U3RhdGVzLk5PX1RBU0spO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUcmlnZ2VyIHN0YXRlIG9uZSBvciBtb3JlIHRhc2tzXG4gICAgICBzdGF0ZS50cmlnZ2VyKEV2ZW50U3RhcnRTdGF0ZXMuT05FX09SX01PUkVfVEFTS1MpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBlbnRyeUFjdGlvbkZvclN0YXRlTm9UYXNrKHN0YXRlOiBTdGF0ZSwgY29udGV4dDogRXZlbnRTdGFydFN0YXRlTWFjaGluZUNvbnRleHQpOiB2b2lkIHtcbiAgICAvLyBUcmlnZ2VyIGZpbmFsIHN0YXRlIHRvIGNvbXBsZXRlIHByb2Nlc3Npbmcgb2Ygc3RhdGUgbWFjaGluZVxuICAgIHN0YXRlLnRyaWdnZXIoRXZlbnRTdGFydFN0YXRlcy5GSU5BTCk7XG4gICAgLy8gTmF2aWdhdGUgdG8gbm8gdGFza3MgYXZhaWxhYmxlIGVycm9yIHBhZ2VcbiAgICBjb250ZXh0LnJvdXRlci5uYXZpZ2F0ZShbYC9jYXNlcy9jYXNlLWRldGFpbHMvJHtjb250ZXh0LmNhc2VJZH0vbm8tdGFza3MtYXZhaWxhYmxlYF0sIHsgcmVsYXRpdmVUbzogY29udGV4dC5yb3V0ZSB9KTtcbiAgfVxuXG4gIHB1YmxpYyBlbnRyeUFjdGlvbkZvclN0YXRlT25lT3JNb3JlVGFza3Moc3RhdGU6IFN0YXRlLCBjb250ZXh0OiBFdmVudFN0YXJ0U3RhdGVNYWNoaW5lQ29udGV4dCk6IHZvaWQge1xuICAgIHN0YXRlLnRyaWdnZXIoRXZlbnRTdGFydFN0YXRlcy5UQVNLX0FTU0lHTkVEX1RPX1VTRVIpO1xuICB9XG5cbiAgcHVibGljIGVudHJ5QWN0aW9uRm9yU3RhdGVNdWx0aXBsZVRhc2tzKHN0YXRlOiBTdGF0ZSwgY29udGV4dDogRXZlbnRTdGFydFN0YXRlTWFjaGluZUNvbnRleHQpOiB2b2lkIHtcbiAgICBzdGF0ZS50cmlnZ2VyKEV2ZW50U3RhcnRTdGF0ZXMuTVVMVElQTEVfVEFTS1NfQVNTSUdORURfVE9fVVNFUik7XG4gIH1cblxuICBwdWJsaWMgZW50cnlBY3Rpb25Gb3JTdGF0ZVRhc2tBc3NpZ25lZFRvVXNlcihzdGF0ZTogU3RhdGUsIGNvbnRleHQ6IEV2ZW50U3RhcnRTdGF0ZU1hY2hpbmVDb250ZXh0KTogdm9pZCB7XG4gICAgLy8gR2V0IG51bWJlciBvZiB0YXNrcyBhc3NpZ25lZCB0byB1c2VyXG4gICAgY29uc3QgdXNlckluZm9TdHIgPSBjb250ZXh0LnNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRJdGVtKCd1c2VyRGV0YWlscycpO1xuICAgIGNvbnN0IHVzZXJJbmZvID0gSlNPTi5wYXJzZSh1c2VySW5mb1N0cik7XG4gICAgY29uc3QgdGFza3NBc3NpZ25lZFRvVXNlciA9IGNvbnRleHQudGFza3MuZmlsdGVyKHggPT5cbiAgICAgICAgeC50YXNrX3N0YXRlICE9PSAndW5hc3NpZ25lZCcgJiYgeC5hc3NpZ25lZSA9PT0gdXNlckluZm8uaWQgfHwgeC5hc3NpZ25lZSA9PT0gdXNlckluZm8udWlkXG4gICAgICApO1xuXG4gICAgLy8gQ2hlY2sgaWYgdXNlciBpbml0aWF0ZWQgdGhlIGV2ZW50IGZyb20gdGFzayB0YWJcbiAgICBjb25zdCBpc0V2ZW50SW5pdGlhdGVkRnJvbVRhc2tUYWIgPSBjb250ZXh0LnRhc2tJZCAhPT0gdW5kZWZpbmVkICYmIHRhc2tzQXNzaWduZWRUb1VzZXIuZmluZEluZGV4KHggPT4geC5pZCA9PT0gY29udGV4dC50YXNrSWQpID4gLTE7XG5cbiAgICBpZiAoaXNFdmVudEluaXRpYXRlZEZyb21UYXNrVGFiKSB7XG4gICAgICAvLyBVc2VyIGluaXRpYXRlZCBldmVudCBmcm9tIHRhc2sgdGFiXG4gICAgICBzdGF0ZS50cmlnZ2VyKEV2ZW50U3RhcnRTdGF0ZXMuT05FX1RBU0tfQVNTSUdORURfVE9fVVNFUik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFVzZXIgaW5pdGlhdGVkIGV2ZW50IGZyb20gZHJvcGRvd25cbiAgICAgIHN3aXRjaCAodGFza3NBc3NpZ25lZFRvVXNlci5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIC8vIE5vIHRhc2tzIGFzc2lnbmVkIHRvIHVzZXIsIHRyaWdnZXIgc3RhdGUgdGFzayB1bmFzc2lnbmVkXG4gICAgICAgICAgc3RhdGUudHJpZ2dlcihFdmVudFN0YXJ0U3RhdGVzLlRBU0tfVU5BU1NJR05FRCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAvLyBPbmUgdGFzayBhc3NpZ25lZCB0byB1c2VyXG4gICAgICAgICAgc3RhdGUudHJpZ2dlcihFdmVudFN0YXJ0U3RhdGVzLk9ORV9UQVNLX0FTU0lHTkVEX1RPX1VTRVIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIC8vIE11bHRpcGxlIHRhc2tzIGFzc2lnbmVkIHRvIHVzZXIsIHRyaWdnZXIgc3RhdGUgbXVsdGlwbGUgdGFza3MgYXNzaWduZWQgdG8gdXNlclxuICAgICAgICAgIHN0YXRlLnRyaWdnZXIoRXZlbnRTdGFydFN0YXRlcy5NVUxUSVBMRV9UQVNLU19BU1NJR05FRF9UT19VU0VSKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZW50cnlBY3Rpb25Gb3JTdGF0ZVRhc2tVbkFzc2lnbmVkKHN0YXRlOiBTdGF0ZSwgY29udGV4dDogRXZlbnRTdGFydFN0YXRlTWFjaGluZUNvbnRleHQpOiB2b2lkIHtcbiAgICBsZXQgbmF2aWdhdGlvblVSTCA9ICcnO1xuICAgIGxldCB0aGVRdWVyeVBhcmFtczogUGFyYW1zID0ge307XG5cbiAgICBpZiAoY29udGV4dC50YXNrc1swXS5hc3NpZ25lZSkge1xuICAgICAgLy8gVGFzayBpcyBhc3NpZ25lZCB0byBzb21lIG90aGVyIHVzZXIsIG5hdmlnYXRlIHRvIHRhc2sgYXNzaWduZWQgZXJyb3IgcGFnZVxuICAgICAgbmF2aWdhdGlvblVSTCA9IGAvY2FzZXMvY2FzZS1kZXRhaWxzLyR7Y29udGV4dC5jYXNlSWR9L3Rhc2stYXNzaWduZWRgO1xuICAgICAgdGhlUXVlcnlQYXJhbXMgPSBjb250ZXh0LnRhc2tzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUYXNrIGlzIHVuYXNzaWduZWQsIG5hdmlnYXRlIHRvIHRhc2sgdW5hc3NpZ25lZCBlcnJvciBwYWdlXG4gICAgICBuYXZpZ2F0aW9uVVJMID0gYC9jYXNlcy9jYXNlLWRldGFpbHMvJHtjb250ZXh0LmNhc2VJZH0vdGFzay11bmFzc2lnbmVkYDtcbiAgICB9XG5cbiAgICAvLyBUcmlnZ2VyIGZpbmFsIHN0YXRlIHRvIGNvbXBsZXRlIHByb2Nlc3Npbmcgb2Ygc3RhdGUgbWFjaGluZVxuICAgIHN0YXRlLnRyaWdnZXIoRXZlbnRTdGFydFN0YXRlcy5GSU5BTCk7XG4gICAgLy8gTmF2aWdhdGVcbiAgICBjb250ZXh0LnJvdXRlci5uYXZpZ2F0ZShbYCR7bmF2aWdhdGlvblVSTH1gXSwgeyBxdWVyeVBhcmFtczogdGhlUXVlcnlQYXJhbXMsIHJlbGF0aXZlVG86IGNvbnRleHQucm91dGUgfSk7XG4gIH1cblxuICBwdWJsaWMgZW50cnlBY3Rpb25Gb3JTdGF0ZU9uZVRhc2tBc3NpZ25lZFRvVXNlcihzdGF0ZTogU3RhdGUsIGNvbnRleHQ6IEV2ZW50U3RhcnRTdGF0ZU1hY2hpbmVDb250ZXh0KTogdm9pZCB7XG4gICAgLy8gVHJpZ2dlciBmaW5hbCBzdGF0ZSB0byBjb21wbGV0ZSBwcm9jZXNzaW5nIG9mIHN0YXRlIG1hY2hpbmVcbiAgICBzdGF0ZS50cmlnZ2VyKEV2ZW50U3RhcnRTdGF0ZXMuRklOQUwpO1xuXG4gICAgLy8gR2V0IHRhc2sgYXNzaWduZWQgdG8gdXNlclxuICAgIGxldCB0YXNrID0gY29udGV4dC50YXNrcy5maW5kKHggPT4geC5pZCA9PT0gY29udGV4dC50YXNrSWQpO1xuICAgIGlmICghdGFzaykge1xuICAgICAgdGFzayA9IGNvbnRleHQudGFza3NbMF07XG4gICAgfVxuXG4gICAgLy8gU3RvcmUgdGFzayB0byBzZXNzaW9uXG4gICAgY29udGV4dC5zZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0SXRlbSgndGFza1RvQ29tcGxldGUnLCBKU09OLnN0cmluZ2lmeSh0YXNrKSk7XG4gICAgLy8gQWxsb3cgdXNlciB0byBwZXJmb3JtIHRoZSBldmVudFxuICAgIGNvbnRleHQucm91dGVyLm5hdmlnYXRlKFtgL2Nhc2VzL2Nhc2UtZGV0YWlscy8ke2NvbnRleHQuY2FzZUlkfS90cmlnZ2VyLyR7Y29udGV4dC5ldmVudElkfWBdLFxuICAgICAgeyBxdWVyeVBhcmFtczogeyBpc0NvbXBsZXRlOiB0cnVlIH0sIHJlbGF0aXZlVG86IGNvbnRleHQucm91dGUgfSk7XG4gIH1cblxuICBwdWJsaWMgZW50cnlBY3Rpb25Gb3JTdGF0ZU11bHRpcGxlVGFza3NBc3NpZ25lZFRvVXNlcihzdGF0ZTogU3RhdGUsIGNvbnRleHQ6IEV2ZW50U3RhcnRTdGF0ZU1hY2hpbmVDb250ZXh0KTogdm9pZCB7XG4gICAgLy8gVHJpZ2dlciBmaW5hbCBzdGF0ZSB0byBjb21wbGV0ZSBwcm9jZXNzaW5nIG9mIHN0YXRlIG1hY2hpbmVcbiAgICBzdGF0ZS50cmlnZ2VyKEV2ZW50U3RhcnRTdGF0ZXMuRklOQUwpO1xuICAgIC8vIE5hdmlnYXRlIHRvIG11bHRpcGxlIHRhc2tzIGV4aXN0IGVycm9yIHBhZ2VcbiAgICBjb250ZXh0LnJvdXRlci5uYXZpZ2F0ZShbYC9jYXNlcy9jYXNlLWRldGFpbHMvJHtjb250ZXh0LmNhc2VJZH0vbXVsdGlwbGUtdGFza3MtZXhpc3RgXSwgeyByZWxhdGl2ZVRvOiBjb250ZXh0LnJvdXRlIH0pO1xuICB9XG5cbiAgcHVibGljIGZpbmFsQWN0aW9uKHN0YXRlOiBTdGF0ZSk6IHZvaWQge1xuICAgIC8vIEZpbmFsIGFjdGlvbnMgY2FuIGJlIHBlcmZvcm1lZCBoZXJlLCB0aGUgc3RhdGUgbWFjaGluZSBmaW5pc2hlZCBydW5uaW5nXG4gICAgLy8gY29uc29sZS5sb2coJ0ZJTkFMJywgc3RhdGUpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUcmFuc2l0aW9uc0ZvclN0YXRlQ2hlY2tGb3JNYXRjaGluZ1Rhc2tzKCk6IHZvaWQge1xuICAgIC8vIE5vIHRhc2tzXG4gICAgdGhpcy5zdGF0ZUNoZWNrRm9yTWF0Y2hpbmdUYXNrcy5hZGRUcmFuc2l0aW9uKFxuICAgICAgRXZlbnRTdGFydFN0YXRlcy5OT19UQVNLLFxuICAgICAgdGhpcy5zdGF0ZU5vVGFza1xuICAgICk7XG4gICAgLy8gT25lIHRhc2tcbiAgICB0aGlzLnN0YXRlQ2hlY2tGb3JNYXRjaGluZ1Rhc2tzLmFkZFRyYW5zaXRpb24oXG4gICAgICBFdmVudFN0YXJ0U3RhdGVzLk9ORV9PUl9NT1JFX1RBU0tTLFxuICAgICAgdGhpcy5zdGF0ZU9uZU9yTW9yZVRhc2tzXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUcmFuc2l0aW9uc0ZvclN0YXRlTm9UYXNrKCk6IHZvaWQge1xuICAgIHRoaXMuc3RhdGVOb1Rhc2suYWRkVHJhbnNpdGlvbihcbiAgICAgIEV2ZW50U3RhcnRTdGF0ZXMuRklOQUwsXG4gICAgICB0aGlzLnN0YXRlRmluYWxcbiAgICApO1xuICB9XG5cbiAgcHVibGljIGFkZFRyYW5zaXRpb25zRm9yU3RhdGVPbmVPck1vcmVUYXNrcygpOiB2b2lkIHtcbiAgICB0aGlzLnN0YXRlT25lT3JNb3JlVGFza3MuYWRkVHJhbnNpdGlvbihcbiAgICAgIEV2ZW50U3RhcnRTdGF0ZXMuVEFTS19BU1NJR05FRF9UT19VU0VSLFxuICAgICAgdGhpcy5zdGF0ZVRhc2tBc3NpZ25lZFRvVXNlclxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgYWRkVHJhbnNpdGlvbnNGb3JTdGF0ZVRhc2tVbmFzc2lnbmVkKCk6IHZvaWQge1xuICAgIHRoaXMuc3RhdGVUYXNrVW5hc3NpZ25lZC5hZGRUcmFuc2l0aW9uKFxuICAgICAgRXZlbnRTdGFydFN0YXRlcy5GSU5BTCxcbiAgICAgIHRoaXMuc3RhdGVGaW5hbFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgYWRkVHJhbnNpdGlvbnNGb3JTdGF0ZVRhc2tBc3NpZ25lZFRvVXNlcigpOiB2b2lkIHtcbiAgICB0aGlzLnN0YXRlVGFza0Fzc2lnbmVkVG9Vc2VyLmFkZFRyYW5zaXRpb24oXG4gICAgICBFdmVudFN0YXJ0U3RhdGVzLk9ORV9UQVNLX0FTU0lHTkVEX1RPX1VTRVIsXG4gICAgICB0aGlzLnN0YXRlT25lVGFza0Fzc2lnbmVkVG9Vc2VyXG4gICAgKTtcbiAgICB0aGlzLnN0YXRlVGFza0Fzc2lnbmVkVG9Vc2VyLmFkZFRyYW5zaXRpb24oXG4gICAgICBFdmVudFN0YXJ0U3RhdGVzLlRBU0tfVU5BU1NJR05FRCxcbiAgICAgIHRoaXMuc3RhdGVUYXNrVW5hc3NpZ25lZFxuICAgICk7XG4gICAgdGhpcy5zdGF0ZVRhc2tBc3NpZ25lZFRvVXNlci5hZGRUcmFuc2l0aW9uKFxuICAgICAgRXZlbnRTdGFydFN0YXRlcy5NVUxUSVBMRV9UQVNLU19BU1NJR05FRF9UT19VU0VSLFxuICAgICAgdGhpcy5zdGF0ZU11bHRpcGxlVGFza3NBc3NpZ25lZFRvVXNlclxuICAgICk7XG4gICAgdGhpcy5zdGF0ZVRhc2tBc3NpZ25lZFRvVXNlci5hZGRUcmFuc2l0aW9uKFxuICAgICAgRXZlbnRTdGFydFN0YXRlcy5GSU5BTCxcbiAgICAgIHRoaXMuc3RhdGVGaW5hbFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgYWRkVHJhbnNpdGlvbnNGb3JTdGF0ZU9uZVRhc2tBc3NpZ25lZFRvVXNlcigpOiB2b2lkIHtcbiAgICB0aGlzLnN0YXRlT25lVGFza0Fzc2lnbmVkVG9Vc2VyLmFkZFRyYW5zaXRpb24oXG4gICAgICBFdmVudFN0YXJ0U3RhdGVzLkZJTkFMLFxuICAgICAgdGhpcy5zdGF0ZUZpbmFsXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUcmFuc2l0aW9uc0ZvclN0YXRlTXVsdGlwbGVUYXNrc0Fzc2lnbmVkVG9Vc2VyKCk6IHZvaWQge1xuICAgIHRoaXMuc3RhdGVNdWx0aXBsZVRhc2tzQXNzaWduZWRUb1VzZXIuYWRkVHJhbnNpdGlvbihcbiAgICAgIEV2ZW50U3RhcnRTdGF0ZXMuRklOQUwsXG4gICAgICB0aGlzLnN0YXRlRmluYWxcbiAgICApO1xuICB9XG59XG4iXX0=