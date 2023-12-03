import { Button } from "react-bootstrap";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
const Downldexpens = () => {
  const downloadLinkRef = useRef(null);
  const [fileurl, setFileurl] = useState(null);

  useEffect(() => {
    if (downloadLinkRef.current && fileurl) {
      downloadLinkRef.current.click();
    }
  }, [fileurl]);
  async function downloadExpens() {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "http://localhost:4000/expense/download-expenses",
      {
        headers: {
          Authorization: token,
        },
      }
    );
    setFileurl(res.data.fileURL);
  }
  return (
    <>
      <Button
        type="button"
        variant="info"
        style={{ marginLeft: "10px" }}
        onClick={downloadExpens}
      >
        Download all expenses
      </Button>
      <Link href={fileurl} style={{ display: "none" }} ref={downloadLinkRef}>
        download link
      </Link>
    </>
  );
};
export default Downldexpens;
