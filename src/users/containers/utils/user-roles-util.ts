import { AppConstants } from '../../../app/app.constants';

export class UserRolesUtil {
    static getRolesAdded(user: any, permissions: string[]): any[] {
        const roles = [];
        permissions.forEach( (permission) => {
            if (!user.roles.includes(permission)) {
            roles.push({
                name: permission
            });
            }
        });
        return roles;
        }

    static getRolesDeleted(user: any, permissions: string[]): any[] {
        const roles = [];
        user.roles.forEach( (permission) => {
            if (!permissions.includes(permission) && !AppConstants.CCD_ROLES.includes(permission)) {
            roles.push({
                name: permission
            });
            }
        });
        return roles;
    }

    static mapEditUserRoles(user: any, rolesAdd: any[], rolesDelete: any[]): any {
        return {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            idamStatus: user.idamStatus,
            rolesAdd,
            rolesDelete
        };
    }

    static mapPermissions(value: any) {
        return Object.keys(value.roles).filter(key => {
            if (value.roles[key]) {
            return key;
            }
        });
    }
    static isAddingRoleSuccessful(response: any): boolean {
        return response.addRolesResponse &&
        response.addRolesResponse.idamStatusCode &&
        response.addRolesResponse.idamStatusCode === '201';
    }

    static isDeletingRoleSuccessful(result: any): boolean {
        return result.deleteRolesResponse &&
        result.deleteRolesResponse[0].idamStatusCode &&
        result.deleteRolesResponse[0].idamStatusCode === '204';
    }
}
