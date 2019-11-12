
Feature: register organization

  Background:
    # When I navigate to manage organisation Url
#    Given I am logged into manage organisation with SSCS judge details
#    Then I should be redirected to manage organisation dashboard page
    When I navigate to EUI Manage Organisation Url
    Then I land on register organisation page and continue

 @all
  Scenario:register organization
    Then I Enter the Organization name
    Then I Enter the Office Address details
    Then I Enter the PBA1 and PBA2 details
    Then I Enter the DX Reference details
    Then I Select and Enter the SRA number
    Then I Enter the firstName and lastName
    Then I Enter the Email Address
    Then I land on the summary page and check submit
    Then I created the organisation successfully

  @all
  Scenario:email address validation
    Then I Enter the Organization name
    Then I Enter the Office Address details
    Then I Enter the PBA1 and PBA2 details
    Then I Enter the DX Reference details
    Then I Select and Enter the SRA number
    Then I Enter the firstName and lastName
    When I am not entered the email address
    Then I should be display email error

  @all
  Scenario:organisation name validation
    When I am not entered Organization name
    Then I should be display organization error

  @all
  Scenario:office address validation
    Then I Enter the Organization name
    When I am not entered the Office Address details
    Then I should be display Office Address error

  @all
  Scenario:SRA validation
    Then I Enter the Organization name
    Then I Enter the Office Address details
    Then I Enter the PBA1 and PBA2 details
    Then I Enter the DX Reference details
    When I am not entered SRA number
    Then I should be display SRA error

  @all
  Scenario:PBA validation
    Then I Enter the Organization name
    Then I Enter the Office Address details
    Then I Enter the invalid PBA1 and PBA2 details
    Then I should be display PBA error

  @all
  Scenario:first name and last name validation
    Then I Enter the Organization name
    Then I Enter the Office Address details
    Then I Enter the PBA1 and PBA2 details
    Then I Enter the DX Reference details
    Then I Select and Enter the SRA number
    When I am not entered the firstName and lastName
    Then I should be display firstName and lastName error
