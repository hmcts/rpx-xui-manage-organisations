export interface RoleAssignmentResponse {
  id: string;
  actorIdType: string;
  actorId: string;
  roleType: string;
  roleName: string;
  classification: string;
  grantType: string;
  roleCategory: string;
  readonly: boolean;
  created: Date
  attributes: {
    caseId?: string;
    caseType?: string;
    jurisdiction: string;
    primaryLocation: string;
  }
}
