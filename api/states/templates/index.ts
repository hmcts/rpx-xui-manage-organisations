import emailAddress from './emailAddress'
import haveDx from './organisationHaveDx'
import name from './name'
import organisationAddress from './organisationAddress'
import organisationDx from './organisationDx'
import organisationName from './organisationName'
import pbaNumber from './organisationPba'
import sraNumber from './sraNumber';
import organisationHaveSra from './organisationHaveSra';

const templates: any = []

templates.any = {
    'email-address': emailAddress,
    'haveSra': organisationHaveSra,
    'name': name,
    'organisation-address': organisationAddress,
    'organisation-dx': organisationDx,
    'organisation-have-dx': haveDx,
    'organisation-name': organisationName,
    'organisation-pba': pbaNumber,
    'sraNumber': sraNumber,
}

export default templates
