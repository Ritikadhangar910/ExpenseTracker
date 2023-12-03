import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
import { creadentialAction } from "../store/credentail";
import { useDispatch } from "react-redux";
import "../App.css";
import axios from "axios";
function Auth() {
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);
  const [errmsg, seterrmsg] = useState(null);
  const [togglebtn, setTogglebtn] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function submitHandler(e) {
    e.preventDefault();
    if (!name || !email || !pass) {
      seterrmsg("Please fill all the fields");
      setErr(true);
      return;
    } else {
      setErr(false);
    }
    const obj = { name, email, pass };
    try {
      const response = await axios.post(
        "http://localhost:4000/user/create-user",
        obj
      );
      console.log(response.data);
      setErr(false);
      setTogglebtn(false);
    } catch (err) {
      if (
        err &&
        err.response &&
        err.response.data &&
        err.response.data.Errors &&
        err.response.data.Errors.errors[0] &&
        err.response.data.Errors.errors[0].message === "email must be unique"
      ) {
        seterrmsg("email must be unique");
      } else {
        seterrmsg("something went wrong");
      }
      setErr(true);
    }
  }
  function togglebtnHandler() {
    setTogglebtn((prev) => {
      return !prev;
    });
  }
  async function LoginHandler(e) {
    e.preventDefault();
    const obj = { name, email, pass };
    if (!name || !email || !pass) {
      seterrmsg("Please fill all the fields");
      setErr(true);
      return;
    } else {
      setErr(false);
    }
    try {
      const response = await axios.post(
        "http://localhost:4000/user/login-user",
        obj
      );
      setErr(false);
      localStorage.setItem("token", response.data.token);
      dispatch(creadentialAction.setToken());
      navigate("/");
    } catch (err) {
      if (err.response.data.Error === "User not authorized") {
        seterrmsg("User not authorized");
      } else if (err.response.data.Error === "email does not exist") {
        console.log("email does not exist");
        seterrmsg("email does not exist");
      } else {
        seterrmsg("something went wrong");
      }
      setErr(true);
    }
  }
  function forgotpassHandler() {
    navigate("/password/resetpassword");
  }
  return (
    <>
      <div className="pt-2 px-5 authmain">
        {err && (
          <Alert key={"danger"} variant={"danger"}>
            {errmsg}
          </Alert>
        )}
        <h2 style={{ color: "skyblue" }}>Fill the form</h2>
        <Form
          style={{ width: "300px" }}
          onSubmit={togglebtn ? submitHandler : LoginHandler}
        >
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => {
                setname(e.target.value);
              }}
            />
          </Form.Group>

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

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
              }}
            />
          </Form.Group>

          {togglebtn ? (
            <Button variant="primary" type="submit" className="authsummitbtn">
              Signup
            </Button>
          ) : (
            <>
              <Button variant="primary" type="submit" className="authsummitbtn">
                Login
              </Button>
            </>
          )}
        </Form>

        <Button
          variant="success"
          type="submit"
          className="mt-3"
          onClick={togglebtnHandler}
        >
          {togglebtn
            ? "Do you have account? login"
            : "Don't you have account signup?"}
        </Button>
        {!togglebtn && (
          <Button
            variant="danger"
            type="button"
            className="m-2 mt-4"
            onClick={forgotpassHandler}
          >
            forgot password
          </Button>
        )}
      </div>
    </>
  );
}
export default Auth;
