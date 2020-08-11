const router = require('express').Router();
const {query} = require('../mongoDBQuery');

router.route('/:drug/:disease').get( (req,res) => 
{
    const drug = req.params.drug;
    const disease = req.params.disease;


    if( !drug || !disease  )
    {
        res.status(400).send('Bad Request');
        return;
    }

    query(drug,disease,res);
    
});






module.exports = router;

