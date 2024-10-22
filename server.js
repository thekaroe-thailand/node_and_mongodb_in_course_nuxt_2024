const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/check-db-connection', async (req, res) => {
    try {
        await prisma.$connect();
        res.json({ message: "Database connection successful" });
    } catch (error) {
        res.status(500).json({ message: "Database connection failed" });
    }
});
app.post('/customer/create', async (req, res) => {
    try {
        const payload = req.body;
        const customer = await prisma.customer.create({ data: payload });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get('/customer/list', async (req, res) => {
    try {
        const customers = await prisma.customer.findMany();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get('/customer/detail/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const customer = await prisma.customer.findUnique({
            where: {
                id: id
            }
        });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.put('/customer/update/:id', async (req, res) => {
    try {
        const customer = await prisma.customer.update({
            where: {
                id: req.params.id
            },
            data: req.body
        });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.delete('/customer/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await prisma.customer.delete({
            where: {
                id: id
            }
        });
        res.json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.post('/customer/startsWith', async (req, res) => {
    try {
        const keyword = req.body.keyword;
        const customers = await prisma.customer.findMany({
            where: {
                name: {
                    startsWith: keyword
                }
            }
        });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.post('/customer/endsWith', async (req, res) => {
    try {
        const keyword = req.body.keyword;
        const customers = await prisma.customer.findMany({
            where: {
                name: {
                    endsWith: keyword
                }
            }
        });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.post('/customer/contains', async (req, res) => {
    try {
        const keyword = req.body.keyword;
        const customers = await prisma.customer.findMany({
            where: {
                name: {
                    contains: keyword // LIKE('%keyword%')
                }
            }
        });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get('/customer/findCreditIsNotZero', async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            where: {
                credit: {
                    not: 0
                }
            }
        });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get('/customer/sortByName', async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: {
                name: 'asc'
            }
        });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get('/customer/whereAnd', async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            where: {
                AND: [
                    {
                        name: {
                            contains: 'a'
                        }
                    },
                    {
                        credit: {
                            gt: 0 // greater than 0
                        }
                    }
                ]
            }
        });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
