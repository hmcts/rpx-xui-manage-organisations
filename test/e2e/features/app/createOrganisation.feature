
Feature: register organization

  Background:
    When I navigate to manage organisation Url
    Given I am logged into manage organisation with SSCS judge details
    Then I should be redirected to manage organisation dashboard page
    When I navigate to EUI Manage Organisation Url
    Then I land on register organisation page and continue
  @smoke
  Scenario:register organization
    Then I Enter the Organization name
    Then I Enter the Office Address details
    Then I Enter the PBA1 details
    Then I Enter the DX Reference details
    Then I Select and Enter the SRA number
    Then I Enter the User name
    Then I Enter the Email Address
    Then I land on the summary page and check submit

  Scenario:organisation name validation
    When I am not entered Organization name
    Then I should be display organization error

  Scenario:office address validation
    Then I Enter the Organization name
    When I am not entered the Office Address details
    Then I should be display Office Address error

  Scenario:PBA validation
    Then I Enter the Organization name
    Then I Enter the Office Address details
    When I am not entered the PBA details
    Then I should be display PBA error
