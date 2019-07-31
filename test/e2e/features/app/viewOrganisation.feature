Feature: view organisation workflow
  Scenario: view organisation workflow
    When I navigate to manage organisation Url
    Given I am logged into manage organisation with SSCS judge details
    Then I should be redirected to manage organisation dashboard page
    And I should be on display the name and address details of organisation
