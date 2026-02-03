import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";


function App() {
  const { loginWithRedirect, logout, isAuthenticated, getAccessTokenSilently , user,isLoading,}= useAuth0(); 
                                                                                                       
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState("");

  useEffect(() => {
    if (isAuthenticated) fetchEmployees();
  }, [isAuthenticated]);

  const fetchEmployees = async () => {
    const token = await getAccessTokenSilently({
      audience: "employee-api"
    });
;
    const res = await fetch("http://localhost:5000/employees",{
      headers: {
        Authorization: `Bearer ${token}`, // Sending the token in the Authorization header                                                                                                                                                                    
      },
    });
    const data = await res.json();
    setEmployees(data);
  };

  const addEmployee = async () => {
    const token = await getAccessTokenSilently({
      audience: "employee-api"
    });
    await fetch("http://localhost:5000/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, role, salary }),
    });

    setName("");
    setRole("");
    setSalary("");
    fetchEmployees();
  };

  const deleteEmployee = async (id) => { 
    const token = await getAccessTokenSilently({
      audience: "employee-api"
    });
    await fetch(`http://localhost:5000/employees/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchEmployees();
  };

  if (isLoading) {
  return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <button onClick={() => loginWithRedirect()}>Login</button>;
  }
  return (
    <div style={{ padding: "20px" }}>
      <h2>Employee Todo App - Welcome, {user.name}</h2>

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
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

export default App;
