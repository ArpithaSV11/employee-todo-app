import { useEffect, useState } from "react";

function App() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await fetch("http://localhost:5000/employees");
    const data = await res.json();
    setEmployees(data);
  };

  const addEmployee = async () => {
    await fetch("http://localhost:5000/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role, salary }),
    });

    setName("");
    setRole("");
    setSalary("");
    fetchEmployees();
  };

  const deleteEmployee = async (id) => {
    await fetch(`http://localhost:5000/employees/${id}`, {
      method: "DELETE",
    });
    fetchEmployees();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Employee Todo App</h2>

      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <br />
      <input placeholder="Role" value={role} onChange={e => setRole(e.target.value)} />
      <br />
      <input placeholder="Salary" value={salary} onChange={e => setSalary(e.target.value)} />
      <br />
      <button onClick={addEmployee}>Add Employee</button>

      <ul>
        {employees.map(emp => (
          <li key={emp.id}>
            {emp.name} - {emp.role} - ₹{emp.salary}
            <button onClick={() => deleteEmployee(emp.id)} style={{ marginLeft: "10px" }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
