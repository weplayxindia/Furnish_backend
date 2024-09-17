const csvtojson = require('csvtojson');
const fs = require('fs');
const upload = require('../middleware/multerConfig');
const Customer = require('../models/CustomerSchema');
exports.uploader =  async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const filePath = req.file.path;  

        let allRecords = [];

        
        csvtojson()
            .fromFile(filePath)
            .then(async (csvData) => {
                for (let i = 0; i < csvData.length; i++) {
                    allRecords.push({
                        customerId: csvData[i]['Customer Id'],
                        firstName: csvData[i]['First Name'],
                        lastName: csvData[i]['Last Name'],
                        company: csvData[i]['Company'],
                        city: csvData[i]['City'],
                        country: csvData[i]['Country'],
                        phone1: csvData[i]['Phone 1'],
                        phone2: csvData[i]['Phone 2'],
                        email: csvData[i]['Email'],
                        subscriptionDate: csvData[i]['Subscription Date'],
                        website: csvData[i]['Website'],
                    });
                }
                console.log( "All Records ", allRecords)

                
                try {
                    const result = await Customer.insertMany(allRecords);
                    console.log('Data inserted successfully:', result);
                } catch (dbError) {
                    console.error('Error inserting data into MongoDB:', dbError);
                    res.status(500).send('Error inserting data into MongoDB.');
                    return; 
                }

                
                fs.unlinkSync(filePath);

                res.status(200).send('File uploaded and data successfully inserted into MongoDB');
            })
            .catch((err) => {
                console.error('Error parsing CSV:', err);
                res.status(500).send('Error parsing CSV file.');
            });
    } catch (error) {
        console.error('Error during file upload:', error);
        res.status(500).send('Error during file upload.');
    }
}