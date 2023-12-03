import Button from "react-bootstrap/Button";
import { Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import Showexpense from "./Showexpense";
import Premium from "./Premium";
import "../App.css";
const Expensepage = () => {
  const [expense, setExpense] = useState("");
  const [desp, setDesp] = useState("");
  const [catogary, setCatogary] = useState("");
  const [expenses, setExpenses] = useState([]);

  async function AddExpenseHandler(e) {
    e.preventDefault();
    const obj = { expense, desp, catogary };
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:4000/expense/add-expense",
        obj,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setExpenses((prev) => {
        return [...prev, response.data.data];
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="addexpenseSection">
        <div>
          <h2 style={{ color: "green" }}>Add Your Expense</h2>
          <Form style={{ width: "350px" }} onSubmit={AddExpenseHandler}>
            <Form.Group className="mb-3" controlId="formBasicExpense">
              <Form.Label>Expense Money</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Expense"
                value={expense}
                onChange={(e) => {
                  setExpense(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicDesp">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={desp}
                onChange={(e) => {
                  setDesp(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Catogary</Form.Label>
              <Form.Select
                aria-label="Default select example"
                value={catogary}
                onChange={(e) => setCatogary(e.target.value)}
              >
                <option>Open this select menu</option>
                <option value="Petrol">Petrol</option>
                <option value="Food">Food</option>
                <option value="Salary">Salary</option>
              </Form.Select>
            </Form.Group>
            <Button
              variant="success"
              type="submit"
              style={{ marginTop: "20px" }}
            >
              Add Expense
            </Button>
          </Form>
        </div>
        <div>
          <Premium />
        </div>
      </div>
      <Showexpense expenses={expenses} />
    </>
  );
};
export default Expensepage;
