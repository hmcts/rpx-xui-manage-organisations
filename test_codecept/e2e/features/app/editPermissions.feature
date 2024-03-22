@fullFunctional
Feature: edit permissions and suspend user workflow

  # Each test below has a comment explaining the current situation
  # Tests will need to be commented/uncommented in line with backend api releases

  Background:
    When I navigate to manage organisation Url
    Given I am logged into Townley Services Org
    Then I should be redirected to manage organisation dashboard page

  # TEST 1: This test has been reverted to the original
  @Flaky
  Scenario: Verify the Edit permission and Suspend User showing for Active Users
    When I click on user button
    Then I should be on display the user details
    Then I click on First Active User
    Then I see change link and suspend button

  # TEST 2: This test has been reverted to the original
  @Flaky
  Scenario: Change the permissions for Active Users
    When I click on user button
    Then I should be on display the user details
    Then I click on First Active User
    Then I see change link and suspend button
    Then I click the suspend button
    Then I see the suspend user page

  # TEST 3: This test can replace test 1 once the 'OGD Beta Users' Launch Darkly Segment is amended to serve 'Enabled'
  @Flaky @Ignore
  Scenario: Verify the Edit permission and Suspend User showing for Active Users
    When I click on user button
    Then I should be on display the user details
    Then I click on a Active User
    Then I see change link and suspend button

  # TEST 4: This test can replace TEST 2 once the 'OGD Beta Users' Launch Darkly Segment is amended to serve 'Enabled'
  @Flaky @Ignore
  Scenario: Change the permissions for Active Users
    When I click on user button
    Then I should be on display the user details
    Then I click on a Active User by using Active filter
    Then I see change link and suspend button
    Then I click the suspend button
    Then I see the suspend user page

  # TEST 5: This test has never been enabled on the pipeline
  # @all
  # Scenario: Change the permissions for Active Users
  #   When I click on user button
  #   Then I should be on display the user details
  #   Then I click on a Active User
  #   Then I see change link and suspend button
  #   Then I click on change link
  #   Then I edit the Manage User checkbox and click submit
