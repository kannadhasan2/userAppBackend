const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require("cors");

const path = require("path");
const app = express();
app.use(express.json());
app.use(cors());
const dbPath = path.join(__dirname, "customerdb.db");
let db = null;
const initializationOfDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  } catch (e) {
    console.log(`DB Error" ${e.message}`);
    process.exit(1);
  }
};
initializationOfDBAndServer();
app.listen(5000, () => {
  console.log("Server running at the port 5000");
});

app.get("/users/", async (request, response) => {
  const getUserQuery = `
        SELECT * 
        FROM user
        ORDER BY 
        first_name;
    `;
  const userList = await db.all(getUserQuery);
  response.send(userList);
});

app.get("/users/:userId/", async (request, response) => {
  const { userId } = request.params;
  const getUserQuery = `
        SELECT *
        FROM user 
        WHERE user_id = '${userId}';
    `;
  const user = await db.get(getUserQuery);
  response.send(user);
});

app.post("/users/", async (request, response) => {
  const userDetails = request.body;
  const {
    firstName,
    lastName,
    email,
    address,
    mobileNo,
    pinCode,
    userId,
  } = userDetails;
  const addUserDetailsQuery = `
    INSERT INTO user(
        first_name,last_name,pin_code,mobile_no,adress,email,user_id
    )
    values(
        '${firstName}','${lastName}','${pinCode}','${mobileNo}',
        '${address}','${email}','${userId}'
    );
  `;
  const dbResponse = await db.run(addUserDetailsQuery);
  response.send("User Added Successfully");
});

app.delete("/users/:userId/", async (request, response) => {
  const { userId } = request.params;
  const deleteUserQuery = `
        DELETE FROM
        user 
        WHERE user_id = '${userId}';
    `;
  await db.run(deleteUserQuery);
  response.send("User Deleted Successfully");
});
