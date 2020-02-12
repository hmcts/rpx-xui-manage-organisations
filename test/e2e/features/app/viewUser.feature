 @fullFunctional
Feature: view user workflow


  Scenario: view user workflow
    When I navigate to manage organisation Url
    Given I am logged into manage organisation with ManageOrg user details
    Then I should be redirected to manage organisation dashboard page
    When I click on user button
    Then I should be on display the user details
    # Then I should see all user details displayed in table
