@fullFunctional
Feature: invite user workflow

  Background:
    When I navigate to manage organisation Url
    Given I am logged into manage organisation with ManageOrg user details
    Then I should be redirected to manage organisation dashboard page
    When I click on user button
    Then I should be on display the user details
    When I click on invite user button
    Then I should be on display invite user page

 @all @crossbrowser
  Scenario: invite user workflow
    When I enter mandatory fields firstname,lastname,emailaddress,permissions and click on send invitation button
    Then user should be created successfuly
   
   
  @crossbrowser
  Scenario: invited use with Manage Org and Users permission
    When I enter mandatory fields firstname,lastname,emailaddress with permissions and click on send invitation button
      |Permission|
      |Manage Users|
      | Manage Organisation |
      # | Manage fee accounts |
    Then user should be created successfuly
    When I activate invited user 
    When I click on user button
    Then I should be on display the user details
    Then I should see invited user is listed in users table
    Then I select the sign out link
    Then I login with latest invited user
    Then I should be redirected to manage organisation dashboard page
    Then I should see navigation tab in header
      | NavigationTab|
      |Organisation|
      |Users|

  @crossbrowser
  Scenario: Invite user with Mnage Org permission
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
    Then I should be redirected to manage organisation dashboard page
    Then I should see navigation tab in header
      | NavigationTab |
      | Organisation   |

  @crossbrowser
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
    Then I should be redirected to manage organisation dashboard page
    Then I should see navigation tab in header
      | NavigationTab |
      | Users         |

  @fullFunctional  
  Scenario: invite user validation workflow
    When I not enter the mandatory fields firstname,lastname,emailaddress,permissions and click on send invitation button
    Then I should be display the validation error

  @fullFunctional
  Scenario: back button workflow
    When I click on back button
    Then I should be on display the user details

