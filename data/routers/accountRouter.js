const express = require('express');

const accountDb = require('./accounts-model.js');

const router = express.Router();

router.post('/', validateAccount, (req, res) => {
    const accountData = req.body;
    accountDb.insert(accountData)
        .then(account => {
            res.status(201).json(account);
        })
        .catch(err => {
            res.status(500).json({ message: "failed to post account to the database" });
        });
});

router.get('/', (req, res) => {
    accountDb.get()
        .then(accounts => {
            res.status(200).json(accounts);
        })
        .catch(err => {
            res.status(500).json({ error: "failed to get accounts from the database" });
        });
});

router.get('/limit/:id', (req, res) => {
    const id = req.params.id;
    accountDb.get().limit(id)
        .then(accounts => {
            res.status(200).json(accounts);
        })
        .catch(err => {
            res.status(500).json({ error: "failed to get accounts from the database" });
        });
});

router.get('/:id', validateAccountId, (req, res) => {
    const id = req.params.id;
    accountDb.getById(id)
        .then(account => {
            res.status(200).json(account);
        })
        .catch(err => {
            res.status(500).json({ error: "failed to get account from the database" });
        });
});

router.delete('/:id', validateAccountId, (req, res) => {
    const id = req.params.id;
    accountDb.remove(id)
        .then(account => {
            res.status(200).json(account);
        })
        .catch(err => {
            res.status(500).json({ error: "failed to remove account from the database" });
        });
});

router.put('/:id', validateAccountId, validateAccount, (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    accountDb.update(id, changes)
        .then(account => {
            res.status(200).json(account);
        })
        .catch(err => {
            res.status(500).json({ error: "failed to update account in the database" });
        });
});

//custom middleware

function validateAccountId(req, res, next) {
    const id = req.params.id;
    accountDb.getById(id)
        .then(account => {
            if (id) {
                req.account = account;
            } else {
                res.status(400).json({ message: "invalid account id" });
            }
        })
    next();
};

function validateAccount(req, res, next) {
    const accountData = req.body;
    if (!accountData.name) {
        res.status(400).json({ errorMessage: "missing required name field" });
    } else if (!accountData.budget) {
        res.status(400).json({ errorMessage: "missing required budget field" });
    } else {
        console.log('account validated');
        next();
    }
};

module.exports = router;
