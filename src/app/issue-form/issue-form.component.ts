import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  viewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Issue } from '../models/issue.model';
import { ISSUE_PRIORITIES, ISSUE_STATUSES } from '../consts/issue.consts';
import { IssueService } from '../issue.service';

@Component({
  selector: 'app-issue-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './issue-form.component.html',
  styleUrl: './issue-form.component.scss',
})
export class IssueFormComponent {
  availableStatuses = ISSUE_STATUSES;
  availablePriorities = ISSUE_PRIORITIES;
  loading: boolean = false;
  issue = new Issue();

  @ViewChild('details') details!: { nativeElement: HTMLElement };
  @Output() update = new EventEmitter<{
    issue: Issue;
    type: 'update' | 'revert' | 'opt';
  }>();
  constructor(private issueService: IssueService) {}

  onSubmit(form: NgForm) {
    this.loading = true;
    this.update.emit({ issue: form.value, type: 'update' });
    this.issueService
      .createIssue(form.value)
      .subscribe({
        next: (res) => {
          this.update.emit({ issue: res, type: 'update' });
        },
        error: () => this.update.emit({ issue: form.value, type: 'revert' }),
      })
      .add(() => {
        this.loading = false;
        this.details.nativeElement.removeAttribute('open');
        this.issue = new Issue();
        form.reset(this.issue);
        console.log(form.submitted);
      });
  }
}
