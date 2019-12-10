export interface User {
    email: string;
    firstName: string;
    idamMessage: string;
    idamStatus: string;
    idamStatusCode: string;
    lastName: string;
    roles?: string[];
    userIdentifier: string;
    fullName?: string;
    routerLink?: string;
    status?: string;
    selected?: boolean;
    manageOrganisations?: string;
    manageUsers?: string;
    manageCases?: string;
}
