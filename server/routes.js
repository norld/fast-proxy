'use strict';

const express = require('express');
const router = express.Router();

// load the controller
const InvoiceController = require('./controller');
const invoiceController = new InvoiceController();

// load the configuration file
const config = require('./config');
router.get('/api/healthcheck/readiness', (req, res) => {
    res.json({
        status: 'ok'
    });
});

router.post('/api/invoice', async (req, res) => {
    try {
        // you can change the config with your business details
        const data = {
            ...config.invoiceData,
            external_id: `checkout-demo-${+new Date()}`,
            currency: req.body.currency,
            amount: req.body.amount,
            failure_redirect_url: req.body.redirect_url,
            success_redirect_url: req.body.redirect_url
        };

        const invoice = await invoiceController.create(data);
        return res.status(200).send(invoice.data);
    } catch (e) {
        console.log("@e", e)
        return res.status(e.response.status).send(e.response.data);
    }
});

module.exports = router;
