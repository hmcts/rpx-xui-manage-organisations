@ng @fullFunctional
Feature: Unassigned cases Tab
    Background: Mock and browser setup
        Given I init MockApp


    Scenario: Filter button

        Given I set MOCK with user roles
            | roles | pui-org-manager,task-supervisor,case-allocator |

        Then I should be redirected to manage organisation dashboard page
        When I click on Unassigned cases tab
        Then I should be on display Unassigned cases page
        Then In unassigned cases page, filter button "Show unassigned cases filter" is displayed
        Then In unassigned cases page, filter button "Hide unassigned cases filter" is not displayed
        When In unassigned cases page, I click filter button "Show unassigned cases filter"
        Then In unassigned cases page, filter button "Hide unassigned cases filter" is displayed
        Then In unassigned cases page, filter button "Show unassigned cases filter" is not displayed
        When In unassigned cases page, I click filter button "Hide unassigned cases filter"
        Then In unassigned cases page, filter button "Show unassigned cases filter" is displayed
        Then In unassigned cases page, filter button "Hide unassigned cases filter" is not displayed



    Scenario: Filter container validation

        Given I set MOCK with user roles
            | roles | pui-org-manager,task-supervisor,case-allocator |

        Then I should be redirected to manage organisation dashboard page
        When I click on Unassigned cases tab
        Then I should be on display Unassigned cases page
        Then In unassigned cases page, filter button "Show unassigned cases filter" is displayed
        Then In unassigned cases page, filter button "Hide unassigned cases filter" is not displayed
        When In unassigned cases page, I click filter button "Show unassigned cases filter"
        Then In unassigned cases page, filter button "Hide unassigned cases filter" is displayed
        Then In unassigned cases page, filter button "Show unassigned cases filter" is not displayed
        When In unassigned cases page, I click apply filter button
        Then In unassigned cases page, I see error summary displayed
        Then In unassigned cases page, I see error message "Enter a valid HMCTS case reference number"

    Scenario: Case types and case list container
        Given I set MOCK with user roles
            | roles | pui-org-manager,task-supervisor,case-allocator |
        Then I should be redirected to manage organisation dashboard page
        When I click on Unassigned cases tab
        Then I should be on display Unassigned cases page
        When In unassigned cases page, I click case type tab "Asylum"
        Then In unassigned cases page, I see case type cases container "Asylum"
        When In unassigned cases page, I click case type tab "Immigration"
        Then In unassigned cases page, I see case type cases container "Immigration"
        Then In unassigned cases page, I see case list displays value
            | field          | value            |
            | Case Reference | 1234567812345671 |
            | Case Number    | 6042070/2023     |
            | Claimant       | Grayson Becker   |


    Scenario: Share case button state
        Given I set MOCK with user roles
            | roles | pui-org-manager,task-supervisor,case-allocator |
        Then I should be redirected to manage organisation dashboard page
        When I click on Unassigned cases tab
        Then I should be on display Unassigned cases page
        When In unassigned cases page, I click case type tab "Asylum"
        Then In unassigned cases page, I see case type cases container "Asylum"
        Then In unassigned cases page, I see share case button disabled
        When In unassigned cases page, I select case with id "1234567812345671"
        Then In unassigned cases page, I see share case button enabled


    Scenario: Share case scenario 1
        Given I set MOCK with user roles
            | roles | pui-org-manager,task-supervisor,case-allocator |
        Then I should be redirected to manage organisation dashboard page
        When I click on Unassigned cases tab
        Then I should be on display Unassigned cases page
        When In unassigned cases page, I click case type tab "Asylum"
        Then In unassigned cases page, I see case type cases container "Asylum"
        Then In unassigned cases page, I see share case button disabled
        When In unassigned cases page, I select case with id "1234567812345671"
        When In unassigned cases page, I select case with id "1234567812345672"

        Then In unassigned cases page, I see share case button enabled

        When In unassigned cases page, I click share case button
        Then I see share case page
        Then In share case page, I see case with id "1234567812345671" listed
        Then In share case page, I see case with id "1234567812345672" listed

        Then In share case page, I see email address input field
        When In share case page, I input email address "pet"
        When In share case page, I select user "Pet Solicitor 2" from results
        When In share case page, I click Add user button

        Then In share case page, I validate users for case id "1234567812345671"
            | Name | Action | Status |
            | Pet Solicitor 2 |  Cancel| TO BE ADDED  |

        Then In share case page, I validate users for case id "1234567812345672"
            | Name            | Action | Status      |
            | Pet Solicitor 2 | Cancel | TO BE ADDED |

        When In share case page, I click cancel for user "Pet Solicitor 2" in case "1234567812345671"
        Then In share case page, I validate user "Pet Solicitor 2" not displayed for case id "1234567812345671"

        Then In share case page, I validate users for case id "1234567812345672"
            | Name            | Action | Status      |
            | Pet Solicitor 2 | Cancel | TO BE ADDED |

        When In share case page, I click continue

        Then I see Share case check and confirm your selection page
        Then I see Share case check and confirm your selection page with header "Check and confirm your selection"
        Then In share case CYA page, case "1234567812345672" displays users
            | Name            | Email | Actions      |
            | Pet Solicitor 2 | div-petsol-2@mailinator.com | TO BE ADDED |
        When In Share case CYA page, I click Confirm button
        Then In share case workflow, I see share case confirmation
        Then In share case workflow, I see cinfirmation message "Your selected cases have been updated"


    Scenario: Share case scenario 2
        Given I set MOCK with user roles
            | roles | pui-org-manager,task-supervisor,case-allocator |
        Then I should be redirected to manage organisation dashboard page
        When I click on Unassigned cases tab
        Then I should be on display Unassigned cases page
        When In unassigned cases page, I click case type tab "Asylum"
        Then In unassigned cases page, I see case type cases container "Asylum"
        Then In unassigned cases page, I see share case button disabled
        When In unassigned cases page, I select case with id "1234567812345671"
        When In unassigned cases page, I select case with id "1234567812345672"

        Then In unassigned cases page, I see share case button enabled

        When In unassigned cases page, I click share case button

        # Then I sleep for sec 300

        Then I see share case page
        Then In share case page, I see case with id "1234567812345671" listed
        Then In share case page, I see case with id "1234567812345672" listed

        Then In share case page, I see email address input field
        When In share case page, I input email address "pet"
        When In share case page, I select user "Pet Solicitor 2" from results
        When In share case page, I click Add user button

        Then In share case page, I validate users for case id "1234567812345671"
            | Name            | Action | Status      |
            | Pet Solicitor 2 | Cancel | TO BE ADDED |

        Then In share case page, I validate users for case id "1234567812345672"
            | Name            | Action | Status      |
            | Pet Solicitor 2 | Cancel | TO BE ADDED |


        When In share case page, I click continue

        Then I see Share case check and confirm your selection page
        Then I see Share case check and confirm your selection page with header "Check and confirm your selection"
        Then In share case CYA page, case "1234567812345671" displays users
            | Name            | Email                       | Actions     |
            | Pet Solicitor 2 | div-petsol-2@mailinator.com | TO BE ADDED |
        Then In share case CYA page, case "1234567812345672" displays users
            | Name            | Email                       | Actions     |
            | Pet Solicitor 2 | div-petsol-2@mailinator.com | TO BE ADDED |
        When In Share case CYA page, I click Confirm button
        Then In share case workflow, I see share case confirmation
        Then In share case workflow, I see cinfirmation message "Your selected cases have been updated"
