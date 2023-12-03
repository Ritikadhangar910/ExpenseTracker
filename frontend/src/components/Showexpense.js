import React from "react";
import { useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import "../App.css";

const Showexpense = React.memo((props) => {
  const storeExpense = props.expenses;
  const [Storeexpenses, setStoreExpenses] = useState([]);
  const [mytoken, storeToken] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paged, setPaged] = useState([]);

  const getAllexpenses = useCallback(async (token, page) => {
    try {
      const res = await axios.get(
        `http://localhost:4000/expense/get-expenses?page=${page}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setStoreExpenses(res.data.data);
      setPaged(res.data.lastpage);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    storeToken(token);
    if (token) {
      getAllexpenses(token, currentPage);
    }
  }, [storeExpense, mytoken, getAllexpenses, currentPage]);

  const renderPageNumbers = () => {
    let lastpage = paged;
    let items = [];
    for (let num = 1; num <= lastpage; num++) {
      items.push(
        <ul key={num} className="paginationul">
          <li>
            <button
              className="paginationbtn"
              onClick={() => {
                setCurrentPage(num);
                callgetExpenses(num);
              }}
            >
              {num}
            </button>
          </li>
        </ul>
      );
    }
    return items;
  };

  const callgetExpenses = (page) => {
    const token = localStorage.getItem("token");
    getAllexpenses(token, page);
  };

  async function deleteExpense(id) {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:4000/expense/delete-expense/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      const copyAllExpense = [...Storeexpenses];
      const restExpense = copyAllExpense.filter((expense) => {
        return expense.id !== id;
      });
      setStoreExpenses(restExpense);

      const newLastPage = Math.ceil(restExpense.length / 10);
      if (newLastPage === 0) {
        setCurrentPage(1);
      } else if (currentPage > newLastPage) {
        setCurrentPage(newLastPage);
      }

      callgetExpenses(currentPage);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="showexpense">
      <h2>Your all Expenses are here</h2>
      {Storeexpenses.map((expense) => (
        <div
          key={expense.id}
          style={{ maxWidth: "100%", overflowX: "hidden", paddingTop: "15px" }}
        >
          <p>Money: {expense.expense}</p>
          <p>Description: {expense.description}</p>
          <p>Catogary: {expense.catogary}</p>
          <Button
            type="button"
            variant="danger"
            onClick={() => {
              deleteExpense(expense.id);
            }}
          >
            Delete
          </Button>
        </div>
      ))}
      <div style={{ marginTop: "10px" }}>{renderPageNumbers()}</div>
    </div>
  );
});

export default Showexpense;
