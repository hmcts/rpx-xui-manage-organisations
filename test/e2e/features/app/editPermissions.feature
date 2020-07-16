@fullFunctional
Feature: edit permissions and suspend user workflow

  Background:
    When I navigate to manage organisation Url
    Given I am logged into Townley Services Org
    Then I should be redirected to manage organisation dashboard page


  Scenario: Verify the Edit permission and Suspend User showing for Active Users
    When I click on user button
    Then I should be on display the user details
    Then I click on a Active User
    Then I see change link and suspend button

  @all
  Scenario: Change the permissions for Active Users
    When I click on user button
    Then I should be on display the user details
    Then I click on a Active User
    Then I see change link and suspend button
    Then I click on change link
    Then I edit the Manage User checkbox and click submit


  Scenario: Change the permissions for Active Users
    When I click on user button
    Then I should be on display the user details
    Then I click on a Active User
    Then I see change link and suspend button
    Then I click the suspend button
    Then I see the suspend user page

