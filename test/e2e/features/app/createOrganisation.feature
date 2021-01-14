
Feature: Register Organization

  Background:
    # When I navigate to manage organisation Url
#    Given I am logged into manage organisation with SSCS judge details
#    Then I should be redirected to manage organisation dashboard page
    When I navigate to EUI Manage Organisation Url
    Then I land on register organisation page and continue

  Scenario:register organization
    When I am on page "What's the name of your organisation?" in registration step
    Then I Enter the Organization name
    When I am on page "What's the address of your main office?" in registration step
    Then I Enter the Office Address details
    When I am on page "What's your payment by account (PBA) number for your organisation?" in registration step
    Then I Enter the PBA1 and PBA2 details
    When I am on page "Do you have a DX reference for your main office?" in registration step
    Then I Enter the DX Reference details
    When I am on page "Do you have an organisation SRA ID?" in registration step
    Then I Select and Enter the SRA number
    When I am on page "What's your name?" in registration step
    Then I Enter the firstName and lastName
    When I am on page "What's your email address?" in registration step
    Then I Enter the Email Address
    When I am on page "Check your answers before you register" in registration step
    Then I land on the summary page and check submit
    Then I created the organisation successfully

  @fullFunctional
  Scenario:email address validation
    When I am on page "What's the name of your organisation?" in registration step
    Then I Enter the Organization name
    When I am on page "What's the address of your main office?" in registration step
    Then I Enter the Office Address details
    When I am on page "What's your payment by account (PBA) number for your organisation?" in registration step
    Then I Enter the PBA1 and PBA2 details
    When I am on page "Do you have a DX reference for your main office?" in registration step
    Then I Enter the DX Reference details
    When I am on page "Do you have an organisation SRA ID?" in registration step
    Then I Select and Enter the SRA number
    When I am on page "What's your name?" in registration step
    Then I Enter the firstName and lastName
    When I am on page "What's your email address?" in registration step
    When I am not entered the email address
    Then I should be display email error

  @fullFunctional
  Scenario:organisation name validation
    When I am on page "What's the name of your organisation?" in registration step
    When I am not entered Organization name
    Then I should be display organization error

  @fullFunctional
  Scenario:office address validation
    When I am on page "What's the name of your organisation?" in registration step
    Then I Enter the Organization name
    When I am on page "What's the address of your main office?" in registration step
    When I am not entered the Office Address details
    Then I should be display Office Address error

  @fullFunctional
  Scenario:SRA validation
    When I am on page "What's the name of your organisation?" in registration step
    Then I Enter the Organization name
    When I am on page "What's the address of your main office?" in registration step
    Then I Enter the Office Address details
    When I am on page "What's your payment by account (PBA) number for your organisation?" in registration step
    Then I Enter the PBA1 and PBA2 details
    When I am on page "Do you have a DX reference for your main office?" in registration step
    Then I Enter the DX Reference details
    When I am on page "Do you have an organisation SRA ID?" in registration step
    When I am not entered SRA number
    Then I should be display SRA error

  @fullFunctional
  Scenario:PBA validation
    When I am on page "What's the name of your organisation?" in registration step
    Then I Enter the Organization name
    When I am on page "What's the address of your main office?" in registration step
    Then I Enter the Office Address details
    When I am on page "What's your payment by account (PBA) number for your organisation?" in registration step
    Then I Enter the invalid PBA1 and PBA2 details
    Then I should be display PBA error

  @fullFunctional
  Scenario:first name and last name validation
    When I am on page "What's the name of your organisation?" in registration step
    Then I Enter the Organization name
    When I am on page "What's the address of your main office?" in registration step
    Then I Enter the Office Address details
    When I am on page "What's your payment by account (PBA) number for your organisation?" in registration step
    Then I Enter the PBA1 and PBA2 details
    When I am on page "Do you have a DX reference for your main office?" in registration step
    Then I Enter the DX Reference details
    When I am on page "Do you have an organisation SRA ID?" in registration step
    Then I Select and Enter the SRA number
    When I am on page "What's your name?" in registration step
    When I am not entered the firstName and lastName
    Then I should be display firstName and lastName error

  @fullFunctional @all
  Scenario: Register Organisation first page Content/info for already registered org user
    When I am on page "What's the name of your organisation?" in registration step
    When I click back link in register org workflow
    Then I am on Register organisation start page
    Then I see content header already registered account
    Then I see manage cases link under already registered account header
    Then I see manage org link under already registered account header

  @fullFunctional @all
  Scenario: Register Organisation first page links to MC and MO
    When I am on page "What's the name of your organisation?" in registration step
    When I click back link in register org workflow
    Then I am on Register organisation start page
    Then I see content header already registered account
    Then I see manage cases link under already registered account header
    Then I see manage org link under already registered account header
    Then I click and validate MC link opens in new tab
    Then I click and validate MO link opens in new tab

