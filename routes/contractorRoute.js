// Import required modules
const express = require('express');
const router = express.Router();
const { Contractor } = require('../models/contractorSchema');

router.get('/:orgId', async (req, res) => {
  try {
    // Extract orgId from request parameter
    const orgId = req.params.orgId;
   
    // Find all contractors with the given orgId
    const contractors = await Contractor.find({ orgId });

    // Extract only the required fields for output
    const contractorOutput = contractors.map(contractor => {
      return {
        contractorId: contractor.contractorId,
        contractorName: contractor.contractorName,
        contractorDescription: contractor.contractorDescription
      };
    });

    res.json(contractorOutput);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get contractors' });
  }
});

// Search contractors by orgId and contractorName
router.post('/search', async (req, res) => {
  try {
    const { orgId, contractorName } = req.body;
    const contractors = await Contractor.find({ orgId, contractorName });
    res.json(contractors.map(contractor => ({
      contractorId: contractor.contractorId,
      contractorName: contractor.contractorName,
      contractorDescription: contractor.contractorDescription
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to search contractors' });
  }
});

module.exports = router;
