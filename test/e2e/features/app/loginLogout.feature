@smoke
Feature: Login

  Background:
    Given I am on idam login page

    Scenario Outline: un-authenticated user login
      When I enter an invalid email address <emailAddress> or invalid password <password> and click on login button
      Then I should be redirected to the idam login page with failure error summary
      Examples:
        |emailAddress|password|
        |abc@gmail.com|test|



    Scenario Outline: login and log out for manage organisation ui
      When I enter an email address <emailAddress> and password <password> and click on login button
      Then I should be redirected to manage organisation page
      When I click on the sign out link
      Then I should be redirected to the idam login page
      Examples:
      |emailAddress|password|
      |puisuperuser@mailnesia.com|Monday01|


