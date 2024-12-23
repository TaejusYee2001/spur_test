# Loom Recording
https://www.loom.com/share/c1200f9447a0499f827a638cd10f7b0e?sid=266dc378-7e27-41e4-a29a-0ead079f25d2

# Installation and Setup
### 1. Clone the Repository
Clone the `develop` branch of the repository to your local machine:
```bash
git clone -b develop https://github.com/TaejusYee2001/spur_test.git
cd spur_test
```
### 2. Create a `.env.local` File
Inside the root directory of the project, create a `.env.local` file. Paste the following environment variables into the file: 
```bash
NEXT_PUBLIC_SUPABASE_URL=https://twuuwjaexjrsrkytheru.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dXV3amFleGpyc3JreXRoZXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5MjExMTEsImV4cCI6MjA1MDQ5NzExMX0.VSqeazhEEokjcVYfoPIkqaI4rHFGBjqmA8Tnxp7tESc
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```
The project will be available at `http://localhost:4000` by default

## 5. IMPORTANT: Sign In With My Credentials
```
email: taejusyee@gmail.com
password: 321654
```
Signing in with my credentials is important because newly authenticated users will not have an associated list of test suites to choose from. These test suites have to be given to users which I am currently doing manually. 

## Project File Structure

```plaintext
.
├── app/                             # Main directory for the Next.js App Router and pages.
│   ├── (auth-pages)/                # Directory for authentication-related pages.
│   ├── auth/                        # Authentication routes.
│   ├── protected/                   # Routes and components for authenticated users.
│   │   ├── reset-password/          # Page for resetting user passwords.
│   │   ├── page.tsx                 # Authenticated user lands here; scheduler component is rendered.
├── components/                      # Reusable UI components to keep the code modular and DRY.
│   ├── scheduler.tsx                # Implements calendar schedule component.
│   ├── schedule-test.tsx            # Implements modal component for scheduling a test suite.
├── hooks/                           # Custom React hooks for state management and reusable logic.
│   ├── use-scheduled-tests.ts       # Data fetching for `scheduled_tests` with Tanstack Query.
│   ├── use-test-suites.ts           # Data fetching for `test_suites` with Tanstack Query.
├── lib/                             # Utility functions or configurations used across the project.
├── node_modules/                    # Directory for installed Node.js dependencies (auto-generated).
├── utils/                           # General utility functions and helpers.
│   ├── providers/                   # Context providers for global state and application logic.
│   │   ├── query-client-wrapper.tsx # Tanstack Query wrapper.
│   ├── supabase/                    # Supabase configuration and helpers for database interaction.
├── .env.local                       # Environment variables specific to local development.
