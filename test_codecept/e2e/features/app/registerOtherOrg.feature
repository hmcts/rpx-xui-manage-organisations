
@fullFunctional @functional_debug
Feature: Register other org

    Scenario: register other org workflow
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
            | field                           | value                  |
            | Select the type of organisation | Solicitor Organisation |

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
            | field                 | value |
            | Is this a UK address? | Yes   |
            | Building and Street   |   auto building    |
            | Address line 2        |    auto addr 2   |
            | Address line 3        |    auto addr 3   |
            | Town or City          |   auto city    |
            | County                |   auto country    |
            | Postcode              |  AU12TOT     |
        When I click continue in register other org workflow

        Then I am on register other org page "Do you have a document exchange reference for your main office?"
        When In register other org page "Do you have a document exchange reference for your main office?", I input values
            | field                 | value         |
            | Do you have a document exchange reference for your main office? | Yes |
        When I click continue in register other org workflow

        Then I am on register other org page "What's the DX reference for this office?"
        When In register other org page "What's the DX reference for this office?", I input values
            | field                                                           | value |
            | DX number | DX12345 |
            | DX exchange | HAYES (MIDDLESEX) |
        When I click continue in register other org workflow


        Then I am on register other org page "Who is your organisation registered with?"
        When In register other org page "Who is your organisation registered with?", I input values
            | field       | value             |
            | Select the type of regulatory organisation | Other |
            | Enter the name of the professional body or regulator | test name |
            | Enter your organisation's registration number | test number |

        When I click continue in register other org workflow

        Then I am on register other org page "Which services will your organisation need to access?"
        When In register other org page "Which services will your organisation need to access?", I input values
            | field                                                | value       |
            | Which services will your organisation need to access? | Civil, Divorce,Probate |


        When I click continue in register other org workflow


        Then I am on register other org page "Does your organisation have a payment by account number?"
        When In register other org page "Does your organisation have a payment by account number?", I input values
            | field                                                 | value                  |
            | Does your organisation have a payment by account number? | Yes |
        When I click continue in register other org workflow


        Then I am on register other org page "What PBA numbers does your organisation use?"
        When In register other org page "What PBA numbers does your organisation use?", I input values
            | field                                                    | value |
            | PBA number | PBA1234567,PBA7654321 |
        When I click continue in register other org workflow


        Then I am on register other org page "Provide your contact details"
        When In register other org page "Provide your contact details", I input values
            | field      | value                 |
            | First name | auto test fn |
            | Last name | auto test ln|
            | Enter your work email address | auto_test_email@test.com |
        When I click continue in register other org workflow




