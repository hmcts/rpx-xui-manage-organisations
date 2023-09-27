Feature: Register org with org types


    Scenario: Register Solicitor org types
        Given I navigate to register org start page


        Then In registration workflow, I validate page "" is displayed ""
        Then In registration workflow, I validate page ""

        When In registration workflow, I enter details in page ""
            | field 1 | 2 |
            | field 2 |   |

        When I registration workflow, I click continue
        When I registration workflow, I click previous
        When I registration workflow, I click cancel
        When I registration workflow, I click back


    Scenario: REgister non solicior org types

    Scenario: Register other org types

    Scenario: Register org workflow pages validations
        Given I navigate to register org start page
        Then I see regsiatration start page displayed
        Then I validate registration start page


