# SlotSwapper 🔄

SlotSwapper is a full-stack MERN (MongoDB, Express, React, Node.js) application that allows users to swap their calendar time slots in a peer-to-peer marketplace.

The core idea: Users can mark a busy event on their calendar as "swappable." This makes it visible to other users, who can then offer one of their own swappable slots in trade. The original user can then accept or reject the swap.

## ✨ Core Features

* **User Authentication:** Secure user registration and login using JSON Web Tokens (JWT).
* **Event Management:** A personal dashboard where users can create, view, and manage their calendar events.
* **Swap Status:** Users can toggle their events between "Busy," "Swappable," and "Swap Pending."
* **Marketplace:** A "Marketplace" page where users can browse all "Swappable" slots from other users.
* **Request System:** A modal-based system for requesting a swap and offering one of your own slots.
* **Atomic Swaps:** When a swap is accepted, the backend performs an atomic transaction to exchange ownership of the two slots, ensuring data integrity.

## 🛠️ Tech Stack

* **Frontend:** React (using Hooks, Context API, and React Router)
* **Backend:** Node.js, Express
* **Database:** MongoDB Atlas (M0 Free Tier)
* **Authentication:** JWT & bcryptjs
* **Project Runner:** `concurrently` (to run both frontend and backend with one command)

## 🎨 Design Choices

* **Backend Architecture:** A clean **MVC (Model-View-Controller)** pattern is used to separate concerns, making the API scalable and easy to maintain.
* **Frontend State:** **React Context API** is used for managing global authentication state, as it provides a lightweight and built-in solution perfect for this app's scale.
* **Data Integrity (The Core Challenge):** The most critical design choice was implementing the swap-response logic using **MongoDB Transactions**. This ensures that when a user accepts a swap, the exchange of ownership on *both* event documents is an "all-or-nothing" atomic operation. This prevents data corruption and required using MongoDB Atlas (a replica set) instead of a local database.
* **Frontend Race Condition:** A "race condition" (where a page tries to fetch data before the auth token is loaded on refresh) was solved by adding an `isLoading` state to the `AuthContext`. The `ProtectedRoute` component now waits for the context to be initialized before rendering the page, ensuring all API requests are authenticated.

---

## 🚀 How to Set Up and Run This Project

Here are the step-by-step instructions for any user to get this project running on their local machine.

### Prerequisites

* [Node.js](https://nodejs.org/) (which includes npm)
* A **free MongoDB Atlas account** (this project uses Transactions, which are not supported by a basic local MongoDB install).

### Step-by-Step Setup

1.  **Clone the Repository:**
    Open your terminal and clone this project.
    ```bash
    git clone [https://your-repo-url.com/slot-swapper.git](https://your-repo-url.com/slot-swapper.git)
    cd slot-swapper
    ```

2.  **Set up MongoDB Atlas (Required):**
    * Go to [MongoDB Atlas](https://cloud.mongodb.com/) and create a free (M0) cluster.
    * In **Database Access**, create a new database user (e.g., `myuser` / `mypassword123`).
    * In **Network Access**, add a new IP address: `0.0.0.0/0` (Allow Access From Anywhere).
    * Go to your cluster "Overview" and click **Connect** -> **Connect your application**.
    * Copy the connection string.

3.  **Configure Backend (`.env` file):**
    * Navigate to the `backend` folder:
        ```bash
        cd backend
        ```
    * Create a new file named `.env` and add the following content:
        ```env
        # Paste your MongoDB Atlas connection string here
        # Replace <username>, <password>, and add your database name (e.g., "slot-swapper")
        MONGO_URI=mongodb+srv://<username>:<password>@cluster-name.xxxxx.mongodb.net/slot-swapper?appName=Cluster
        
        # Create your own secret for signing tokens
        JWT_SECRET=a-very-strong-and-secret-key-123
        
        # Port for the backend server
        PORT=5000
        ```

4.  **Install All Dependencies:**
    * Go back to the **root** project folder (`slot-swapper`).
        ```bash
        cd ..
        ```
    * Install the dependencies for **both** frontend and backend at once:
        ```bash
        npm install
        npm install --prefix backend
        npm install --prefix frontend
        ```

5.  **Run the Application (One Command):**
    * From the **root** folder (`slot-swapper`), run the following command to start both servers together:
        ```bash
        npm start
        ```
    * This will use `concurrently` to:
        * Start the backend server on `http://localhost:5000`
        * Start the frontend React app on `http://localhost:3000`

6.  **View the App:**
    * Open your browser and go to `http://localhost:3000`.
    * The application is now running. You can create two different accounts (one in a normal browser, one in an Incognito window) to test the swap functionality.

---

## 🔌 API Endpoints

All protected routes require an `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Protected | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | No | Registers a new user. |
| `POST` | `/api/auth/login` | No | Logs in a user and returns a JWT. |

### Events (Personal)

| Method | Endpoint | Protected | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/events` | **Yes** | Creates a new event for the logged-in user. |
| `GET` | `/api/events/me` | **Yes** | Gets all events for the logged-in user. |
| `PUT` | `/api/events/:id/status` | **Yes** | Updates an event's status (e.g., 'BUSY', 'SWAPPABLE'). |

### Swap Logic

| Method | Endpoint | Protected | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/swap/swappable` | **Yes** | Gets all `SWAPPABLE` slots from *other* users. |
| `GET` | `/api/swap/me` | **Yes** | Gets all incoming & outgoing swap requests for the user. |
| `POST` | `/api/swap/request` | **Yes** | Creates a new swap request. |
| `POST` | `/api/swap/response/:id` | **Yes** | Responds (Accept/Reject) to an incoming swap request. |
