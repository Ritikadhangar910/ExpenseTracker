import { Button } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";
import Downldexpens from "./Downldexpens";
import Modal from "react-bootstrap/Modal";
const Premium = () => {
  const [premiumuser, setPremiumuser] = useState(false);
  const [boardarr, setboardarr] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodeToken = parseJwt(token);
      if (decodeToken.ispremiumuser) {
        setPremiumuser(true);
      }
    }
  }, []);

  function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }
  async function premiumHandler(e) {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:4000/premium/premiummembersip",
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const options = {
      key: response.data.key_id,
      order_id: response.data.order.id,
      handler: async function (response) {
        const res = await axios.post(
          "http://localhost:4000/premium/updatetracsactionstatus",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setPremiumuser(true);
        localStorage.setItem("token", res.data.token);
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
    e.preventDefault();
    rzp.on("payment.failed", (res) => {
      console.log(res);
      alert("something went wrong");
    });
  }
  async function premiumfeatures() {
    setShow(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:4000/premium/showleaderboard",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setboardarr(response.data);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="premiumsection">
      {!premiumuser ? (
        <>
          <h2 style={{ color: "green" }}>Click below to buy Premium</h2>
          <Button
            variant="warning"
            type="button"
            style={{ marginTop: "20px" }}
            onClick={premiumHandler}
            className="buypremiumbtn"
          >
            Buy Premium
          </Button>
        </>
      ) : (
        <>
          <h2 style={{ color: "blue", marginTop: "10px" }}>
            You are a Premium User
          </h2>
          <Button
            variant="warning"
            type="button"
            style={{ marginTop: "2px" }}
            onClick={premiumfeatures}
          >
            Show leaderboard
          </Button>

          <Downldexpens />

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>leaderboard Chart</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p style={{ color: "green" }}>{`Id Name expense`}</p>
              {boardarr.map((item) => (
                <div key={item.id}>
                  <p
                    style={{ color: "darkmagenta" }}
                  >{`${item.id} ${item.name} ${item.totalexpense}`}</p>
                </div>
              ))}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Premium;
