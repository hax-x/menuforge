# Menu Forge Documentaion

## Authentication Logic
I am using supabase for authentication (email-password signup/signin and google signin)

## Routing Logic in the App
I am using Next.js for routing. 

**1. Public Routes**
- These routes are accessible to all users.
- Landing Page, Sign-in, Sign-up, and restaurant pages will be public.


**2. Protected Routes**
- Protected routes require the user to be authenticated.
- The getUser function is used to check if a user is logged in. If not, the user is redirected to /sign-in.
- user and restaurant dashboards will be protected.

**3. Redirection Logic**
- Handles redirection after successful authentication.
- Either use the getUser function in each page (redirect if null), or use middleware to set global protected routes (for example, protect everything starting with /dashboard which will include /dashboard/userId and /dashboard/slug). 


## done

- routing for dashboard, restboard and consumer sites done

## next to be done

- fix the signup signin pages.
- design dashboard, restboard, consumer site templates