# 📄 Product Requirements Document (PRD): GIS System Architecture & Refactoring

> **⚠️ DISCLAIMER & GUIDING PRINCIPLES (DEVELOPMENT PARADIGMS)**
> All code implementations for this PRD **MUST** adhere to the following Software Engineering principles:
> 1. **Modular & Single Responsibility Principle (SRP):** Each function in the Backend or component in React must have only one specific task. Do not create "god" functions that handle validation, database queries, and response formatting all at once.
> 2. **Reusability (DRY - Don't Repeat Yourself):** If form logic or database queries are used repeatedly, extract them into helpers, hooks (in React), or service methods (in Express).
> 3. **Scalability:** Adding a new "Cluster" (Rumpun) in the future should take less than 15 minutes without breaking the core code (simply add a table and register it in a switch-case or mapping configuration).
> 4. **Database Transactions:** All data insertion or modification operations involving more than 1 table (e.g., `object_points` + `cluster_foods`) **MUST** be wrapped in `BEGIN`, `COMMIT`, and `ROLLBACK` blocks to maintain data integrity.
> 5. **Preserve Existing UI (Non-Destructive Refactoring):** Do not break or alter the existing UI layout and design. The refactoring process (such as component splitting or state updates) must strictly maintain the current Tailwind CSS stylings, interactive behaviors, and overall user experience.

---

## 🛠️ PHASE 1: BACKEND REFACTORING (EXPRESS.JS & POSTGRESQL)

### 1. Primary Objective
Revamp `PointsService.js` and `pointController.js` to support the **Class Table Inheritance** (Cluster System) schema using database transactions, and ensure dynamic validation based on object types.

### 2. Database Specifications & Parameter Mapping
The backend must exactly recognize the extension table mapping based on the Cluster:
* **Base Table:** `object_points` (id, name, description, address, latitude, longitude, type_id, phone, status, tags, created_by, created_at).
* **Extension 1 (Food):** `cluster_foods` (point_id, signature_menu, price_range, opening_hours, is_halal, has_wifi)
* **Extension 2 (Nature):** `cluster_natures` (point_id, elevation, difficulty_level, entry_fee, public_facilities)
* **Extension 3 (Accommodation):** `cluster_accommodations` (point_id, star_rating, check_in_time, check_out_time, has_pool)
* **Extension 4 (Healthcare):** `cluster_healthcares` (point_id, facility_type, has_igd, accepts_bpjs, ambulance_available)
* **Extension 5 (Education):** `cluster_educations` (point_id, education_level, accreditation, school_status, has_library)

### 3. Backend Task List

#### A. Update Endpoint `GET /objects` & `GET /objects/:id` (Read)
* **Logic:** Perform a `LEFT JOIN` from `object_points` to the five `cluster_...` tables. Because it operates on a 1:1 relationship, a single `point_id` will only have data in one of the extension tables, while the rest will be `NULL`.
* **Data Transformation (Controller):** Format the JSON response before sending it to the Frontend to keep it clean.

```json
// Ideal Response Structure Example
{
  "id": 101,
  "name": "Kopi Kenangan",
  "type_id": 1,
  "cluster_name": "Food & Beverage",
  "latitude": -8.123,
  "longitude": 115.123,
  "details": {
    "signature_menu": "Kopi Susu",
    "opening_hours": "08:00 - 22:00",
    "is_halal": true
  }
}
```

#### B. Update Endpoint `POST /objects` (Create)
* **Step 1:** Validate the payload. Determine the `cluster_id` based on the submitted `type_id`.
* **Step 2:** Start a block `await pool.query('BEGIN')`.
* **Step 3:** Insert the core data into `object_points` `RETURNING id`.
* **Step 4:** Use a conditional structure (`switch`) based on the `cluster_id`. If it falls under the *Food* cluster, insert the specific data into `cluster_foods` using the `point_id` obtained from Step 3.
* **Step 5:** `await pool.query('COMMIT')`. Catch any errors in the `catch` block and perform a `ROLLBACK`.

#### C. Update Endpoint `PUT /objects/:id` (Update)
* **Logic:** Perform a dual Update within a Transaction. First, update `object_points`, then use an `UPSERT` (using the `ON CONFLICT (point_id) DO UPDATE` clause) for its corresponding cluster extension table.

#### D. Update Validation (`PointsValidator.js`)
* **Logic:** Validation must be dynamic. If the `cluster_id` refers to Accommodation, ensure variables like `star_rating` are of number type, while variables like `signature_menu` are ignored if submitted.

---

## 🎨 PHASE 2: FRONTEND REFACTORING (REACT.JS & VITE)

### 1. Primary Objective
Create a UI (Form and Detail Panel) that reacts dynamically to category/type selections, separate detail components by cluster for code neatness, and add a Tabular Data Management Page.

### 2. Frontend Task List

#### A. Component: `ObjectFormModal.jsx` (Dynamic Form)
* **Concept:** Implement the *Strategy* pattern for UI rendering.
* **Logic:**
  1. When an admin selects a `type_id` in the dropdown, find that type object in the state and retrieve its `cluster_id`.
  2. Use *Conditional Rendering*. Create separate sub-components:
     * `<FoodFormFields formData={formData} onChange={handleChange} />`
     * `<NatureFormFields ... />`
     * `<AccommodationFormFields ... />`
     * Etc.
  3. Automatically render the relevant sub-component based on the active `cluster_id`. This makes the code highly modular. Even if there are 100 clusters later, the `ObjectFormModal.jsx` file won't bloat into thousands of lines.

#### B. Component: `InfoPanel.jsx` (Dynamic Sidebar Detail)
* **Concept:** Adaptive display. Do not display text like "Signature Menu: Empty" for a Beach location.
* **Logic:**
  1. Create a new folder: `src/components/clusters/`.
  2. Create a detail view component for each cluster (e.g., `FoodDetailView.jsx`, `NatureDetailView.jsx`).
  3. Inside `InfoPanel.jsx`, simply call a one-line `switch` logic that injects the specific component into the panel based on the `cluster_name` or `details` property coming from the backend JSON.

#### C. New Feature: `AdminDataPage.jsx` (Tabular CRUD Management)
* **Concept:** Separate the map view from the data processing view so the admin interface looks professional, resembling a true database management system.
* **Logic:**
  1. Create a new route in `App.jsx` (e.g., `/admin/data`).
  2. This component should utilize a `<table className="w-full">` (since Tailwind is used) that renders the core data fetched from `/objects`.
  3. Minimum Columns: `ID`, `Name`, `Type`, `Cluster`, `Status`, `Actions (Edit/Delete)`.
  4. **Crucial:** The Edit/Delete buttons must invoke the exact same functions and modal (`ObjectFormModal.jsx`) as the ones on `MapPage.jsx`. Do not duplicate the form logic.

#### D. MapConfig & Map Rendering Adjustments
* **Logic:** No extreme changes required. Markers will still render based on the `latitude` and `longitude` provided by `object_points`. Category filtering (`Navbar.jsx`) will continue to operate normally since `type_name` and `cluster_name` remain available in the new JSON structure.

---

## 📋 RECOMMENDED EXECUTION ORDER

1. **Backend - GET (Read):** Complete and test the `GET` endpoint using Postman. Ensure the joined JSON data is outputted correctly matching the nested *Details* format.
2. **Backend - POST & PUT (Create/Update):** Complete these endpoints along with their transactions. Test again with *form-data* in Postman to ensure data is properly inserted into the two different tables.
3. **Frontend - Modal Form:** Move to the Frontend, update the `ObjectFormModal.jsx` state to accommodate dynamic fields based on the selected cluster.
4. **Frontend - Detail Panel:** Split the detail components in `InfoPanel.jsx` to make the display fully adaptive.
5. **Frontend - Tabular View:** Finally, build the `AdminDataPage.jsx` as a dedicated dashboard for tabular data processing.