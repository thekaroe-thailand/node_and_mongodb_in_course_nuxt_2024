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
app.get('/customer/listBetweenCredit', async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            where: {
                credit: {
                    gte: 150000, // greater than or equal to 150000
                    lte: 210000
                }
            }
        });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get('/customer/sumCredit', async (req, res) => {
    try {
        const sumCredit = await prisma.customer.aggregate({
            _sum: {
                credit: true
            }
        });
        res.json({ sumCredit: sumCredit._sum.credit });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get('/customer/maxCredit', async (req, res) => {
    try {
        const maxCredit = await prisma.customer.aggregate({
            _max: { credit: true }
        });
        res.json({ maxCredit: maxCredit._max.credit });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get('/customer/minCredit', async (req, res) => {
    try {
        const minCredit = await prisma.customer.aggregate({
            _min: { credit: true }
        });
        res.json({ minCredit: minCredit._min.credit });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get('/customer/avgCredit', async (req, res) => {
    try {
        const avgCredit = await prisma.customer.aggregate({
            _avg: { credit: true }
        });
        res.json({ avgCredit: avgCredit._avg.credit });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get('/customer/countCustomer', async (req, res) => {
    try {
        const countCustomer = await prisma.customer.count();
        res.json({ countCustomer: countCustomer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.post('/order/create', async (req, res) => {
    try {
        const customerId = req.body.customerId;
        const amount = req.body.amount;
        const order = await prisma.order.create({
            data: {
                customerId: customerId,
                amount: amount
            }
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get('/customer/listOrder/:customerId', async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const orders = await prisma.order.findMany({
            where: {
                customerId: customerId
            }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get('/customer/listAllOrder', async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            include: {
                Orders: true
            }
        });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get('/customer/listOrderAndProduct/:customerId', async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const customers = await prisma.customer.findMany({
            where: {
                id: customerId
            },
            include: {
                Orders: {
                    include: {
                        Product: true
                    }
                }
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
