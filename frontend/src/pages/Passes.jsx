import { useEffect, useState } from "react";
import axios from "axios";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
function Passes({ gPasses, ePasses, login }) {
  useEffect(() => {
    // if (!login) navigate("/unlock");
  }, []);
  return (
    <>
      <div className="pass-boxes ecap">
        {ePasses
          .filter((p) => p.type === "teacher")
          .map((epass, index) => {
            return <Pass pass={epass} key={epass._id} />;
          })}
        {ePasses
          .filter((p) => p.type === "student")
          .map((epass, index) => {
            return <Pass pass={epass} key={epass._id} />;
          })}
      </div>
      {/* <p>Google Passwords</p> */}
      <div className="pass-boxes google">
        {gPasses.map((gpass, index) => {
          return <Pass pass={gpass} key={index} />;
        })}
      </div>
    </>
  );
}

function Pass({ pass }) {
  const [showOldPasses, setShowOldPasses] = useState(false);
  const [noImg, setNoImg] = useState(pass.img?.endsWith("imgna.gif"));
  // const url = "https://99-passes-b.vercel.app/auth";
  const url = import.meta.env.VITE_SERVER;
  const [img, setImg] = useState("");

  useEffect(() => {
    if (pass.img?.endsWith("imgna.gif")) return;
    if (pass.img) {
      const cachedImg = localStorage.getItem(pass.img);
      if (cachedImg) {
        setImg(cachedImg);
      } else {
        axios
          .post(url + "/img", { img: pass.img }, { responseType: "blob" })
          .then((res) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64data = reader.result;
              setImg(base64data);
              localStorage.setItem(pass.img, base64data);
            };
            reader.readAsDataURL(new Blob([res.data]));
          });
      }
    }
  }, [pass.img, url]);

  return (
    <div className={"pass-box " + pass.type}>
      <div className="block">
        <div>
          {pass.name && (
            <div className="field name">
              <div className="name">{toTitleCase(pass.name)}</div>
            </div>
          )}
          <div className="field">
            <span className="txt user">User:</span>
            <span
              className="value user"
              onClick={() => navigator.clipboard.writeText(pass._id)}
            >
              {pass._id}
            </span>
          </div>
          {pass.temp && (
            <div className="field">
              <span className="txt password">Pass:</span>
              <span
                className="value password"
                onClick={() => navigator.clipboard.writeText(pass.password)}
              >
                {pass.temp}
              </span>
              {pass.twoStepAuth != undefined && (
                <span className={"n2fs " + pass?.twoStepAuth}>2fa</span>
              )}
            </div>
          )}

          {pass.password && (
            <div className="field">
              <span className="txt password">Pass:</span>
              <span
                className="value password"
                onClick={() => navigator.clipboard.writeText(pass.password)}
              >
                {pass.password}
              </span>
              {!pass.temp && pass.twoStepAuth != undefined && (
                <span className={"n2fs " + pass?.twoStepAuth}>2fa</span>
              )}
            </div>
          )}
        </div>
        {img && <img src={img} />}
        {/* {pass.img && <img src={"https://placehold.co/400200"} />} */}
      </div>
      {pass.oldPasswords.length > 0 && (
        <>
          <div
            className="toggle-old-passes"
            onClick={() => setShowOldPasses((prv) => !prv)}
          >
            <p>Old Passwords</p>
            {!showOldPasses ? <FaChevronDown /> : <FaChevronUp />}
          </div>
          <AnimatePresence>
            {showOldPasses && (
              <motion.div
                className="old-passes"
                initial={{ height: 0, overflow: "hidden" }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.25 }}
              >
                {pass.oldPasswords.map((oldp, ind) => (
                  <motion.div
                    className="oldpass"
                    key={ind}
                    onClick={() => navigator.clipboard.writeText(oldp)}
                  >
                    {oldp}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default Passes;

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
