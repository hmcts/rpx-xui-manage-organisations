
Feature: invite user workflow

  Background:
    When I navigate to manage organisation Url
    Given I am logged into manage organisation with SSCS judge details
    Then I should be redirected to manage organisation dashboard page
    When I click on user button
    Then I should be on display the user details
    When I click on invite user button
    Then I should be on display invite user page



  Scenario: invite user workflow
    When I enter mandatory fields firstname,lastname,emailaddress,permissions and click on send invitation button
    Then user should be created successfuly

  Scenario: invite user validation workflow
    When I not enter the mandatory fields firstname,lastname,emailaddress,permissions and click on send invitation button
    Then I should be display the validation error


  Scenario: back button workflow
    When I click on back button
    Then I should be on display the user details
