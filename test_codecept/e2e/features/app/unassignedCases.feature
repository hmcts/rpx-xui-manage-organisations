

Feature: Unassigned cases tab

    Scenario: page validation
        When I navigate to manage organisation Url
        Given I am logged into Townley Services Org

        Then I should be redirected to manage organisation dashboard page
        When I click on Unassigned cases tab
        Then I should be on display Unassigned cases page