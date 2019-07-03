
@login
Feature: Login

  @all @smoke @crossbrowser
  Scenario:
    When I navigate to EUI Manage Organisation Url
    Then I land on register organisation page and continue
    Then I Enter the Organization name
    Then I Enter the Office Address details
    Then I Enter the PBA1 details
    Then I Enter the DX Reference details
    Then I Select and Enter the SRA number
    Then I Enter the User name
    Then I Enter the Email Address
    Then I land on the summary page and check submit
