@fullFunctional @ignore
Feature: Register other org, registration

    Scenario: register other org workflow with all optional values

        When I navigate to manage organisation Url
        Given I am logged in with ROO user targetting ON
        Then I should be redirected to manage organisation dashboard page

        Given I navigate to register other org start page
        Then I am on register other org page "Apply for an organisation to manage civil, family and tribunal cases"
        Then In register other org page "Apply for an organisation to manage civil, family and tribunal cases", I validate fields displayed
            | field                                                       |
            | Before you start                                            |
            | I've checked whether my organisation already has an account |

        When In register other org page "Apply for an organisation to manage civil, family and tribunal cases", I input values
            | field                                                       | value |
            | I've checked whether my organisation already has an account | Yes   |
        When I click start button in before you start page

        Then I am on register other org page "What type of organisation are you registering?"
        When In register other org page "What type of organisation are you registering?", I input values
            | field                           | value     |
            | Select the type of organisation | Solicitor |

        When I click continue in register other org workflow

        Then I am on register other org page "What is your company name and Companies House number?"
        When In register other org page "What is your company name and Companies House number?", I input values
            | field                                    | value                  |
            | Enter the name of the organisation       | Auto test organisation |
            | Enter the 8-digit Companies House Number | 12345678               |
        When I click continue in register other org workflow


        Then I am on register other org page "What is the registered address of your organisation?"
        When In register other org page "What is the registered address of your organisation?", I input values
            | field                       | value |
            | I can't enter a UK postcode |       |
        # When I click continue in register other org workflow

        Then I am on register other org page "Is this a UK address?"
        When In register other org page "Is this a UK address?", I input values
            | field                 | value         |
            | Is this a UK address? | Yes           |
            | Building and Street   | auto building |
            | Address line 2        | auto addr 2   |
            | Address line 3        | auto addr 3   |
            | Town or City          | auto city     |
            | County                | auto country  |
            | Postcode              | SW1V 3BZ      |
        When I click continue in register other org workflow

        Then I am on register other org page "Do you have a document exchange reference for your main office?"
        When In register other org page "Do you have a document exchange reference for your main office?", I input values
            | field                                                           | value |
            | Do you have a document exchange reference for your main office? | Yes   |
        When I click continue in register other org workflow

        Then I am on register other org page "What's the DX reference for this office?"
        When In register other org page "What's the DX reference for this office?", I input values
            | field       | value             |
            | DX number   | DX12345           |
            | DX exchange | HAYES (MIDDLESEX) |
        When I click continue in register other org workflow


        Then I am on register other org page "Who is your organisation registered with?"
        When In register other org page "Who is your organisation registered with?", I input values
            | field                                                | value       |
            | Select the type of regulatory organisation           | Other       |
            | Enter the name of the professional body or regulator | test name   |
            | Enter your organisation's registration number        | test number |

        When I click continue in register other org workflow

        Then I am on register other org page "Which services will your organisation need to access?"
        When In register other org page "Which services will your organisation need to access?", I input values
            | field                                                 | value           |
            | Which services will your organisation need to access? | Divorce,Damages |


        When I click continue in register other org workflow


        Then I am on register other org page "Does your organisation have a payment by account number?"
        When In register other org page "Does your organisation have a payment by account number?", I input values
            | field                                                    | value |
            | Does your organisation have a payment by account number? | Yes   |
        When I click continue in register other org workflow


        Then I am on register other org page "What PBA numbers does your organisation use?"
        When In register other org page "What PBA numbers does your organisation use?", I input values
            | field      | value                 |
            | PBA number | PBA1234567,PBA7654321 |
        When I click continue in register other org workflow


        Then I am on register other org page "Provide your contact details"
        When In register other org page "Provide your contact details", I input values
            | field                         | value                    |
            | First name                    | auto test fn             |
            | Last name                     | auto test ln             |
            | Enter your work email address | auto_test_email@test.com |
        When I click continue in register other org workflow


        Then I am on register other org page "Are you (as an individual) registered with a regulator?"
        When In register other org page "Are you (as an individual) registered with a regulator?", I input values
            | field                                                   | value |
            | Are you (as an individual) registered with a regulator? | Yes   |
        When I click continue in register other org workflow


        Then I am on register other org page "What regulator are you (as an individual) registered with?"
        When In register other org page "What regulator are you (as an individual) registered with?", I input values
            | field                                                | value          |
            | Select the type of regulator                         | Other          |
            | Enter the name of the professional body or regulator | Test regulator |
            | Enter your organisation's registration number        | 12345678       |
        When I click continue in register other org workflow

        Then I am on register other org page "Check your answers before you register"
        Then In register other org workflow, I validate check your answers displayed
            | field                                                       | value                                                                    |
            | Organisation type                                           | Solicitor                                                                |
            | Organisation name                                           | Auto test organisation                                                   |
            | Company registration number                                 | 12345678                                                                 |
            | Organisation address                                        | auto building,auto addr 2,auto addr 3,auto city,auto country,SW1V 3BZ,UK |
            | DX reference                                                | DX12345, HAYES (MIDDLESEX)                                               |
            | Service to access                                           | Divorce,Damages                                                          |
            | What PBA numbers does your organisation use?                | PBA1234567,PBA7654321                                                    |
            | Regulatory organisation type                                | Other: test name ref: test number                                        |
            | First name(s)                                               | auto test fn                                                             |
            | Last name                                                   | auto test ln                                                             |
            | Email address                                               | auto_test_email@test.com                                                 |
            | What regulators are you (as an individual) registered with? | Other: Test regulator ref: 12345678                                      |


    Scenario: register other org workflow with minimum values
        When I navigate to manage organisation Url
        Given I am logged in with ROO user targetting ON
        Then I should be redirected to manage organisation dashboard page

        Given I navigate to register other org start page
        Then I am on register other org page "Apply for an organisation to manage civil, family and tribunal cases"
        Then In register other org page "Apply for an organisation to manage civil, family and tribunal cases", I validate fields displayed
            | field                                                       |
            | Before you start                                            |
            | I've checked whether my organisation already has an account |

        When In register other org page "Apply for an organisation to manage civil, family and tribunal cases", I input values
            | field                                                       | value |
            | I've checked whether my organisation already has an account | Yes   |
        When I click start button in before you start page

        Then I am on register other org page "What type of organisation are you registering?"
        When In register other org page "What type of organisation are you registering?", I input values
            | field                           | value     |
            | Select the type of organisation | Solicitor |

        When I click continue in register other org workflow

        Then I am on register other org page "What is your company name and Companies House number?"
        When In register other org page "What is your company name and Companies House number?", I input values
            | field                              | value                  |
            | Enter the name of the organisation | Auto test organisation |
        When I click continue in register other org workflow


        Then I am on register other org page "What is the registered address of your organisation?"
        When In register other org page "What is the registered address of your organisation?", I input values
            | field                       | value |
            | I can't enter a UK postcode |       |
        # When I click continue in register other org workflow

        Then I am on register other org page "Is this a UK address?"
        When In register other org page "Is this a UK address?", I input values
            | field                 | value         |
            | Is this a UK address? | No            |
            | Building and Street   | auto building |
            | Town or City          | auto city     |
            | Country               | Ireland       |
        When I click continue in register other org workflow

        Then I am on register other org page "Do you have a document exchange reference for your main office?"
        When In register other org page "Do you have a document exchange reference for your main office?", I input values
            | field                                                           | value |
            | Do you have a document exchange reference for your main office? | No    |
        When I click continue in register other org workflow


        Then I am on register other org page "Who is your organisation registered with?"
        When In register other org page "Who is your organisation registered with?", I input values
            | field                                         | value                                |
            | Select the type of regulatory organisation    | Solicitor Regulation Authority (SRA) |
            | Enter your organisation's registration number | 12345678                             |

        When I click continue in register other org workflow

        Then I am on register other org page "Which services will your organisation need to access?"
        When In register other org page "Which services will your organisation need to access?", I input values
            | field                                                 | value           |
            | Which services will your organisation need to access? | Divorce,Damages |


        When I click continue in register other org workflow


        Then I am on register other org page "Does your organisation have a payment by account number?"
        When In register other org page "Does your organisation have a payment by account number?", I input values
            | field                                                    | value |
            | Does your organisation have a payment by account number? | No    |
        When I click continue in register other org workflow


        Then I am on register other org page "Provide your contact details"
        When In register other org page "Provide your contact details", I input values
            | field                         | value                    |
            | First name                    | auto test fn             |
            | Last name                     | auto test ln             |
            | Enter your work email address | auto_test_email@test.com |
        When I click continue in register other org workflow


        Then I am on register other org page "Are you (as an individual) registered with a regulator?"
        When In register other org page "Are you (as an individual) registered with a regulator?", I input values
            | field                                                   | value |
            | Are you (as an individual) registered with a regulator? | No    |
        When I click continue in register other org workflow


        Then I am on register other org page "Check your answers before you register"
        Then In register other org workflow, I validate check your answers displayed
            | field                        | value                                              |
            | Organisation type            | Solicitor                                          |
            | Organisation name            | Auto test organisation                             |
            | Organisation address         | auto building,auto city,Irelan                     |
            | Service to access            | Divorce,Damages                                    |
            | Regulatory organisation type | Solicitor Regulation Authority (SRA) ref: 12345678 |
            | First name(s)                | auto test fn                                       |
            | Last name                    | auto test ln                                       |
            | Email address                | auto_test_email@test.com                           |

        Then In register other org workflow, I validate check your answers not displays fields
            | field        |
            | DX reference |
            | DX number    |

