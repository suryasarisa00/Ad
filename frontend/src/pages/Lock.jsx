import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import bg from "./peakpx.jpg";
import { FaChevronRight } from "react-icons/fa";
export default function Lock({ showError, handleSubmit, login }) {
  useEffect(() => {
    // if (login) navigate("/");
  }, []);

  return (
    <div className="unlock-page">
      {showError && <p className="error">Incorrect Password</p>}
      <div className="box">
        <form action="" onSubmit={handleSubmit}>
          <input type="password" name="pass" placeholder="Enter Password" />
          <button className="outer-btn">
            <FaChevronRight className="icon" />
          </button>
        </form>
      </div>
    </div>
  );
}
