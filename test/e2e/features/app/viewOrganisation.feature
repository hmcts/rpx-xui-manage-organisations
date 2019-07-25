@smoke
Feature: view organisation workflow

  Background:
    When I navigate to manage organisation Url
    Given I am logged into manage organisation with SSCS judge details
    Then I should be redirected to manage organisation dashboard page


  Scenario: view organisation workflow
    When I click on organisation button
    Then I should be on display the name and address details of organisation
