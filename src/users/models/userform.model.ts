export interface UserListApiModel {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    permissions: string[];
    resendInvite: boolean;
}
