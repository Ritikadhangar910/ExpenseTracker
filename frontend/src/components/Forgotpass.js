import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
const Forgotpass = () => {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState(false);
  const [errmsg, seterrmsg] = useState(null);
  async function submitForm(e) {
    e.preventDefault();
    if (!email) {
      setErr(true);
      seterrmsg("field is empty");
      return;
    } else {
      setErr(false);
    }
    const obj = {
      email: email,
    };
    try {
      await axios.post("http://localhost:4000/password/forgotpass", obj);
      setErr(false);
    } catch (err) {
      if (err.response.data.message === "Invalid email id") {
        seterrmsg("Invalid email id");
      } else {
        seterrmsg("something went wrong");
      }
      setErr(true);
    }
  }
  return (
    <>
      {err && (
        <Alert key={"danger"} variant={"danger"}>
          {errmsg}
        </Alert>
      )}
      <div style={{ width: "350px", marginLeft: "20px", marginTop: "10px" }}>
        <h2>Forgot Password</h2>
        <Form onSubmit={submitForm}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </>
  );
};
export default Forgotpass;
