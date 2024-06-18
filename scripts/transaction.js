const content = {
  IMPS: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam asperiores maxime explicabo praesentium mollitia sequi, dolores aveniam fuga vitae! Aliquid mollitia architecto totam consequunturdelectus aliquam debitis, voluptatibus atque!",
  RTGS: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam asperiores maxime explicabo praesentium mollitia sequi, dolores aveniam fuga vitae! Aliquid mollitia architecto totam consequunturdelectus aliquam debitis, voluptatibus atque!",
  NEFT: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam asperiores maxime explicabo praesentium mollitia sequi, dolores aveniam fuga vitae! Aliquid mollitia architecto totam consequunturdelectus aliquam debitis, voluptatibus atque!",
};
const urls = {
  IMPS: "?type=IMPS",
  RTGS: "?type=RTGS",
  NEFT: "?type=NEFT",
};

document.querySelectorAll(".left-side-accounts > div").forEach((div) => {
  div.addEventListener("click", function () {
    document.querySelector(".transact-btn").style.display = "";
    document.querySelectorAll(".left-side-accounts > div").forEach((div) => {
      div.classList.remove("border-dark");
    });
    this.classList.remove("border-dark-subtle");
    this.classList.add("border-dark");
    const rightSide = document.querySelector(".right-side > div");
    const sectionName = this.querySelector("div").textContent;
    document.querySelector(".transact-btn a").href =
      "./transact.html" + urls[sectionName];
    rightSide.innerHTML = `
            <h3>${sectionName}</h3>
            <p>${content[sectionName]}</p>
          `;
  });
});
