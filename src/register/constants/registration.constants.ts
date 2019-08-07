import {emailAddress} from './emailAddress';
import {organisationAddress} from './organisationoAddress';
import {pbaNumber} from './pbaNumber';
import {haveDx} from './haveDx';
import {organisationDx} from './organisationDx';
import {organisationHaveSra} from './organisationHaveSra';
import {sraNumber} from './sraNumber';
import {name} from './name';
import {organisationName} from './oganisationName';

const formBuilderTemplates = {
  'email-address': emailAddress,
  haveSra: organisationHaveSra,
  name,
  'organisation-address': organisationAddress,
  'organisation-dx': organisationDx,
  'organisation-have-dx': haveDx,
  'organisation-name': organisationName,
  'organisation-pba': pbaNumber,
  sraNumber,
};

/**
 * Place to keep app constants.
 * Nice to have: The constants should also be injected into state to have single source of truth.
 */

export class RegistrationConstants {
  static FORM_BUILDER_TEMPLATES = formBuilderTemplates;
}
