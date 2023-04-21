import { emailAddress } from './emailAddress';
import { haveDx } from './haveDx';
import { name } from './name';
import { organisationName } from './oganisationName';
import { organisationAddress } from './organisationAddress';
import { organisationDx } from './organisationDx';
import { organisationHaveSra } from './organisationHaveSra';
import { pbaNumber } from './pbaNumber';
import { sraNumber } from './sraNumber';

const formBuilderTemplates = {
  'email-address': emailAddress,
  haveSra: organisationHaveSra,
  name,
  'organisation-address': organisationAddress,
  'organisation-dx': organisationDx,
  'organisation-have-dx': haveDx,
  'organisation-name': organisationName,
  'organisation-pba': pbaNumber,
  sraNumber
};

/**
 * Place to keep app constants.
 * Nice to have: The constants should also be injected into state to have single source of truth.
 */

export class RegistrationConstants {
  public static FORM_BUILDER_TEMPLATES = formBuilderTemplates;
}
