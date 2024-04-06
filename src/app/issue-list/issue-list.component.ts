import { Component, ViewChild } from '@angular/core';
import { Issue, IssueStatus, ListedIssue } from '../models/issue.model';
import { IssueService } from '../issue.service';
import { CommonModule } from '@angular/common';
import { ISSUE_PRIORITIES, ISSUE_STATUSES } from '../consts/issue.consts';
import { CustomPopoverComponent } from '../components/custom-popover/custom-popover.component';
import { FormsModule } from '@angular/forms';
import { IssueFormComponent } from '../issue-form/issue-form.component';

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [
    CommonModule,
    CustomPopoverComponent,
    FormsModule,
    IssueFormComponent,
  ],
  templateUrl: './issue-list.component.html',
  styleUrl: './issue-list.component.scss',
})
export class IssueListComponent {
  issues: ListedIssue[] = [];
  availableStatuses = ISSUE_STATUSES;
  availablePriorities = ISSUE_PRIORITIES;
  listLoading: boolean = false;
  fields: { title: keyof Issue; value: boolean }[] = [
    { title: 'id', value: false },
    { title: 'title', value: true },
    { title: 'status', value: true },
    { title: 'priority', value: false },
    { title: 'assignee', value: false },
  ];
  params = { status: '', priority: '' };

  @ViewChild('issueList') list!: { nativeElement: HTMLElement };
  constructor(private issueService: IssueService) {}

  ngOnInit(): void {
    this.fetchIssues();
  }

  fetchIssues() {
    this.listLoading = true;
    this.issueService
      .getIssues(this.params)
      .subscribe((issues) => {
        this.issues = issues.map((issue) => ({
          ...issue,
          loading: false,
          prv_state: issue,
        }));
      })
      .add(() => (this.listLoading = false));
  }

  clearParams() {
    this.params = { status: '', priority: '' };
  }

  addIssue(data: { issue: Issue; type: 'revert' | 'update' | 'opt' }) {
    if (data.type === 'update') {
      this.issues[this.issues.length - 1] = {
        ...data.issue,
        loading: false,
        prv_state: data.issue,
      };
      this.list.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    } else if (data.type === 'revert') this.issues.pop();
    else if (data.type === 'opt')
      this.issues.push({
        ...data.issue,
        loading: true,
        prv_state: data.issue,
      });
  }

  updateIssueStatus(issue: ListedIssue, event: Event) {
    // 1. Update the issue in the UI (optimistically)
    // 2. Call issueService.updateIssueStatus(issue)
    // 3. Handle success/error, potentially revert the optimistic update
    issue.status = (event.target as HTMLInputElement).value as IssueStatus;
    issue.loading = true;
    this.issueService
      .updateIssueStatus(issue)
      .subscribe({
        next: (res) => (issue.prv_state = res),
        error: (err) => (issue.status = issue.prv_state.status), // revert
      })
      .add(() => (issue.loading = false));
  }
}
