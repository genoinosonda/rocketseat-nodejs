const express = require("express");
const { restart } = require("nodemon");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

const customers = [];

// MIDDLEWARE

function verifyIfExistsAccountCPF(req, res, next) {

    const { cpf } = req.headers;

    const customer = customers.find(customer => customer.cpf === cpf);

    if (!customer) {
        return res.status(400).json({ Error: "Customer not found!" });
    }

    req.customer = customer;

    return next();

}

function getBalance(statement) {
    const balance = statement.reduce((acc, operation) => {
        if (operation.type === "credit") {
            return acc + operation.amount;
        } else {
            return acc - operation.amount;
        }
    }, 0);

    return balance;
}


app.post("/account", (req, res) => {
    const { cpf, name } = req.body;

    const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf);

    if (customerAlreadyExists) {
        return res.status(400).json({ error: "Customer already exists!" });
    }

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    })

    return res.status(200).json({ customers });
})

app.get("/statement", verifyIfExistsAccountCPF, (req, res) => {

    const { customer } = req;
    return res.json(customer);

})

app.post("/deposit", verifyIfExistsAccountCPF, (req, res) => {

    const { description, amount } = req.body;

    const { customer } = req;

    console.log(description)
    console.log(amount)

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    };

    customer.statement.push(statementOperation);

    return res.status(201).send();

})


app.post("/withdraw", verifyIfExistsAccountCPF, (req, res) => {
    const { amount } = req.body;
    const { customer } = req;

    const balance = getBalance(customer.statement);

    if (balance < amount) {
        return res.status(400).json({ Error: "Usufficient funds!" })
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "debit",
    }

    customer.statement.push(statementOperation);

    return res.status(201).send();
})

app.get("/statement/date", verifyIfExistsAccountCPF, (req, res) => {

    const { date } = req.query;
    const { customer } = req;

    const dateFormated = date + " 00:00";

    const statements = customer.statement.filter(statement =>
        new Date(statement.createdAt).toString() === new Date(dateFormated).toString()
    );

    res.status(201).json({ Statements: statements })

})

app.put("/account", verifyIfExistsAccountCPF, (req, res) => {
    const { name } = req.body;
    const { customer } = req;

    customer.name = name;

    return res.status(201).send();

})

app.get("/account", verifyIfExistsAccountCPF, (req, res) => {

    const { customer } = req;

    return res.json(customer);
})

app.delete("/account", verifyIfExistsAccountCPF, (req, res) => {

    const { customer } = req;

    customers.splice(customer, 1);

    return res.status(200).json(customers);
})

app.get("/balance", verifyIfExistsAccountCPF, (req, res) => {

    const { customer } = req;

    const balance = getBalance(customer.statement);

    return res.status(201).json(balance);
})

app.listen(3333);