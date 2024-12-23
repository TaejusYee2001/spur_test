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
