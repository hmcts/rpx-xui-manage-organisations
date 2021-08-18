@unreleased @featureoff
Feature: Accept Terms and Conditions

Background: background setup

    When I navigate to manage organisation Url
    Given I am logged into manage organisation to invite users

    Then I should be redirected to manage organisation dashboard page
    When I navigate to invite user page
    Then I should be on display invite user page
    When I enter mandatory fields firstname,lastname,emailaddress with permissions and click on send invitation button
        | Permission          |
        | Manage Users        |
        | Manage Organisation |
        | Manage Cases        |
    Then user should be created successfuly
    When I activate invited user
    Then I select the sign out link

Scenario: New User first time loggged in presented with Accept Terms and Consitions page
    Then I login with latest invited user
    Then I am on Accept Terms and Conditions page
