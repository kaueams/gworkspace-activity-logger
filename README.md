# Google Workspace Activity Logger

## Overview
This Google Apps Script automates the tracking of file and folder activities within a specified Google Drive directory. It queries the Drive Activity API to capture recent actions (edits, uploads, deletions) and logs the timestamp, file details, direct links, action types, and user identities directly into a Google Sheet.

## Business Problem Solved
Managing shared drives or collaborative folders often requires strict audit trails to see who modified or deleted specific files. Manually checking file histories is inefficient for enterprise IT management. This script acts as an automated, background audit logger, compiling activity metrics into a single, filterable spreadsheet for easy tracking and compliance.

## Key Features & Mechanics
*   **Automated API Polling:** Leverages the `DriveActivity.Activity.query` API to pull activity metrics from a specific `TARGET_FOLDER_ID`.
*   **State Management:** Uses `PropertiesService` to store the `LAST_RUN_TIME`, ensuring the script only queries and logs *new* activities since the previous execution, preventing duplicate spreadsheet rows.
*   **Data Parsing & Formatting:** Extracts relevant metadata from nested JSON responses (timestamps, resource names, actor details) and dynamically constructs direct Google Drive URLs for logged files.
*   **Google Sheets Integration:** Appends the parsed, formatted data directly into the target spreadsheet in a clean, tabular format.

## Setup & Execution
1.  Open the Google Sheet where you want the logs to appear.
2.  Navigate to **Extensions > Apps Script** and paste the `GSHEETS_LOGGER.js` code.
3.  Add the **Drive Activity API** in the "Services" tab on the left menu.
4.  Update the `SPREADSHEET_ID` and `TARGET_FOLDER_ID` constants with your specific IDs.
5.  Set up a Time-Driven Trigger (e.g., every 5 minutes or every hour) in the Apps Script dashboard to run `logWorkspaceActivity()` automatically.

## Requirements
*   Google Workspace Account
*   Google Drive Activity API (enabled in Advanced Services)
*   A target Google Sheet for logging
