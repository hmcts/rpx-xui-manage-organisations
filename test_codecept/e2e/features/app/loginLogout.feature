@all
Feature: Login

  Background:
    When I navigate to manage organisation Url

#
#  Scenario: Login and Logout as SSCS user
#    Then I login as SSCS user
#    Then I check the user is logged
#    Then I click the signout
#    Then I logout successfully and back to Login page
#
#  Scenario: Login and Logout as FR user
#    Then I login as FR user
#    Then I check the user is logged
#    Then I click the signout
#    Then I logout successfully and back to Login page



  Scenario: un-authenticated user login
    Then I am on Idam login page
    When I enter an Invalid email-address and password to login
    Then I should be redirected to the Idam login page
    Then I should see failure error summary

    
  Scenario: login and log out from manage organisation as ManageOrg user
    Given I am logged into manage organisation with ManageOrg user details
    Then I should be redirected to manage organisation dashboard page
    When I select the sign out link
    Then I should be redirected to the Idam login page


  Scenario: Verify the direct link navigate to login page
    Given I navigate to manage organisation Url direct link
    Then I should be redirected back to Login page after direct link
