 @crossbrowser
Feature: view organisation workflow
  Scenario: view organisation workflow
    When I navigate to manage organisation Url
    Given I am logged into manage organisation with ManageOrg user details
    Then I should be redirected to manage organisation dashboard page
    Then I should be on display the name and address details of organisation
