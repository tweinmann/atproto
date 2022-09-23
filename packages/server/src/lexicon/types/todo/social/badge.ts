/**
* GENERATED CODE - DO NOT MODIFY
* Created Thu Sep 22 2022
*/
export interface Record {
  assertion:
    | InviteAssertion
    | EmployeeAssertion
    | TagAssertion
    | UnknownAssertion;
  subject: string;
  createdAt: string;
  [k: string]: unknown;
}
export interface InviteAssertion {
  type: 'invite';
  [k: string]: unknown;
}
export interface EmployeeAssertion {
  type: 'employee';
  [k: string]: unknown;
}
export interface TagAssertion {
  type: 'tag';
  tag: string;
  [k: string]: unknown;
}
export interface UnknownAssertion {
  type: string;
  [k: string]: unknown;
}
