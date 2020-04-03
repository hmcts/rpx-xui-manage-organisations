@fullFunctional
Feature: Accept Terms and Conditions

Background: Invite a user
    Given I create test read write organisation
    Given I approve test read write  organisation
    Given I activate test read write approved organisation super user

    When I navigate to manage organisation Url
    Given I am logged into manage organisation with test org user

    Then I should be redirected to manage organisation dashboard page
    When I click on user button
    Then I should be on display the user details
    When I click on invite user button
    Then I should be on display invite user page
    When I enter mandatory fields firstname,lastname,emailaddress with permissions and click on send invitation button
        | Permission          |
        | Manage Users        |
        | Manage Organisation |
        | Manage Cases        |
    Then user should be created successfuly
    When I activate invited user
    When I click on user button
    Then I should be on display the user details
    Then I should see invited user is listed in users table
    Then I select the sign out link

Scenario: New User first time loggged in presented with Accept Terms and Consitions page
    Then I login with latest invited user
    Then I am on Accept Terms and Conditions page


Scenario: New user cannot procced to use application without accepting T&C's
    Then I login with latest invited user
    Then I am on Accept Terms and Conditions page
    Then I select the sign out link
    Then I login with latest invited user
    Then I am on Accept Terms and Conditions page


Scenario: New user Accepting T&C's should not be presented with Accept T&C's page on future logins
    Then I login with latest invited user
    Then I am on Accept Terms and Conditions page
    When I click Confirm in Accept Terms and Conditions page
    Then I should be redirected to manage organisation dashboard page
    Then I select the sign out link
    Then I login with latest invited user
    Then I should be redirected to manage organisation dashboard page

