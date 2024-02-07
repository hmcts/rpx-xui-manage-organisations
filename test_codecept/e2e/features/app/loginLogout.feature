@all @fullFunctional  
Feature: Login

  Background:
    When I navigate to manage organisation Url
    
@preview_only @ignore
  Scenario: login and log out from manage organisation as ManageOrg user
    Given I am logged into Townley Services Org
    Then I should be redirected to manage organisation dashboard page
    When I select the sign out link
    Then I should be redirected to the Idam login page

@AAT_only
  Scenario: Verify the direct link navigate to login page
    Given I navigate to manage organisation Url direct link
    Then I should be redirected back to Login page after direct link
