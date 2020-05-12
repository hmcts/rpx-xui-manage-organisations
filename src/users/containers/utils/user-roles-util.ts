import { AppConstants } from '../../../app/app.constants';
import {propsExist} from '../../../../api/lib/objectUtilities';

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

    /**
     * Does Role Addition Exist
     *
     * Checks if role addition exists in the object returned from PRD.
     *
     * @param response - the response object from PRD.
     */
    public static doesRoleAdditionExist(response) {
      return propsExist(response, ['roleAdditionResponse', 'idamStatusCode']);
    }

    /**
     * Does Role Deletion Exist
     *
     * @param response - the response object from PRD.
     */
    public static doesRoleDeletionExist(response) {
      return propsExist(response, ['roleDeletionResponse']);
    }

    /**
     * Check for Role Deletion Success
     *
     * When we do a deletion, multiply roles are sent back from PRD,
     * each role sent back informs us if that role has been deleted for the User.
     *
     * On success, each role deletion should return an idamStatusCode of '204'.
     *
     * If a role does not return a 204 there has been a problem.
     *
     * @param roleDeletionResponse - [
     * {
     *  "roleName": "pui-organisation-manager",
     *  "idamStatusCode": "204",
     *  "idamMessage": "20 User Role Deleted"
     * },
     * {
     *  "roleName": "pui-user-manager",
     *  "idamStatusCode": "204",
     *  "idamMessage": "20 User Role Deleted"
     * }
     * ]
     * @see unit
     */
    public static checkRoleDeletionsSuccess(roleDeletionResponse) {

      const deleteFailures = roleDeletionResponse.filter(deleteResponse => {
        return deleteResponse.idamStatusCode !== '204';
      });

      return !(deleteFailures.length > 0);
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
