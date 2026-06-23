const { pool } = require("../config/db");

// Inserts a new enquiry row. Returns the inserted row's id.
const saveEnquiry = async (data) => {
  const query = `
    INSERT INTO enquiries
      (full_name, phone_number, email, project_type, location, plot_size, budget, start_date, project_brief)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.fullName,
    data.phoneNumber,
    data.email || null,
    data.projectType,
    data.location,
    data.plotSize || null,
    data.budget || null,
    data.startDate || null,
    data.projectBrief
  ];

  const [result] = await pool.query(query, values);
  return result.insertId;
};

// Fetches all enquiries, most recent first. Useful later for an admin dashboard.
const getAllEnquiries = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM enquiries ORDER BY created_at DESC"
  );
  return rows;
};

module.exports = { saveEnquiry, getAllEnquiries };
