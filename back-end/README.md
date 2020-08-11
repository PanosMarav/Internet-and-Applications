## Backend Setup
    Edit the base variable in the .env file to show to the directory  
    that contains the documents_parses folder and the metadata.csv file.
    
    Install all the packages
    $ npm install
    
    Create MongoDB indexes
    $ node ./createTextIndexes.js
    
    Import Dataset
    $ node ./importData.js
    
    Add Dates from metadata
    $ node ./addDates.js


## Running the backend

    $ npm start


    


