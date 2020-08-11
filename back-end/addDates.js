const csv = require('csv-parser')
const fs = require('graceful-fs')
const path = require('path');
const MongoClient = require('mongodb').MongoClient;


require('dotenv').config();


const URI = process.env.URI;
const dbName = process.env.dbName;

const client = new MongoClient(URI, { useUnifiedTopology: true });

var filesAndDates = []

function updateDB()
{
    client.connect((err) => {
        if (err) throw err;
        console.log("Connected successfully to server");
        const db = client.db(dbName);
    
        var i = 1;
    
        db.collection('papers', (err, collection) => {
            if (err) throw err;
            console.log('Updating database, this may take a while...');

            Promise.all(filesAndDates.forEach(fileAndDate=>{
                return new Promise((resolve,reject)=>{

                    collection.updateOne({'paper_id': fileAndDate.id},{$set: { "date": fileAndDate.date }}
                    ,(err) => {
                        if (err) reject(err);
                        console.log(i+'/'+filesAndDates.length);
                        i++;
                        resolve()
                    })

                })
            }))
            .then(()=>{
                console.log('Finished!');
            })
        })
    
    })
}



fs.createReadStream(path.join(process.env.datasetPath, 'metadata.csv'))
    .pipe(csv())
    .on('data', (row) => {

        if (row['pdf_json_files'] || row['pmc_json_files']) 
        {
            var file = (row['pdf_json_files']) ? (row['pdf_json_files']) : (row['pmc_json_files']);
            file = file.split(';')[0].split('/')[2].split('.')[0].trim();
            filesAndDates.push({
                id: file,
                date: row['publish_time']
            })
        }
    })
    .on('end', () => {
        updateDB();
    });