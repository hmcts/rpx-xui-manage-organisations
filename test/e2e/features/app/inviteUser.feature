@fullFunctional
Feature: invite user workflow

  Background:
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


  Scenario: invite user workflow
    When I enter mandatory fields firstname,lastname,emailaddress,permissions and click on send invitation button
    Then user should be created successfuly



  Scenario: invited use with Manage Org and Users permission
    When I enter mandatory fields firstname,lastname,emailaddress with permissions and click on send invitation button
      |Permission|
      |Manage Users|
      | Manage Organisation |
      | Manage Cases |
    Then user should be created successfuly

  Scenario: Invite user with Manage Org permission

    When I enter mandatory fields firstname,lastname,emailaddress with permissions and click on send invitation button
      | Permission          |
      | Manage Organisation |
      # | Manage fee accounts |
    Then user should be created successfuly


  Scenario: invited use with Manage Users permission
    When I enter mandatory fields firstname,lastname,emailaddress with permissions and click on send invitation button
      | Permission          |
      | Manage Users        |
    # | Manage fee accounts |
    Then user should be created successfuly

  @fullFunctional
  Scenario: invite user validation workflow
    When I not enter the mandatory fields firstname,lastname,emailaddress,permissions and click on send invitation button
    Then I should be display the validation error

  @fullFunctional
  Scenario: back button workflow
    When I click on back button
    Then I should be on display the user details

