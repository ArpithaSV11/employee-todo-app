const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

// Get all employees
app.get("/employees", async (req, res) => {
  const employees = await prisma.employee.findMany();
  res.json(employees);
});

// Add employee
app.post("/employees", async (req, res) => {
  const { name, role, salary } = req.body;

  const employee = await prisma.employee.create({
    data: {
      name,
      role,
      salary: Number(salary),
    },
  });

  res.json(employee);
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
    