# Manual Testing Log

This file documents how we manually test StudyBuddy. It does not appear on the
website.

## Test Cases

| ID | Test | Steps | Expected result |
|----|------|-------|-----------------|
| TC-1 | Dashboard blocked when signed out | Open `/dashboard` without signing in | Redirected to the login page (`/auth`) |
| TC-2 | Successful login | Enter the test account's email and password, click sign in | Dashboard opens and shows the account's email |
| TC-3 | Incorrect password | Enter the test email with a wrong password | An error message appears and you stay on the login page |
| TC-4 | Incorrect email | Enter an email that has no account | An error message appears and you stay on the login page |
| TC-5 | Empty fields | Click sign in with both fields empty | The form does not sign you in |
| TC-6 | Logout | Click the logout button on the dashboard | Returned to the login page |
| TC-7 | Dashboard blocked after logout | After logging out, open `/dashboard` again | Redirected to the login page |

# Future Testing...
