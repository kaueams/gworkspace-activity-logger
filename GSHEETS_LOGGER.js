const SPREADSHEET_ID = '[YOUR_GOOGLE_SHEETS_ID_HERE]';
const TARGET_FOLDER_ID = '[FOLDER_TO_MONITOR_ACTIVITY_ID_HERE]';

function logWorkspaceActivity() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
  const properties = PropertiesService.getScriptProperties();
  
  let lastRun = properties.getProperty('LAST_RUN_TIME');
  if (!lastRun) {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    lastRun = oneHourAgo.getTime().toString();
  }
  
  const currentTime = new Date().getTime().toString();
  
  const request = {
    ancestorName: `items/${TARGET_FOLDER_ID}`,
    filter: `time >= ${lastRun}`,
    consolidationStrategy: { none: {} } 
  };

  try {
    const response = DriveActivity.Activity.query(request);
    const activities = response.activities;
    
    if (!activities || activities.length === 0) {
      Logger.log('NO ACTIVITY FOUND.');
    } else {
      for (let i = activities.length - 1; i >= 0; i--) {
        const activity = activities[i];
        
        //USE THIS TO EXTRACT THE TIMESTAMP OF THE ACTIVITY
        const timestamp = new Date(activity.timestamp).toLocaleString('[YOUR_LOCAL_TIMESTAMP_HERE]');
        
        //THIS ONE YOU USE TO GET WHAT THE ACTIVITY WAS ABOUT
        const action = Object.keys(activity.primaryActionDetail)[0]; 
        
        //USE THIS 2 STRING VARS TO STORE THE FILE/FOLDER NAME AND LINK FOR LATER
        let fileName = 'UNKNOWN FILE';
        let fileLink = 'UNKNOWN LINK';
        
        if (activity.targets && activity.targets[0].driveItem) {
          fileName = activity.targets[0].driveItem.title;
          
          //THIS CONST WILL BE NAMED LIKE "items/THE_FILE_OR_FOLDER_ID"
          const resourceName = activity.targets[0].driveItem.name;
          
          if (resourceName) {
            //NOW WE GRAB JUST THE FILE/FOLDER ID
            const fileId = resourceName.split('/')[1]; 
            //NOW, A LINK THAT WORKS BOTH FOR FILES AND FOLDERS
            fileLink = `https://drive.google.com/open?id=${fileId}`;
          }
        }

        //NOW WE GET THE USER TO WRITE IN THE ACTIVITY LOG!
        let user = 'UNKNOWN USER';
        if (activity.actors && activity.actors[0].user && activity.actors[0].user.knownUser) {
          user = activity.actors[0].user.knownUser.personName; 
        }
        
        //FINAL STEP OF THE FOR LOOP: WRITE EVERYTHING TO THE SPREADSHEET!!!
        sheet.appendRow([timestamp, fileName, fileLink, action, user]);
      }
      Logger.log(`LOGGED ${activities.length} NEW ACTIVITIES.`);
    }
    
    properties.setProperty('LAST_RUN_TIME', currentTime);
    
  } catch (e) {
    Logger.log('ERROR WHILE SCANNING FOR ACTIVITIES: ' + e.message);
  }
}
