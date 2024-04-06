import { ISSUE_PRIORITIES, ISSUE_STATUSES } from '../consts/issue.consts';
import { ListItem } from './commons.model';

export type IssueStatus = (typeof ISSUE_STATUSES)[number];
export type IssuePriority = (typeof ISSUE_PRIORITIES)[number];

export class Issue {
  id!: number;
  title: string = '';
  status: IssueStatus = 'Open';
  priority: IssuePriority = 'Low';
  assignee: string = '';
}

export interface ListedIssue extends Issue, ListItem<Issue> {}
