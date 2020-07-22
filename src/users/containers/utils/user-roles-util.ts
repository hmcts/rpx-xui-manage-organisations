import { AppConstants } from '../../../app/app.constants';
import {boolean} from '@pact-foundation/pact/dsl/matchers';

export class UserRolesUtil {
    static getRolesAdded(user: any, permissions: string[]): any[] {
        const roles = [];
        permissions.forEach( (permission) => {
            if (!user.roles.includes(permission)) {
            roles.push({
                name: permission
            });
            if (permission === 'pui-case-manager') {
                const ccdRolesTobeAdded = UserRolesUtil.GetRolesToBeAddedForUser(user, AppConstants.CCD_ROLES);
                ccdRolesTobeAdded.forEach(newRole => roles.push(newRole));
              }
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
              if (permission === 'pui-case-manager') {
                const ccdRolesTobeRemoved = UserRolesUtil.GetRemovableRolesForUser(user, AppConstants.CCD_ROLES);
                ccdRolesTobeRemoved.forEach(newRole => roles.push(newRole));
              }
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
        return response.roleAdditionResponse &&
        response.roleAdditionResponse.idamStatusCode &&
        response.roleAdditionResponse.idamStatusCode === '201';
    }

    static isDeletingRoleSuccessful(result: any): boolean {
        return result.roleDeletionResponse &&
        result.roleDeletionResponse[0].idamStatusCode &&
        result.roleDeletionResponse[0].idamStatusCode === '204';
    }

    static GetRemovableRolesForUser(user: any, roles: Array<string>): Array<any> {
      const rolesTobeRemoved = new Array<any>();
      roles.forEach(role => {
        if (user.roles.includes(role)) {
          rolesTobeRemoved.push({name: role});
        }
      });
      return  rolesTobeRemoved;
    }

    static GetRolesToBeAddedForUser(user: any, roles: Array<string>): Array<any> {
      const rolesTobeAdded = new Array<any>();
      roles.forEach(role => {
          rolesTobeAdded.push({name: role});
      });
      return  rolesTobeAdded;
  }
}
