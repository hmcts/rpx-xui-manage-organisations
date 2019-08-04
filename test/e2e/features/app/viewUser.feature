
Feature: view user workflow

  Scenario: view user workflow
    When I navigate to manage organisation Url
    Given I am logged into manage organisation with SSCS judge details
    Then I should be redirected to manage organisation dashboard page
    When I click on user button
    Then I should be on display the user details
