const content = {
  IMPS: `
    <strong>Immediate Payment Service (IMPS)</strong><br><br>
    Immediate Payment Service (IMPS) is an instant interbank electronic fund transfer service that can be accessed via mobile phones, ATMs, and the internet. It is available 24x7, including on Sundays and holidays, making it a convenient option for urgent fund transfers.<br><br>

    <strong>Key Features:</strong><br>
    - <strong>Instant Transfer:</strong> Funds are transferred instantly, even on bank holidays and weekends.<br>
    - <strong>Availability:</strong> Accessible 24x7 through various channels such as mobile apps, ATMs, and online banking.<br>
    - <strong>Secure Transactions:</strong> Uses multi-layered security to ensure safe and secure transactions.<br>
    - <strong>Transfer Limits:</strong> Generally, the upper limit for IMPS transactions is ₹2 lakh per day, but this can vary based on the bank's policy.<br><br>

    <strong>Use Cases:</strong><br>
    - Paying bills and making purchases.<br>
    - Transferring funds to family and friends.<br>
    - Emergency fund transfers outside of regular banking hours.<br><br>
 `,
  RTGS: `
    <strong>Real Time Gross Settlement (RTGS)</strong><br><br>
    Real Time Gross Settlement (RTGS) is a high-value fund transfer system where transactions are processed and settled in real time and on an individual basis. It is primarily used for transactions that require immediate clearing and are typically of large amounts.<br><br>

    <strong>Key Features:</strong><br>
    - <strong>Real-Time Processing:</strong> Transactions are settled instantly, in real-time, without any waiting period.<br>
    - <strong>High-Value Transfers:</strong> Designed for large-value transactions with a minimum limit of ₹2 lakh and no upper limit.<br>
    - <strong>Business Hours:</strong> Available during the business hours of the bank, typically from 9:00 AM to 4:30 PM on weekdays, with limited hours on Saturdays.<br>
    - <strong>Secure and Reliable:</strong> Ensures the highest level of security and reliability for high-value transactions.<br><br>

    <strong>Use Cases:</strong><br>
    - Large corporate payments.<br>
    - Interbank transfers.<br>
    - High-value individual transactions.<br><br>

    <strong>Charges:</strong><br>
    - Banks may charge a fee for RTGS transactions, which can vary based on the amount being transferred.<br>
  `,
  NEFT: `
    <strong>National Electronic Funds Transfer (NEFT)</strong><br><br>
    National Electronic Funds Transfer (NEFT) is a nationwide payment system facilitating one-to-one funds transfer. Transactions are settled in batches and typically take a few hours to be processed.<br><br>

    <strong>Key Features:</strong><br>
    - <strong>Batch Processing:</strong> Transfers are processed in hourly batches throughout the day.<br>
    - <strong>Wide Accessibility:</strong> Available across all NEFT-enabled bank branches in India.<br>
    - <strong>No Minimum or Maximum Limit:</strong> Suitable for both low and high-value transactions, with no minimum or maximum transaction limit.<br>
    - <strong>Business Hours:</strong> Available during the bank's business hours, with transactions processed in defined settlement cycles.<br><br>

    <strong>Use Cases:</strong><br>
    - Routine payments like utility bills, loan EMIs, and credit card payments.<br>
    - Regular fund transfers to family and friends.<br>
    - Corporate payments and salary disbursements.<br><br>

    <strong>Settlement Timings:</strong><br>
    - NEFT operates in half-hourly batches, usually starting from 8:00 AM to 7:00 PM on working days.<br>
    - Transactions initiated after the last batch are settled on the next working day.<br><br>

    <strong>Charges:</strong><br>
    - Banks may levy charges for NEFT transactions based on the amount being transferred, though many banks offer NEFT transfers free of charge for certain account types or transaction amounts.<br>
  `,
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
