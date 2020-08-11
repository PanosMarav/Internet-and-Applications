require('dotenv').config();

const dbName = process.env.dbName;

function query(drug, disease, res) {
    const db = global.dbClient.db(dbName);

    db.collection('papers', (err, collection) => {
        if (err) throw err;
        collection.aggregate(
            {
                $match:
                {
                    '$text': { '$search': `\"${drug}\" \"${disease}\"` }
                }
            },
            {
                $project: { title: '$metadata.title', 'date': 1, '_id': 0 }
            },
            {
                $unwind: '$title'
            },
            {
                $unwind: '$title'
            },
            {
                $group: { res: { $addToSet: '$title' } }
            }
        )
        .toArray((err, papers) => {
            if (err) throw err;
            if(papers.length===0)
                res.status(403).send('No Data');
            else
                res.status(200).json(papers)
        })

    })
}



module.exports.query = query;