import emailAddress from './emailAddress'
import haveDx from './organisationHaveDx'
import name from './name'
import organisationAddress from './organisationAddress'
import organisationDx from './organisationDx'
import organisationName from './organisationName'
import pbaNumber from './organisationPba'
import rsaNumber from './rsaNumber';
import organisationHaveRsa from './organisationHaveRsa';

const templates: any = []

templates.any = {
    'email-address': emailAddress,
    'have-rsa': organisationHaveRsa,
    'name': name,
    'organisation-address': organisationAddress,
    'organisation-dx': organisationDx,
    'organisation-have-dx': haveDx,
    'organisation-name': organisationName,
    'organisation-pba': pbaNumber,
    'rsaNumber': rsaNumber,
}

export default templates
