@end2end
Feature: End to End Create approve and manager org

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


        When I approve organisation

        When I activate approved organisation super user


        When I navigate to manage organisation Url
        Given I am logged in to created approve organisation
        Then I should be redirected to manage organisation dashboard page
        Then I should see name and address details of Organisation

        When I click on user button
        Then I should be on display the user details
        When I click on invite user button
        Then I should be on display invite user page


        When I enter mandatory fields firstname,lastname,emailaddress with permissions and click on send invitation button
            | Permission          |
            | Manage Users        |
            | Manage Organisation |
        # | Manage fee accounts |
        Then user should be created successfuly
        When I activate invited user
        When I click on user button
        Then I should be on display the user details
        Then I should see invited user is listed in users table
        Then I select the sign out link
        Then I login with latest invited user
        Then I should be redirected to manage organisation dashboard page
        Then I should see navigation tab in header
            | NavigationTab |
            | Organisation  |
            | Users         |





