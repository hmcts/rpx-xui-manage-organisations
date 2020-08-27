@smoke
Feature: Smoke tests

   Tests to validate if app is up and reachable adfter deployment

    Scenario: Validate app is up and redirects to IDAM login page
        When I navigate to manage organisation Url
        Then I am on Idam login page

    Scenario: Validate Register Org URL is up and accesible 
        When I navigate to EUI Register Organisation Url
        Then I land on register organisation page and continue