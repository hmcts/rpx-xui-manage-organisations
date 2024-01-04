@fullFunctional @ignore
Feature: Register other org, Navigations

    Background: rgister org fill pages
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

@ignore
    Scenario: workflow with all optional values
        When In register other org work flow, I click back link
        Then I am on register other org page "What regulator are you (as an individual) registered with?"

        When In register other org work flow, I click back link
        Then I am on register other org page "Are you (as an individual) registered with a regulator?"

        When In register other org work flow, I click back link
        Then I am on register other org page "Provide your contact details"

        When In register other org work flow, I click back link
        Then I am on register other org page "What PBA numbers does your organisation use?"

        When In register other org work flow, I click back link
        Then I am on register other org page "Does your organisation have a payment by account number?"

        When In register other org work flow, I click back link
        Then I am on register other org page "Which services will your organisation need to access?"

        When In register other org work flow, I click back link
        Then I am on register other org page "Who is your organisation registered with?"

        When In register other org work flow, I click back link
        Then I am on register other org page "What's the DX reference for this office?"

        When In register other org work flow, I click back link
        Then I am on register other org page "Do you have a document exchange reference for your main office?"

        When In register other org work flow, I click back link
        Then I am on register other org page "Is this a UK address?"

        When In register other org work flow, I click back link
        Then I am on register other org page "What is the registered address of your organisation?"


        When In register other org work flow, I click back link
        Then I am on register other org page "What is your company name and Companies House number?"


        When In register other org work flow, I click back link
        Then I am on register other org page "What type of organisation are you registering?"

        When In register other org work flow, I click back link
        Then I am on register other org page "Apply for an organisation to manage civil, family and tribunal cases"


    Scenario: check your answers, chnage links
        Then In register other org workflow, I validate change links
            | field                                                       | screen                                                     |
            | Organisation type                                           | What type of organisation are you registering?             |
            | Organisation name                                           | What is your company name and Companies House number?      |
            | Company registration number                                 | What is your company name and Companies House number?      |
            | Organisation address                                        | What is the registered address of your organisation?       |
            | DX reference                                                | What's the DX reference for this office?                   |
            | Service to access                                           | Which services will your organisation need to access?      |
            | Does your organisation have a payment by account number? | Does your organisation have a payment by account number? |
            | Regulatory organisation type                                | Who is your organisation registered with?                  |
            | First name(s)                                               | Provide your contact details                               |
            | Last name                                                   | Provide your contact details                               |
            | Email address                                               | Provide your contact details                               |
            | What regulators are you (as an individual) registered with? | What regulator are you (as an individual) registered with? |

    @ignore
    Scenario: check your answers, chnage link and continue
        When In register other org check your answers page, I click change link for field "Organisation type"
        Then I am on register other org page "What type of organisation are you registering?"
        Then In register other org workflow, I validate continue pages
            | page                                                            |
            | What is your company name and Companies House number?           |
            | What is the registered address of your organisation?            |
            | Do you have a document exchange reference for your main office? |
            | What's the DX reference for this office?                        |
            | Who is your organisation registered with?                       |
            | Which services will your organisation need to access?           |
            | Does your organisation have a payment by account number?        |
            | What PBA numbers does your organisation use?                    |
            | Provide your contact details                                    |
            | Are you (as an individual) registered with a regulator?         |
            | What regulator are you (as an individual) registered with?      |
            | Check your answers before you register                          |

