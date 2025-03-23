<h1 align="center"> UF ACM Fullstack Workshop Template</h1> <br>

<p align="center">
  Created in Spring 2025 by Alexander Fisher for UF ACM
</p>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Introduction](#introduction)
- [Setup](#setup)
- [Customization](#customization)


<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

This serves as a hands-on template designed for ACM members (or anyone interested really) to get started with modern full stack development. Feel free to fork this repo or copy and paste. Learn from this example project and then expand on it, change, delete, do anything you want!

**This project template was built using Next.js with React and Supabase**

[![NextJS](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://shields.io/badge/react-black?logo=react&style=for-the-badge)](https://react.dev/)
[![Supabase](https://shields.io/badge/supabase-black?logo=supabase&style=for-the-badge)](https://supabase.com/)




## Setup


### 1. Install Prerequisites
- **Node.js & npm:**
  - Download the latest LTS version of Node.js from the [Node.js Downloads](https://nodejs.org/en/). This package includes npm.
  - Verify installation by running in your terminal:

    ```bash
    node -v
    npm -v
    ```
---
### 2. Create or Set Up Your Next.js Project

You have two options:

- **Option A: Implement from Scratch**  
  If you want to build this project from the ground up, follow these steps:
  - **Initialize the Project:**
    - Open your terminal in VSCode.
    - Run the following command to create a new Next.js project:
      ```bash
      npx create-next-app@latest <put your project name/ app name here>
      ```
    - You can use Typescript or Javascript, its up to you
    - **(Optional) Install Tailwind CSS:** I recommend selecting to use tailwind, try this tool out it's great
    - Change into your project directory:

      ```bash
      cd <project/app name>
      ``` 
    

- **Option B: Set Up the Existing Project Template Repository**  
  If you prefer to use the existing project template:
  - Clone the repository from a directory of your choice:

    ```bash
    git clone <this_repository_url / or forked url>
    cd rsvp-app
    ```
  - Ensure all dependencies are installed by running:

    ```bash
    npm install
    ```

---

### 3. Install the Supabase Client Library

In your project directory, install the Supabase JavaScript client:

```bash
npm install @supabase/supabase-js
```

---

### 4. Set Up a Supabase Project

**A. Create Your Supabase Project**

*Log In and Create a Project:*

- Visit [Supabase](https://supabase.com/) and sign in (or create an account).
- Click **"New Project"** and fill in the project details (project name, database password, region, etc.).
    - if you have to create an organization, be sure to fill that out too

---

**B. Create Tables via the Supabase Dashboard**

*Creating the Events Table*

1. **Access the Table Editor:**

    - In your Supabase project dashboard, navigate to the **"Table Editor"**.

2. **New Table: Events**

    - Click **"New Table"**.
    - **Table Name:** `Events` *(Use a capital E to match my code)*
    - **Description:** `Optional`
    - **Row Level Security (RLS):**
        - Enable RLS.
    - **Realtime:**
        - Toggle **"Enable Realtime"** ON.
    - **Columns:**
        - **id:**
            - Type: `int8`
            - Should be in there automatically
        - **event_name:**
            - Type: `text`
            - Mark as **not null** by clicking the gear and unchecking the box
        - **guest_count:**
            - Type: `int4`
            - Mark as **not null** and set a **default value of 0**
    - Click **"Save"**.

*Creating the rsvps Table:*

1. **New Table: rsvps**

    - In the Table Editor, click **"New Table"**.
    - **Table Name:** `rsvps` *(again, if you wanna use my code name it exactly)*
    - **Description:** `Optional`
    - **Row Level Security (RLS):**
        - Enable RLS.
    - **Realtime:**
        - Toggle **"Enable Realtime"** ON.
    - **Columns:**
        - **id:**
            - Type: `int8`
            - should be fine as it comes automatically
        - **event_id:**
            - Type: `int8`
            - This column links each RSVP to an event, default value 0.
        - **name:**
            - Type: `text`
            - Mark as **not null**.
        - **email:**
            - Type: `text`
            - Mark as **not null**.
    
    - **Add Foreign Key Relationship:**
        - Use the **"Add foreign key relationship to rsvps"** option:
            - **Select a Schema:** Choose `public`
            - **Select a Table to Reference:** Choose `Events`
            - **Select columns from `public.Events` to reference to:** Set the `public.rsvps` input to `event_id` and set the `public.Events` input to `id`
            - leave `no action` for both the action inputs
    - Click **"Save"**.

---

**C. Configure Supabase Policies**

*To ensure smooth operation with RLS enabled, we need to add two policies to both the Events table and the rsvps table. Add the following policies using the Policies tab*

1. `Events` Policies
    - inside the Table Editor, hover first the `Events` table and click on the three dots
    - then click `View policies`

        ---
    1. *Create policy 1 for the Events table*
        - Policy Name: `Allow public select on Events`
        - Policy Behavior: `Permissive`
        - Policy Command: `SELECT`
        - Target Roles: `anon`
        - Inside of *using()* : `true`
            - should look like : `using(true);`
        
        *Then, hit save*

        ---
    2. *Create policy 2 for the Events table*
        - Policy Name: `Allow public update for events`
        - Policy Behavior: `Permissive`
        - Policy Command: `UPDATE`
        - Target Roles: `anon`
        - Inside of *using() & with check ();* : `true`
            - should look like : `using(true) with check (true);`
        
        *Then, hit save*

2. `rsvps` Policies
    - inside the Table Editor, hover the `rsvps` table and click on the three dots
    - then click `View policies`
    
        ---
    1. *Create policy 1 for the rsvps table*
        - Policy Name: `Allow public insert for rsvps`
        - Policy Behavior: `Permissive`
        - Policy Command: `INSERT`
        - Target Roles: `anon`
        - Inside of *with check()* : `true`
            - should look like : `with check(true);`
        
        *Then, hit save*

        ---
    2. *Create policy 2 for the rsvps table*
        - Policy Name: `Allow public select for rsvps`
        - Policy Behavior: `Permissive`
        - Policy Command: `SELECT`
        - Target Roles: `anon`
        - Inside of *using();* : `true`
            - should look like : `using(true);`
        
        *Then, hit save*

---

### 5. Configure Environment Variables in Next.js

**Create the Environment File:**

- In the root of your Next.js project, create a file named `.env.local`.

**Add Your Supabase Credentials:**

- Open `.env.local` and insert:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

    - *Replace the placeholders with your actual Supabase project url and anon key from the Supabase project overview. Scroll down to find where it says Project API*

---

### 6. Run the Application Locally

**Start the Development Server:**
- In your project directory terminal run:

    ```bash
    npm run dev
    ```
**Verify Your Setup**
- Open your browser and navigate to any of the urls the console says are avaliable `http://localhost:3000` for example



## Customization

### Congrats 
- If you made it this far following along this guide, you are now ready to start developing your fullstack project

### Features
- **Core Functionality:**  
  The current version of this application lets users submit RSVP entries for an event. Each submission automatically updates the event’s `guest_count` in the database and refreshes the React frontend in realtime.
  
- **What You've Learned:**  
  - **Frontend Integration:** Building interactive forms with React and styling them quickly with Tailwind CSS.  
  - **Backend Operations:** Managing data with Supabase, including CRUD operations and realtime updates, while ensuring data integrity with proper policies and RLS.  
  - **Realtime Functionality:** Using Supabase's realtime features to keep your UI in sync with the database changes instantly.

### Next Steps & Customization Ideas
- **User Authentication:**  
  Challenge yourself by integrating authentication. Modify the RSVP process so that only authenticated users can submit entries, and link each RSVP to a specific user account.
  
- **Enhanced Validation & Error Handling:**  
  Improve the current form validation by adding detailed error messages and loading states. Handle edge cases gracefully to enhance the overall user experience.
  
- **Event Management:**  
  Expand the project by adding functionality to create, update, or delete events. Consider building an administrative dashboard to manage multiple events and their RSVPs.
  
- **UI/UX Improvements:**  
  Customize the styling and layout further. Experiment with animations, transitions, and other visual enhancements to create a more engaging interface.
  
- **Additional Features:**  
  Explore advanced functionalities such as sending confirmation emails upon RSVP submission, generating dynamic event pages, or integrating with other APIs to add extra value.

Feel free to fork this repository, experiment with the code, and add your own features. Let this project inspire you to explore the full potential of full stack development and start building your million-dollar idea today!

<p align="center">
  <a href="https://uf-acm.com">
    <img alt="UF ACM" title="UF ACM" src="rsvp-app/src/assets/banner.png" width="250">
  </a>
</p>