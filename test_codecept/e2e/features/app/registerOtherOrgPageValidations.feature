@fullFunctional @ignore
Feature: Register other org, page validations

    Background:
        When I navigate to manage organisation Url
        Given I am logged in with ROO user targetting ON
        Then I should be redirected to manage organisation dashboard page

    Scenario: Register other org, page level validations in What type of organisation are you registering?
        When In register organisation workflow, I navigate to route "organisation-type"
        When I click continue in register other org workflow
        Then In register organisation workflow, I validate error messages displayed
            | message                       |
            | Please select an organisation |

        When In register other org page "What type of organisation are you registering?", I input values
            | field                           | value     |
            | Select the type of organisation | Solicitor |
        When I click continue in register other org workflow
        Then I am on register other org page "What is your company name and Companies House number?"


    Scenario: Register other org, page level validations in What is your company name and Companies House number?
        When In register organisation workflow, I navigate to route "company-house-details"
        When I click continue in register other org workflow
        Then In register organisation workflow, I validate error messages displayed
            | message                    |
            | Enter an organisation name |

        When In register other org page "What is your company name and Companies House number?", I input values
            | field                              | value                  |
            | Enter the name of the organisation | Auto test organisation |
        When I click continue in register other org workflow
        Then I am on register other org page "What is the registered address of your organisation?"

    @ignore
    Scenario: Register other org, page level validations in What is the registered address of your organisation?
        When In register organisation workflow, I navigate to route "registered-address/external"
        When I click continue in register other org workflow
        Then In register organisation workflow, I validate error messages displayed
            | message                |
            | Enter a valid postcode |

        When In register other org page "What is the registered address of your organisation?", I input values
            | field                   | value           |
            | Provide address details | SW1V 3BZ,Flat 1 |
        When I click continue in register other org workflow


    Scenario: Register other org, page level validations in Does your organisation have a payment by account number?
        When In register organisation workflow, I navigate to route "payment-by-account"
        Then I am on register other org page "Does your organisation have a payment by account number?"

        When I click continue in register other org workflow
        Then In register organisation workflow, I validate error messages displayed
            | message                           |
            | Please select an option |

        When In register other org page "Does your organisation have a payment by account number?", I input values
            | field                                                           | value |
            | Does your organisation have a payment by account number? | yes |
        When I click continue in register other org workflow
        Then I am on register other org page "What PBA numbers does your organisation use?"


    Scenario: Register other org, page level validations in Who is your organisation registered with?
        When In register organisation workflow, I navigate to route "regulatory-organisation-type"
        When I click continue in register other org workflow
        Then In register organisation workflow, I validate error messages displayed
            | message                                 |
            | Please select a regulatory organisation |

        When In register other org page "Who is your organisation registered with?", I input values
            | field                                      | value                          |
            | Select the type of regulatory organisation | Solicitor Regulation Authority (SRA) |
        When I click continue in register other org workflow


        Then In register organisation workflow, I validate error messages displayed
            | message                     |
            | Enter a registration reference |
        When In register other org page "Who is your organisation registered with?", I input values
            | field                                         | value       |
            | Enter your organisation's registration number | SRA12345678 |


        When I click continue in register other org workflow
        Then I am on register other org page "Which services will your organisation need to access?"


 
    Scenario: Register other org, page level validations in Which services will your organisation need to access?
        When In register organisation workflow, I navigate to route "organisation-services-access"
        When I click continue in register other org workflow
        Then In register organisation workflow, I validate error messages displayed
            | message                            |
            | Please select at least one service |

        When In register other org page "Which services will your organisation need to access?", I input values
            | field                                                 | value   |
            | Which services will your organisation need to access? | Damages |
        When I click continue in register other org workflow
        Then I am on register other org page "Does your organisation have a payment by account number?"


    Scenario: Register other org, page level validations in Does your organisation have a payment by account number?
        When In register organisation workflow, I navigate to route "payment-by-account"
        When I click continue in register other org workflow
        Then In register organisation workflow, I validate error messages displayed
            | message                            |
            | Please select an option |

        When In register other org page "Does your organisation have a payment by account number?", I input values
            | field                                                 | value   |
            | Does your organisation have a payment by account number? | Yes |
        When I click continue in register other org workflow
        Then I am on register other org page "What PBA numbers does your organisation use?"

@ignore
    Scenario: Register other org, page level validations in What PBA numbers does your organisation use?
        When In register organisation workflow, I navigate to route "payment-by-account-details"
        When I click continue in register other org workflow
        Then In register organisation workflow, I validate error messages displayed
            | message                 |
            | Please enter PBA number |

        When In register other org page "What PBA numbers does your organisation use?", I input values
            | field                                                    | value |
            | PBA number | PBA1234567 |
        When I click continue in register other org workflow
        Then I am on register other org page "What PBA numbers does your organisation use?"


    Scenario: Register other org, page level validations in Provide your contact details
        When In register organisation workflow, I navigate to route "contact-details"
        When I click continue in register other org workflow
        Then In register organisation workflow, I validate error messages displayed
            | message                 |
            | Enter first name |
            | Enter last name |
            | Enter email address |

        When In register other org page "Provide your contact details", I input values
            | field      | value      |
            | First name | testfn |
        When I click continue in register other org workflow
        Then In register organisation workflow, I validate error messages displayed
            | message             |
            | Enter last name     |
            | Enter email address |

        When In register other org page "Provide your contact details", I input values
            | field      | value  |
            | Last name | testln |
        When I click continue in register other org workflow
        Then In register organisation workflow, I validate error messages displayed
            | message             |
            | Enter email address |

        When In register other org page "Provide your contact details", I input values
            | field     | value  |
            | Enter your work email address | test@test.com |
        When I click continue in register other org workflow


        Then I am on register other org page "Are you (as an individual) registered with a regulator?"


    Scenario: Register other org, page level validations in Are you (as an individual) registered with a regulator?
        When In register organisation workflow, I navigate to route "individual-registered-with-regulator"
        When I click continue in register other org workflow
        Then In register organisation workflow, I validate error messages displayed
            | message                 |
            | Please select an option |

        When In register other org page "Are you (as an individual) registered with a regulator?", I input values
            | field      | value      |
            | Are you (as an individual) registered with a regulator? | Yes |
        When I click continue in register other org workflow
        Then I am on register other org page "What regulator are you (as an individual) registered with?"



 
    Scenario: Register other org, page level validations in What regulator are you (as an individual) registered with?
        When In register organisation workflow, I navigate to route "individual-registered-with-regulator-details"
        When I click continue in register other org workflow
        Then In register organisation workflow, I validate error messages displayed
            | message                 |
            | Please select a regulatory organisation |

        When In register other org page "What regulator are you (as an individual) registered with?", I input values
            | field                                                   | value |
            | Select the type of regulator | Solicitor Regulation Authority (SRA) |
        When I click continue in register other org workflow

        Then In register organisation workflow, I validate error messages displayed
            | message                                 |
            | Enter a registration reference |

        When In register other org page "What regulator are you (as an individual) registered with?", I input values
            | field                        | value                                |
            | Enter your organisation's registration number |SRA12345678 |
        When I click continue in register other org workflow
        Then I am on register other org page "Check your answers before you register"