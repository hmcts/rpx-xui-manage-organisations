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
    When I activate invited user
    When I click on user button
    Then I should be on display the user details
    Then I should see invited user is listed in users table
    Then I select the sign out link
    Then I login with latest invited user
    Then I am on Accept Terms and Conditions page
    When I click Confirm in Accept Terms and Conditions page
    Then I should be redirected to manage organisation dashboard page
    Then I should see navigation tab in header
      | NavigationTab|
      |Organisation|
      |Users|
    Then I see login to MC with invited user is "success"


  Scenario: Invite user with Manage Org permission

    When I enter mandatory fields firstname,lastname,emailaddress with permissions and click on send invitation button
      | Permission          |
      | Manage Organisation |
      # | Manage fee accounts |
    Then user should be created successfuly
    When I activate invited user
    When I click on user button
    Then I should be on display the user details
    Then I should see invited user is listed in users table
    Then I select the sign out link
    Then I login with latest invited user
    Then I am on Accept Terms and Conditions page
    When I click Confirm in Accept Terms and Conditions page
    Then I should be redirected to manage organisation dashboard page
    Then I should see navigation tab in header
      | NavigationTab |
      | Organisation   |
    Then I see login to MC with invited user is "failed"


  Scenario: invited use with Manage Users permission
    When I enter mandatory fields firstname,lastname,emailaddress with permissions and click on send invitation button
      | Permission          |
      | Manage Users        |
    # | Manage fee accounts |
    Then user should be created successfuly
    When I activate invited user
    When I click on user button
    Then I should be on display the user details
    Then I should see invited user is listed in users table
    Then I select the sign out link
    Then I login with latest invited user
    Then I am on Accept Terms and Conditions page
    When I click Confirm in Accept Terms and Conditions page
    Then I should be redirected to manage organisation dashboard page
    Then I should see navigation tab in header
      | NavigationTab |
      | Users         |
    Then I see login to MC with invited user is "failed"

  @fullFunctional
  Scenario: invite user validation workflow
    When I not enter the mandatory fields firstname,lastname,emailaddress,permissions and click on send invitation button
    Then I should be display the validation error

  @fullFunctional
  Scenario: back button workflow
    When I click on back button
    Then I should be on display the user details

