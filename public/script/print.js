function printInvoice(studentId) {
  fetch(`/api/students/invoice/${studentId}`, {
    headers: { Authorization: "Bearer " + token }
  })
  .then(res => res.json())
  .then(data => {
    if (data.length === 0) {
      alert("No invoice data found");
      return;
    }

    const student = data[0];
    let total = 0;

    let rows = data.map((d, i) => {
      total += d.fees;
      return `
        <tr>
          <td>${i + 1}</td>
          <td>${d.course_name}</td>
          <td>₹${d.fees}</td>
        </tr>`;
    }).join("");

    const invoiceHTML = `
      <html>
      <head>
        <title>Student Invoice</title>
        <style>
          body { font-family: Arial; padding: 20px }
          h2 { text-align: center }
          table { width: 100%; border-collapse: collapse; margin-top: 20px }
          th, td { border: 1px solid #000; padding: 8px; text-align: center }
          .info { margin-top: 10px }
          .total { font-weight: bold }
        </style>
      </head>
      <body>
        <h2>Student Invoice</h2>

        <div class="info">
          <p><strong>Name:</strong> ${student.name}</p>
          <p><strong>Roll No:</strong> ${student.rollno}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Course</th>
              <th>Fees</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            <tr class="total">
              <td colspan="2">Total</td>
              <td>₹${total}</td>
            </tr>
          </tbody>
        </table>

        <script>
          window.print();
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  });
}
