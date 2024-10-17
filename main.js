const { app, BrowserWindow } = require("electron");
const path = require("path");
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const config = require("./config.json");
const fs = require('fs');
const xmlbuilder = require('xmlbuilder');
const crypto = require('crypto');
const { SignedXml } = require('xml-crypto');
const forge = require('node-forge');
const cron = require('node-cron');
const { machineId } = require('node-machine-id');

const backendApp = express();
const PORT = process.env.PORT || 3001;
checkLastBackup();

backendApp.use(cors());

backendApp.use(express.json());

const upload = multer();

// backendApp.use(express.static(path.join(__dirname, 'backend')));
backendApp.use(express.static(path.join(__dirname, "build")));


let db = new sqlite3.Database('./locales/ph.pak', (err) =>{
    if(err){
        console.error(err.message);
    }else{
        console.log('connected to the database');
        db.run(`
            CREATE TABLE IF NOT EXISTS createuser (
                id INTEGER PRIMARY KEY,
                username TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                bi TEXT NOT NULL,
                password TEXT NOT NULL,
                status TEXT DEFAULT 'normal'
            )
        `, (err) => {
            if(err){
                return console.log(err.message);
            }

            // Assuming you have already parsed the request body to get the user details
            const newUser = {
                username: 'admin',
                email: 'admin@gmail.com',
                phone: '9298892890',
                bi: '876543298',
                password: 'admin',
                status: 'admin', // Set the status to 'admin'
            };

            // password admin : adminroot

            // // Insert the new user into the table
            // Check if the table is empty
            db.get(`SELECT COUNT(*) as count FROM createuser`, [], (err, row) => {
                if (err) {
                    console.error('Error checking user count:', err.message);
                    return;
                }

                if (row.count === 0) {
                    // Insert the new user into the table since it's empty
                    bcrypt.hash(newUser.password, 10, (hashErr, hashedNewPassword) => {
                        if (hashErr) {
                            res.status(500).json({ error: 'Error encrypting new password' });
                        } else {
                            db.run(`
                                INSERT INTO createuser (username, email, phone, bi, password, status)
                                VALUES (?, ?, ?, ?, ?, ?);
                            `, [newUser.username, newUser.email, newUser.phone, newUser.bi, hashedNewPassword, newUser.status], (err) => {
                                if (err) {
                                    console.error('Error creating user:', err.message);
                                } else {
                                    console.log('User created successfully!');
                                }
                            });
                        }
                    });
                } else {
                    console.log('The table is not empty. No new user created.');
                }
            });
        });;

        db.run(`
            CREATE TABLE IF NOT EXISTS companydetails (
                id INTEGER PRIMARY KEY,
                company TEXT NOT NULL,
                contribuinte TEXT NOT NULL,
                email TEXT NOT NULL,
                telefone TEXT NOT NULL,
                city TEXT NOT NULL,
                address TEXT NOT NULL
            )
        `, (err) => {
            if (err) {
                return console.error(err.message);
            }
            // Insert default company detail if table is empty
            db.get(`SELECT COUNT(*) AS count FROM companydetails`, (err, row) => {
                if (err) {
                    return console.error(err.message);
                }
                if (row.count === 0) {
                    db.run(`INSERT INTO companydetails (company, contribuinte, email, telefone, city, address) VALUES (?, ?, ?, ?, ?, ?)`,
                        ['Default Company', '123456789', 'default@example.com', '1234567890', 'Default City', 'Default Address'],
                        (err) => {
                            if (err) {
                                return console.error(err.message);
                            }
                            console.log('Default company details inserted');
                        }
                    );
                }
            });
        });

        // Inside your database connection setup (after creating the table)
        // db.run(`
        //  ALTER TABLE client
        //  ADD COLUMN status TEXT DEFAULT 'normal';
        // `);

        // Create the "client" table
        db.run(`
            CREATE TABLE IF NOT EXISTS client (
                client_id INTEGER PRIMARY KEY,
                client_name TEXT NOT NULL,
                client_phone TEXT,
                nif TEXT,
                date DATE NOT NULL
            )
        `);

        // let nif = '5420010160', id = 114

        //     db.run('UPDATE client SET nif = ? WHERE client_id = ?', [nif, id], (updateErr) => {
        //             if (updateErr) {
        //                 console.log(updateErr.message)
        //             } else {
        //                 console.log('client updated successfully')
        //             }
        //         });
            /*

        db.all('SELECT * FROM client ORDER BY client_id DESC LIMIT 4', (err, rows) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(rows);
                }
            });

            
        
        

        db.run(`ALTER TABLE client ADD COLUMN nif TEXT;`, (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log('client ALTER');
                }
            });
        */

        // Create the "sales" table
        db.run(`
            CREATE TABLE IF NOT EXISTS sales (
                sales_id INTEGER PRIMARY KEY,
                client_id INTEGER NOT NULL,
                seller_id INTEGER NOT NULL,
                sales_totalprice REAL NOT NULL,
                paymentmethod TEXT NOT NULL, 
                change REAL NOT NULL,
                date DATE NOT NULL,
                FOREIGN KEY (client_id) REFERENCES client (client_id),
                FOREIGN KEY (seller_id) REFERENCES createuser (id)
            )
        `);
        /*
            db.run(`ALTER TABLE client ADD COLUMN change REAL`, (err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`client ALTER successfully`);
            });
        */
        /*
            db.all('SELECT * FROM sales', (err, rows) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(rows);
                }
            });
        */
        /*
            db.run(`DELETE FROM sales WHERE sales_id = ?`, [1], function(err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`Row(s) deleted: ${this.changes}`);
            });
        */

        db.run(`
            CREATE TABLE IF NOT EXISTS creditnote (
                cn_id INTEGER PRIMARY KEY AUTOINCREMENT,
                sales_id INTEGER NOT NULL,
                seller_id INTEGER NOT NULL,
                date DATE NOT NULL,
                FOREIGN KEY (sales_id) REFERENCES sales (sales_id),
                FOREIGN KEY (seller_id) REFERENCES createuser (id)
            )
        `);
        
        /*
            // Insert a dummy record to set the starting value
            db.run(`INSERT INTO sqlite_sequence (name, seq) VALUES ('creditnote', 100)`, (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log('success dummy');
                }
            });
        */
        // db.run(`DROP TABLE creditnote`);
        // Delete the dummy record if you don't want to keep it
        /* db.run(`DELETE FROM creditnote WHERE cn_id = 1`, (err, rows) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(rows);
                }
            });
        */

        /*
            db.all('SELECT * FROM creditnote', (err, rows) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(rows);
                }
            });
        */

        // Create the "productsold" table
        db.run(`
            CREATE TABLE IF NOT EXISTS productsold (
                product_id INTEGER PRIMARY KEY,
                medicine_id INTEGER NOT NULL,
                sales_id INTEGER NOT NULL,
                product_name TEXT NOT NULL,
                product_qty INTEGER NOT NULL,
                product_price REAL NOT NULL,
                date DATE NOT NULL,
                FOREIGN KEY (sales_id) REFERENCES sales (sales_id),
                FOREIGN KEY (medicine_id) REFERENCES medicine (medicine_id)
            )
        `);

        /*
            db.all('SELECT * FROM productsold', (err, rows) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(rows);
                }
            });
        */

        // Create the "supplier" table
        db.run(`
            CREATE TABLE IF NOT EXISTS supplier (
                supplier_id INTEGER PRIMARY KEY,
                supplier_name TEXT NOT NULL,
                supplier_email TEXT NOT NULL,
                supplier_phone TEXT NOT NULL,
                supplier_bi TEXT NOT NULL,
                date DATE NOT NULL
            )
        `);

        // Create the medicine table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS medicine (
                medicine_id INTEGER PRIMARY KEY,
                medicine_name TEXT NOT NULL,
                medicine_group TEXT NOT NULL,
                medicine_howtouse TEXT,
                medicine_sideeffects TEXT
            )
        `);

        // Create the stock table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS stock (
                stock_id INTEGER PRIMARY KEY,
                stocktake_id INTEGER,
                medicine_id INTEGER,
                supplier_id INTEGER,
                partno TEXT NOT NULL,
                medicine_price REAL,
                medicine_expirydate DATE,
                medicine_qtyonhand INTEGER,
                medicine_qtycount INTEGER,
                FOREIGN KEY (medicine_id) REFERENCES medicine (medicine_id),
                FOREIGN KEY (supplier_id) REFERENCES supplier (supplier_id)
            )
        `);

        // Create the stocktake table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS stocktake (
                stocktake_id INTEGER PRIMARY KEY,
                user_id INTEGER,
                date DATE
            );
        `);

        // Create the groupmedicine table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS groupmedicine (
                group_id INTEGER PRIMARY KEY,
                user_id INTEGER,
                group_name TEXT NOT NULL,
                date DATE
            );
        `);

        // Create the notify table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS notify (
                notify_id INTEGER PRIMARY KEY,
                notifyfrom_id INTEGER,
                notify_action TEXT NOT NULL,
                notifyto_id TEXT NOT NULL,
                notify_read TEXT DEFAULT 'no',
                date DATE
            );
        `);

        // Create the combined_data VIEW if it doesn't exist
        db.run(`CREATE VIEW IF NOT EXISTS combined_data AS SELECT
                m.medicine_id,
                m.medicine_name,
                m.medicine_group,
                m.medicine_howtouse,
                m.medicine_sideeffects,
                s.stock_id,
                s.partno,
                s.medicine_price,
                s.medicine_expirydate,
                s.medicine_qtyonhand,
                s.medicine_qtycount,
                s.supplier_id
            FROM medicine AS m
            JOIN stock AS s ON m.medicine_id = s.medicine_id;
        `);

        // Create the saleclient VIEW if it doesn't exist
        db.run(`CREATE VIEW IF NOT EXISTS saleclient AS SELECT
            c.client_id,
            c.client_name,
            c.client_phone,
            c.nif,
            s.sales_id,
            s.seller_id,
            s.sales_totalprice,
            s.paymentmethod,
            s.date AS sales_date
            FROM client c
            JOIN sales s ON c.client_id = s.client_id;
        `);

        // Create the combine_csalespm VIEW if it doesn't exist
        db.run(`CREATE VIEW IF NOT EXISTS combine_csalespm AS
            SELECT
                c.client_id,
                c.client_name,
                c.client_phone,
                c.nif,
                s.sales_id,
                s.seller_id,
                s.sales_totalprice,
                s.date AS sales_date,
                p.product_id,
                p.medicine_id,
                p.product_name,
                p.product_qty,
                p.product_price,
                m.medicine_group
            FROM client c
            JOIN sales s ON c.client_id = s.client_id
            LEFT JOIN productsold p ON s.sales_id = p.sales_id
            LEFT JOIN medicine m ON p.medicine_id = m.medicine_id;
        `);

        // Create the combine_psoldmedicine VIEW that Combine productsold and medicine if it doesn't exist
        db.run(`CREATE VIEW IF NOT EXISTS combine_psoldmedicine AS
            SELECT
                ps.product_id,
                ps.medicine_id,
                ps.sales_id,
                ps.product_name,
                ps.product_qty,
                ps.product_price,
                ps.date,
                m.medicine_name,
                m.medicine_group,
                m.medicine_howtouse,
                m.medicine_sideeffects
            FROM productsold ps
            JOIN medicine m ON ps.medicine_id = m.medicine_id;
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS licence (
                id INTEGER PRIMARY KEY,
                machineId TEXT UNIQUE NOT NULL
            )
        `, (err) => {
            if (err) {
                console.error('Error creating licence table:', err.message);
            } else {
                // console.log('Licence table created successfully');
            }
        });

        // Create the subscription table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS subscriptions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                subscription TEXT NOT NULL,
                start_date DATE,
                expiration_date DATE
            );
        `, (err) => {
            if(err){
                return console.log(err.message)
            }

            const user_id = 1;
            const subscription_type = '10_minutes'; // Change this to test different subscription types
            const start_date = new Date();

            // Calculate expiration date based on subscription type
            let expiration_date = new Date(start_date);
            if (subscription_type === 'monthly') {
                expiration_date.setMonth(expiration_date.getMonth() + 1);
            } else if (subscription_type === 'trimesterly') {
                expiration_date.setMonth(expiration_date.getMonth() + 3);
            } else if (subscription_type === 'semesterly') {
                expiration_date.setMonth(expiration_date.getMonth() + 6);
            } else if (subscription_type === 'annually') {
                expiration_date.setFullYear(expiration_date.getFullYear() + 1);
            } else if (subscription_type === '10_minutes') {
                expiration_date.setMinutes(expiration_date.getMinutes() + 10);
            } else {
                // Handle invalid subscription types
                console.error('Invalid subscription type');
                return;
            }
        
            db.get(`SELECT COUNT(*) as count FROM subscriptions`, [], (err, row) => {
                if (err) {
                    console.error('Error checking subscription count:', err.message);
                    return;
                }
        
                if (row.count === 0) {
                    // Insert the new subscription into the table since it's empty
                    db.run(`
                        INSERT INTO subscriptions (user_id, subscription, start_date, expiration_date)
                        VALUES (?, ?, ?, ?);
                    `, [user_id, subscription_type, start_date, expiration_date], (err) => {
                        if (err) {
                            console.error('Error creating subscription:', err.message);
                        } else {
                            console.log('Subscription created successfully!');
                        }
                    });
                } else {
                    console.log('The subscriptions table is not empty. No new subscription created.');
                }
            });
        });
        
    }
})


// db.run('DROP VIEW IF EXISTS saleclient', (err) => {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log('saleclient VIEW deleted successfully');
//     }
// });


// db.run('DROP TABLE IF EXISTS productsold', (err) => {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log('productsold table deleted successfully');
//     }
// });


// try {
//     db.get('SELECT MAX(stocktake_id) AS last_id FROM stocktake', (err, row) => {
//         if (err) {
//             console.error(err);
//         } else {
//             console.log(row.last_id);
//         }
//     });
// } catch (error) {
//     console.error('Error executing query:', error);
// }

/*------------------------------------ Login ------------------------------------------------------*/
// Login route
backendApp.post('/loginn', (req, res) => {
const { username, password } = req.body;
db.get('SELECT * FROM createuser WHERE username = ?', [username], (err, user) => {
  if (err) return res.status(500).send('Error on the server.');
  if (!user) return res.send('No user found.');

  // Compare passwords
  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) return res.send({ auth: false, token: null });

  // Create a token
  const token = jwt.sign({ id: user.id }, config.jwtSecret, {
    expiresIn: 86400 // expires in 24 hours
  });

  // Return the token
  res.status(200).send({ auth: true, token: token, tokenid: user.id, un: user.username, tokentypo: user.status });
});
});

/*
db.all('SELECT * FROM createuser', (err, rows) => {
  if (err) {
      console.error(err.message);
  } else {
      console.log(rows);
  }
});




const id = 7;
const newPassword = 'kkkkkk';

      // Hash the new password
      bcrypt.hash(newPassword, 10, (hashErr, hashedNewPassword) => {
          if (hashErr) {
              res.status(500).json({ error: 'Error encrypting new password' });
          } else {
              // Update the password in the database
              db.run('UPDATE createuser SET password = ? WHERE id = ?', [hashedNewPassword, id], (updateErr) => {
                  if (updateErr) {
                      console.log(updateErr.message)
                  } else {
                      console.log('Password updated successfully')
                  }
              });
          }
      });

*/
/* ---------------------------- CRUD operations for the user table --------------------------------*/

// API endpoint to handle user registration
backendApp.post('/register', upload.none(), async (req, res) => {
  try {
      const { username, email, phone, bi, password, utype } = req.body;

      // Hash the password using bcrypt
      bcrypt.hash(password, 10, function(bcryptErr, hashedPassword) {

          if(bcryptErr) {
              console.error(err);
              res.status(500).json({ message: "Failed to encrypt password." });
          } else{
              // Insert user data into the createuser table
              db.run(`
                  INSERT INTO createuser (username, email, phone, bi, password, status)
                  VALUES (?, ?, ?, ?, ?, ?)
              `, [ username, email, phone, bi, hashedPassword, utype ], (err) => {
                  if (err) {
                      console.error(err.message);
                      res.status(500).json({ error: 'Error creating user', err: err.message });
                  } else {
                      res.status(201).json({ message: 'User created successfully' });
                  }
              });
          }
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to get all users
backendApp.get('/users', (req, res) => {
  // Retrieve all users from the createuser table
  db.all('SELECT id, username, email, phone, bi, status FROM createuser', (err, rows) => {
      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Error retrieving users', err: err.message });
      } else {
          res.status(200).json(rows);
      }
  });
});

backendApp.get('/getuser/:uid', (req, res) => {
  const uid = req.params.uid;
  
  // Retrieve a specific medicine record from the medicine table
  db.get('SELECT id, username, email, phone, bi, status FROM createuser WHERE id = ?', [uid], (err, row) => {
      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Error retrieving user record' });
      } else if (!row) {
          res.status(404).json({ error: 'User record not found' });
      } else {
          res.status(200).json(row);
      }
  });
});

// API endpoint to update a user by ID
backendApp.put('/updateuser/:id', (req, res) => {
  const userId = req.params.id;
  const { username, email, phone, bi } = req.body;

  // Update the user in the supplier table
  db.run(
      'UPDATE createuser SET username = ?, email = ?, phone = ?, bi = ? WHERE id = ?',
      [username, email, phone, bi, userId],
      (err) => {
          if (err) {
              console.error(err.message);
              res.status(500).json({ error: 'Error updating user', err: err.message });
          } else {
              res.status(200).json({ message: 'User updated successfully' });
          }
      }
  );
});

// API endpoint to delete a user by ID
backendApp.delete('/apagaruser/:id', (req, res) => {
  const userId = req.params.id;

  // Delete the user from the createuser table
  db.run('DELETE FROM createuser WHERE id = ?', [userId], (err) => {
      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Error deleting user', err: err.message });
      } else {
          res.status(200).json({ message: 'User deleted successfully' });
          console.error('User deleted successfully');
      }
  });
});

// Endpoint to check match password
backendApp.post('/checkpassword', async (req, res) => {
  try {
      const { id, oldPassword } = req.body; // request contains 'id' and 'oldPassword'

      // Retrieve the hashed password from the database
      db.get('SELECT password FROM createuser WHERE id = ?', [id], (err, row) => {
          if (err) {
              res.status(500).json({ error: 'Error fetching user data' });
              console.log(err.message);
          } else if (!row) {
              res.status(404).json({ error: 'User not found' });
              console.log('User not found');
          } else {
              const storedHashedPassword = row.password;

              // Compare old password with stored hashed password
              bcrypt.compare(oldPassword, storedHashedPassword, (bcryptErr, result) => {
                  if (bcryptErr) {
                      res.status(500).json({ error: 'Error comparing passwords' });
                      console.log(bcryptErr.message);
                  } else if (result) {
                      res.status(200).json({ message: 'Password matches' });
                  } else {
                      res.status(200).json({ message: 'Old password does not match' });
                  }
              });

              // if password is no encript
              // if(storedHashedPassword === oldPassword){
              //     res.status(200).json({ message: 'Password matches' });
              // } else {
              //     res.status(200).json({ message: 'Old password does not match' });
              // }
          }
      });
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to change user password
backendApp.post('/changepassword', async (req, res) => {
  try {
      const { id, newPassword } = req.body; // Assuming the request contains 'id', and 'newPassword'
      // Hash the new password
      bcrypt.hash(newPassword, 10, (hashErr, hashedNewPassword) => {
          if (hashErr) {
              res.status(500).json({ error: 'Error encrypting new password' });
          } else {
              // Update the password in the database
              db.run('UPDATE createuser SET password = ? WHERE id = ?', [hashedNewPassword, id], (updateErr) => {
                  if (updateErr) {
                      res.status(500).json({ error: 'Error updating password' });
                      console.log(updateErr.message)
                  } else {
                      res.status(200).json({ message: 'Password updated successfully' });
                  }
              });
          }
      });

  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
});

/* ---------------------------- CRUD operations for the companydetails table --------------------------------*/

// Create a new company detail
backendApp.post('/setcompanydetails', (req, res) => {
  const { company, contribuinte, email, telefone, city, address } = req.body;
  db.run(`INSERT INTO companydetails (company, contribuinte, email, telefone, city, address) VALUES (?, ?, ?, ?, ?, ?)`,
      [company, contribuinte, email, telefone, city, address],
      function (err) {
          if (err) {
              return res.status(500).json({ error: err.message });
          }
          res.status(201).json({ id: this.lastID });
      });
});

// Read all company details
backendApp.get('/getcompanydetails', (req, res) => {
  db.all(`SELECT * FROM companydetails`, [], (err, rows) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json({ data: rows });
  });
});

// Read a single company detail by ID
backendApp.get('/getcompanydetail/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM companydetails WHERE id = ?`, [id], (err, row) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json({ data: row });
  });
});

// Update a company detail by ID
backendApp.put('/updatecompanydetails/:id', (req, res) => {
  const { id } = req.params;
  const { company, contribuinte, email, telefone, city, address } = req.body;
  db.run(`UPDATE companydetails SET company = ?, contribuinte = ?, email = ?, telefone = ?, city = ?, address = ? WHERE id = ?`,
      [company, contribuinte, email, telefone, city, address, id],
      function (err) {
          if (err) {
              return res.status(500).json({ error: err.message });
          }
          res.json({ message: 'Company details updated successfully' });
      });
});

// Delete a company detail by ID
backendApp.delete('/apagarcompanydetails/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM companydetails WHERE id = ?`, [id], function (err) {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Company details deleted successfully' });
  });
});


/* ---------------------------- CRUD operations for the supplier table --------------------------------*/

// API endpoint to handle supplier registration
backendApp.post('/setsupplier', upload.none(), async (req, res) => {
  try {
      const { suppliername, email, phone, bi } = req.body;
      const date = new Date(); // Get the current date

      // Insert user data into the createuser table
      db.run(`
          INSERT INTO supplier (supplier_name, supplier_email, supplier_phone, supplier_bi, date)
          VALUES (?, ?, ?, ?, ?)
      `, [suppliername, email, phone, bi, date], (err) => {
          if (err) {
              console.error(err.message);
              res.status(500).json({ error: 'Error creating supplier', err: err.message });
          } else {
              res.status(201).json({ message: 'Supplier created successfully' });
          }
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to get all supplier
backendApp.get('/getSuppliers', (req, res) => {
  // Retrieve all users from the supplier table
  db.all('SELECT * FROM supplier', (err, rows) => {
      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Error retrieving users', err: err.message });
      } else {
          res.status(200).json(rows);
      }
  });
});

// API endpoint to get all supplier
backendApp.get('/api/getSupplier/:id', (req, res) => {
  const supplierId = req.params.id;
  // Retrieve user from the supplier table where id equal
  db.get('SELECT supplier_name FROM supplier WHERE supplier_id = ?', [supplierId], (err, rows) => {
      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Error retrieving users', err: err.message });
      } else {
          res.status(200).json(rows);
      }
  });
});

// API endpoint to update a supplier by ID
backendApp.put('/updateSupplier/:id', (req, res) => {
  const supplierId = req.params.id;
  const { suppliername, email, phone, bi } = req.body;

  // Update the user in the supplier table
  db.run(
      'UPDATE supplier SET supplier_name = ?, supplier_email = ?, supplier_phone = ?, supplier_bi = ? WHERE supplier_id = ?',
      [suppliername, email, phone, bi, supplierId],
      (err) => {
          if (err) {
              console.error(err.message);
              res.status(500).json({ error: 'Error updating supplier', err: err.message });
          } else {
              res.status(200).json({ message: 'Supplier updated successfully' });
          }
      }
  );
});


// API endpoint to delete a supplier by ID
backendApp.delete('/apagarsupplier/:id', (req, res) => {
  const userId = req.params.id;

  // Delete the user from the supplier table
  db.run('DELETE FROM supplier WHERE supplier_id = ?', [userId], (err) => {
      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Error deleting supplier', err: err.message });
      } else {
          res.status(200).json({ message: 'Supplier deleted successfully' });
      }
  });
});

/* ---------------------------- CRUD operations for the medicine table --------------------------------*/

// API endpoint to get all medicine
backendApp.get('/getmedicines', (req, res) => {
  // Retrieve all medicine records from the medicine table
  db.all('SELECT * FROM medicine', (err, rows) => {
      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Error retrieving medicine records' });
      } else {
          res.status(200).json(rows);
      }
  });
});

backendApp.get('/getmedicine/:medicineId', (req, res) => {
  const medicineId = req.params.medicineId;
  
  // Retrieve a specific medicine record from the medicine table
  db.get('SELECT * FROM medicine WHERE medicine_id = ?', [medicineId], (err, row) => {
      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Error retrieving medicine record' });
      } else if (!row) {
          res.status(404).json({ error: 'Medicine record not found' });
      } else {
          res.status(200).json(row);
      }
  });
});

// backendApp.get('/getmedicinebyname', upload.none(), async (req, res) => {
  
//     try {
//         const { groupname } = req.body;
//         const groupnameN = 'Analgesic';
//         console.log('Test => '+groupname)
      
//         // Retrieve a specific medicine record from the medicine table
//         db.all('SELECT * FROM medicine WHERE medicine_group = ?', [groupname], (err, rows) => {
//             if (err) {
//                 console.error(err.message);
//                 res.status(500).json({ error: 'Error retrieving medicine record', err: err.message });
//             } else if (!rows) {
//                 res.status(404).json({ error: 'Medicine record not found' });
//                 console.error('Medicine record not found');
//             } else {
//                 res.status(200).json(rows);
//                 console.error('Medicine record found');
//             }
//         });
//     } catch(error){
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error', err: error });
//     }
// });

backendApp.get('/api/medicines/:group_name', (req, res) => {
  const { group_name } = req.params;
  const groupName = decodeURIComponent(group_name);
  // Query the database to get the count
  db.get(
    'SELECT COUNT(*) AS medicine_count FROM medicine WHERE medicine_group = ?',
    [groupName],
    (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json({ medicineCount: row.medicine_count });
      }
    }
  );
});

backendApp.get('/api/searchmedicines', (req, res) => {
  const query = req.query.q;
  db.all(`SELECT * FROM medicine WHERE medicine_name LIKE '%${query}%'`, (err, rows) => {
      if (err) {
          console.error(err.message);
          return res.status(500).send('Internal Server Error');
      }
      res.send(rows);
  });
});

backendApp.post('/setmedicine', (req, res) => {
  const { medicineName, medicineGroup, howToUse, sideEffects } = req.body;
  
  // Insert a new medicine record into the medicine table
  db.run(`INSERT INTO medicine (medicine_name, medicine_group, medicine_howtouse, medicine_sideeffects) 
      VALUES (?, ?, ?, ?)`, 
      [medicineName, medicineGroup, howToUse, sideEffects], function(err) {

      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Error creating medicine record', err: err.message });
      } else {
          const lastInsertedId = this.lastID;
          res.status(201).json({ message: 'Medicine record created successfully', medicinelastid: lastInsertedId});
      }
  });
});

backendApp.put('/api/updatemedicine/:medicineId', (req, res) => {
  const medicineId = req.params.medicineId;
  const { medicine_name, medicine_group, medicine_howtouse, medicine_sideeffects } = req.body;
  const medicineGroupp = decodeURIComponent(medicine_group);
  
  // Update a specific medicine record in the medicine table
  db.run(`UPDATE medicine SET medicine_name = ?, medicine_group = ?, medicine_howtouse = ?, medicine_sideeffects = ? WHERE medicine_id = ?`, 
      [medicine_name, medicineGroupp, medicine_howtouse, medicine_sideeffects, medicineId], 
      function(err){
          if (err) {
              console.error(err.message);
              res.status(500).json({ error: 'Error updating medicine record' });
          } else {
              res.status(201).json({ message: 'Medicine record updated successfully' });
          }
      }
  );
});

backendApp.put('/updatemedicine/:medicineId', (req, res) => {
  const medicineId = req.params.medicineId;
  const { medicineName, medicineGroup, howToUse, sideEffects } = req.body;
  const medicineGroupp = decodeURIComponent(medicineGroup);
  
  // Update a specific medicine record in the medicine table
  db.run('UPDATE medicine SET medicine_name = ?, medicine_group = ?, medicine_howtouse = ?, medicine_sideeffects = ? WHERE medicine_id = ?', [medicineName, medicineGroupp, howToUse, sideEffects, medicineId], function(err){
      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Error updating medicine record' });
      } else {
          res.status(201).json({ message: 'Medicine record updated successfully' });
      }
  });
});

backendApp.delete('/apagarmedicine/:id', (req, res) => {
  const medicineId = req.params.id;
  
  // Delete a specific medicine record from the medicine table
  db.run('DELETE FROM medicine WHERE medicine_id = ?', [medicineId], (err) => {
      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Error deleting medicine record' });
      } else {
          res.status(200).json({ message: 'Medicine record deleted successfully' });
      }
  });
});

/* ---------------------------- CRUD operations for the stocktake table --------------------------------*/

// CRUD operations for the stocktake table
backendApp.get('/getstocktakes', (req, res) => {
  // Retrieve all stocktake records from the stocktake table
  db.all('SELECT * FROM stocktake', (err, rows) => {
      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Error retrieving stocktake records' });
      } else {
          res.status(200).json(rows);
      }
  });
});

backendApp.get('/getstocktake/lastid', (req, res) => {
  // Retrieve a last id stocktake record from the stocktake table
  db.get('SELECT MAX(stocktake_id) AS last_id FROM stocktake', (err, row) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
      } else {
          res.json({ lastId: row.last_id });
      }
  });
});
  
backendApp.get('/getstocktake/:id', (req, res) => {
  const stocktakeId = req.params.id;
  
  // Retrieve a specific stocktake record from the stocktake table
  db.get('SELECT * FROM stocktake WHERE stocktake_id = ?', [stocktakeId], (err, row) => {
      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Error retrieving stocktake record' });
      } else if (!row) {
          res.status(404).json({ error: 'Stocktake record not found' });
      } else {
          res.status(200).json(row);
      }
  });
});
  
backendApp.post('/setstocktake', (req, res) => {
  const { user_id, date } = req.body;
  
  // Insert a new stocktake record into the stocktake table
  db.run('INSERT INTO stocktake (user_id, date) VALUES (?, ?)', [user_id, date], function(err) {
      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Error creating stocktake record', err: err.message });
      } else {
          const lastInsertedId = this.lastID;
          res.status(201).json({ message: 'Stocktake record created successfully', stocktakeid: lastInsertedId });
      }
  });
});
  
backendApp.put('/updatestocktake/:id', (req, res) => {
  const stocktakeId = req.params.id;
  const { user_id, date } = req.body;
  
  // Update a specific stocktake record in the stocktake table
  db.run('UPDATE stocktake SET user_id = ?, date = ? WHERE stocktake_id = ?', [user_id, date, stocktakeId], (err) => {
      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Error updating stocktake record' });
      } else {
          res.status(200).json({ message: 'Stocktake record updated successfully' });
      }
  });
});
  
backendApp.delete('/apagarstocktake/:stocktakeId', (req, res) => {
  const stocktakeId = req.params.stocktakeId;
  
  // Delete a specific stocktake record from the stocktake table
  db.run('DELETE FROM stocktake WHERE stocktake_id = ?', [stocktakeId], (err) => {
      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Error deleting stocktake record' });
      } else {
          res.status(200).json({ message: 'Stocktake record deleted successfully' });
      }
  });
});


/* ---------------------------- CRUD operations for the stock table --------------------------------*/

backendApp.post('/setstock', (req, res) => {
  // Extract the data from the request body
  const { stocktakeid, medicineid, fornecedor, partno, medicinePrice, expiry, qntTotalStock } = req.body;
  
  // Insert the new stock entry into the database
  db.run(
  `INSERT INTO stock 
  (stocktake_id, medicine_id, supplier_id, partno, medicine_price, medicine_expirydate, medicine_qtyonhand, medicine_qtycount)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  [stocktakeid, medicineid, fornecedor, partno, medicinePrice, expiry, qntTotalStock, qntTotalStock],
  function (err) {
      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Error creating the stock entry', err: err.message });
      } else {
          res.status(200).json({ message: 'Stock entry created successfully' });
      }
  });
});

backendApp.get('/getstocks', (req, res) => {
  // Retrieve all stock entries from the database
  db.all('SELECT * FROM stock', (err, rows) => {
      if (err) {
          console.log(err);
          res.status(500).json({ error: 'Error retrieving the stock entries.', err: err.message});
      } else {
          res.status(200).json(rows);
      }
  });
});

backendApp.put('/updatestocks/:stock_id', (req, res) => {
  const stockId = req.params.stock_id;
  const { stocktakeid, medicineid, fornecedor, partno, medicinePrice, expiry, qntTotalStock, qntCountStock, medicineOldCount } = req.body;
  const medicine_qtyonhand = qntCountStock === 0 ? qntTotalStock : qntTotalStock;
  const medicine_qtycount = qntCountStock === 0 ? medicineOldCount : qntTotalStock;
  // Update the stock entry in the database
  db.run(
      `UPDATE stock SET stocktake_id = ?, medicine_id = ?, supplier_id = ?, partno = ?, medicine_price = ?, medicine_expirydate = ?, medicine_qtyonhand = ?, medicine_qtycount = ?
      WHERE stock_id = ?`,
      [stocktakeid, medicineid, fornecedor, partno, medicinePrice, expiry, medicine_qtyonhand, medicine_qtycount, stockId],
      function (err) {
          if (err) {
              console.log(err);
              res.status(500).send('Error occurred while updating the stock entry.');
          } else {
              res.status(200).json({ message: 'Stock entry updated successfully.'});
          }
      }
  );
});

backendApp.put('/api/updatestock', (req, res) => {
  const { cart } = req.body;
  try {
      // Update the stock entry in the database
      cart.forEach(async (item) => {
          db.run(
              `UPDATE stock SET medicine_qtyonhand = ? WHERE stock_id = ?`, [(item.medicine_qtyonhand - item.cartQuantity), item.stock_id],
              function (err) {
                  if (err) {
                      console.log(err);
                      return res.status(500).json({ message: 'Internal Arror updating the stock entry.' });
                  }
              }
          );
      });

      res.status(200).json({ message: 'Stock entry updated successfully.' });
      
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error updated client' });
  }
});

backendApp.delete('/apagarstock/:stock_id', (req, res) => {
  const stockId = req.params.stock_id;
  
  // Delete the stock entry from the database
  db.run(`DELETE FROM stock WHERE stock_id = ?`, [stockId], function (err) {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred while deleting the stock entry.');
      } else {
          res.status(200).send('Stock entry deleted successfully.');
      }
  });
});

/* ---------------------------- CRUD operations for the groupmedicine table --------------------------------*/

// API endpoint to get all groupmedicine
backendApp.get('/getgroupmedicines', (req, res) => {
  // Retrieve all group medicine records from the groupmedicine table
  db.all('SELECT * FROM groupmedicine', (err, rows) => {
      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Error retrieving groupmedicine records' });
      } else {
          res.status(200).json(rows);
      }
  });
});

backendApp.get('/getgroupmedicine/:id', (req, res) => {
  const groupId = req.params.id;
  
  // Retrieve a specific groupmedicine record from the groupmedicine table
  db.get('SELECT * FROM groupmedicine WHERE group_id = ?', [groupId], (err, row) => {
      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Error retrieving groupmedicine record' });
      } else if (!row) {
          res.status(404).json({ error: 'Groupmedicine record not found' });
      } else {
          res.status(200).json(row);
      }
  });
});

backendApp.post('/setgroupmedicine', (req, res) => {
  const { user_id, groupName, date } = req.body;
  const group_name = decodeURIComponent(groupName)
  
  // Insert a new group medicine record into the groupmedicine table
  db.run(`INSERT INTO groupmedicine (user_id, group_name, date) 
      VALUES (?, ?, ?)`, 
      [user_id, group_name, date], function(err) {

      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Error creating groupmedicine record', err: err.message });
      } else {
          res.status(201).json({ message: 'Groupmedicine record created successfully' });
      }
  });
});

backendApp.delete('/apagargroupmedicine/:id', (req, res) => {
  const groupId = req.params.id;
  
  // Delete a specific group medicine record from the groupmedicine table
  db.run('DELETE FROM groupmedicine WHERE group_id = ?', [groupId], (err) => {
      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Error deleting groupmedicine record' });
      } else {
          res.status(200).json({ message: 'Groupmedicine record deleted successfully' });
      }
  });
});

/* --------------------------- Combine medicine and stock ------------------------------------------------------------*/


// Define a route to retrieve combined data
backendApp.get('/combineddata', (req, res) => {
  db.all('SELECT * FROM combined_data', (err, rows) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
      } else {
          res.status(200).json(rows);
      }
  });
});

backendApp.get('/api/searchcombineddata', (req, res) => {
  const query = req.query.q;
  db.all(`SELECT * FROM combined_data WHERE medicine_name LIKE '%${query}%'`, (err, rows) => {
      if (err) {
          console.error(err.message);
          return res.status(500).send('Internal Server Error');
      }
      res.send(rows);
  });
});

// Define a route to retrieve combined data
backendApp.get('/api/combinedatas/:id', (req, res) => {
  const supplierId = req.params.id;
  const sql = `SELECT * FROM combined_data WHERE supplier_id = ?`;
  db.get(sql, [supplierId], (err, rows) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
      } else {
          res.status(200).json(rows);
      }
  });
});

/* --------------------------- Combine client and sales ------------------------------------------------------------*/

// Define a route to retrieve combined data
backendApp.get('/api/saleclient', (req, res) => {
  db.all('SELECT * FROM saleclient', (err, rows) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
      } else {
          res.status(200).json(rows);
      }
  });
});

/* --------------------------- Combine client, sales, productsold and medicine ------------------------------------------------------------*/

backendApp.get('/api/combine_csalespm', (req, res) => {
  db.all('SELECT * FROM combine_csalespm', (err, rows) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
      } else {
          res.json(rows);
      }
  });
});

/* ---------------------------Combine productsold and medicine ------------------------------------------------------------*/

backendApp.get('/api/combine_psoldmedicine', (req, res) => {
  db.all('SELECT * FROM combine_psoldmedicine', (err, rows) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
      } else {
          res.json(rows);
      }
  });
});

backendApp.get('/api/combinepsoldmedicines', (req, res) => {
    db.all(`SELECT * FROM combine_psoldmedicine WHERE sales_id NOT IN (
            SELECT sales_id 
            FROM creditnote
        );`, (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(rows);
        }
    });
});



/* --------------------------- CRUD for Client ----------------------------------------------------*/

// Define CRUD routes for the 'client' table
backendApp.get('/getclients', async (req, res) => {
  try {
      db.all('SELECT * FROM client', (err, rows) => {
          if (err) {
              res.status(500).json({ error: err.message });
          } else {
              res.status(200).json(rows);
          }
      });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error retrieving client' });
  }
});

// Create a new client
backendApp.post('/setclient', async (req, res) => {
  const { clientname, clientphone, nif } = req.body;
  const date = new Date();
  try {
      db.run(
          `INSERT INTO client (client_name, client_phone, nif, date) VALUES (?, ?, ?, ?)`,
          [clientname, clientphone, nif, date],
          function(err) {
              if (err) {
                  console.log(err.message);
                  res.status(500).json({ error: 'Internal error', err: err.message });
              } else {
                  const cId = this.lastID;
                  res.status(201).json({ message: 'Client added successfully', clientid: cId });
              }
          }
      );
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error adding client' });
  }
});

// Update a client
backendApp.put('/updateclient/:id', async (req, res) => {
  const { id } = req.params;
  const { client_name, client_phone, nif } = req.body;
  try {
      db.run(
          'UPDATE client SET client_name = ?, client_phone = ?, nif = ? WHERE client_id = ?',
          [client_name, client_phone, nif, id],
          (err) => {
              if (err) {
                  res.status(500).json({ error: err.message });
              } else {
                  res.status(200).json({ message: 'Client updated successfully' });
              }
          }
      );
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error updating client' });
  }
});

// Delete a client
backendApp.delete('/apagarclient/:id', async (req, res) => {
  const { id } = req.params;
  try {
      db.run('DELETE FROM client WHERE client_id = ?', [id], (err) => {
          if (err) {
              res.status(500).json({ error: err.message });
          } else {
              res.status(200).json({ message: 'Client deleted successfully' });
          }
      });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error deleted client' });
  }
});
  
/* ---------------------------- CRUD operations for the sales table --------------------------------*/

// ** Create (POST) a new sale **
backendApp.post('/setsales', async (req, res) => {
  const { clientid, sellerid, salestotalprice, paymentmethod, change, productsSold } = req.body;
  const date = new Date();
  try {
      const insert = `INSERT INTO sales (client_id, seller_id, sales_totalprice, paymentmethod, change, date) VALUES (?, ?, ?, ?, ?, ?)`;

      db.run(insert, [clientid, sellerid, salestotalprice, paymentmethod, change, date], function(err) {
          if(err){
              console.error(err);
              res.status(500).json({ error: 'Internal server error', err: err.message });
          }else{  
              const salesId = this.lastID;
          
              const insertProductsSales = `INSERT INTO productsold (medicine_id, sales_id, product_name, product_qty, product_price, date) VALUES (?, ?, ?, ?, ?, ?)`;
              
              productsSold.forEach(async (item) => {
                  db.run(insertProductsSales, [item.medicine_id, salesId, item.medicine_name, item.cartQuantity, item.medicine_price, date], (err) => {
                      if(err) {
                          console.error(err);
                          res.status(500).json({ error: 'Internal server error', err: err.message });
                      }
                  });
              });
              
              res.status(201).json({ message: 'Sale created successfully' });
          }

      });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error creating sale' });
  }
});

// db.all('SELECT * FROM stock', (err, sales)=>{
//     if(err){
//         console.error(err);
//         res.status(500).json({ error: 'Internal server error', err: err.message });
//     }else{
//         if (sales) {
//             console.log(sales);
//         } else {
//             res.status(404).json({ message: 'stock not found' });
//         }
//     }
// });

// ** Read (GET) all sales or a specific sale by ID **
backendApp.get('/getsales', async (req, res) => {
  const { id } = req.query;
  try {
      if (id) {
          const select = `SELECT * FROM sales WHERE sales_id = ?`;
          db.get(select, [id], (err, sale) =>{
              if(err){
                  console.error(err);
                  res.status(500).json({ error: 'Internal server error', err: err.message });
              }else{
                  if (sale) {
                      res.json(sale);
                  } else {
                      res.status(404).json({ message: 'Sale not found' });
                  }
              }
          });
      } else {
          const select = `SELECT * FROM sales`;
          db.all(select, (err, sales)=>{
              if(err){
                  console.error(err);
                  res.status(500).json({ error: 'Internal server error', err: err.message });
              }else{
                  if (sales) {
                      res.json(sales);
                  } else {
                      res.status(404).json({ message: 'Sale not found' });
                  }
              }
          });
      }
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error retrieving sales' });
  }
});

// ** Update (PUT) a sale by ID **
backendApp.put('/updatesale/:id', async (req, res) => {
  const { id } = req.params;
  const { client_id, seller_id, sales_totalprice, date } = req.body;
  try {
      const update = `UPDATE sales SET client_id = ?, seller_id = ?, sales_totalprice = ?, date = ? WHERE sales_id = ?`;
      db.run(update, [client_id, seller_id, sales_totalprice, date, id]);
      res.json({ message: 'Sale updated successfully' });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error updating sale' });
  }
});

// ** Delete (DELETE) a sale by ID **
backendApp.delete('/apagarsale/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const deleteQuery = `DELETE FROM sales WHERE sales_id = ?`;
      db.run(deleteQuery, [id]);
      res.json({ message: 'Sale deleted successfully' });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error deleting sale' });
  }
});

backendApp.get('/getLastSalesId', (req, res) => {
  db.get('SELECT sales_id FROM sales ORDER BY sales_id DESC LIMIT 1', (err, row) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json(row);
  });
});

/////////////////////////////////////----CRUD for credit note---///////////////////////////////////////////////////////////////////

backendApp.get('/getLastCreditNoteId', (req, res) => {
  db.get('SELECT cn_id FROM creditnote ORDER BY cn_id DESC LIMIT 1', (err, row) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json(row);
  });
});

// Create a new creditnote
backendApp.post('/setcreditnotes', (req, res) => {
  const { sales_id, seller_id } = req.body;
  const date = new Date();
  
  // First, check if the record with the same sales_id already exists
  db.get('SELECT * FROM creditnote WHERE sales_id = ?', [sales_id], (err, row) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      if (row) {
          // Record with the same sales_id already exists
          return res.json({ error: 'já creditado' });
      }

      // If no existing record is found, insert the new credit note
      db.run('INSERT INTO creditnote (sales_id, date, seller_id) VALUES (?, ?, ?)', [sales_id, date, seller_id], function(err) {
          if (err) {
              return res.status(500).json({ error: err.message });
          }
          res.status(201).json({ cn_id: this.lastID });
      });
  });
});

// Read all creditnotes
backendApp.get('/getcreditnotes', (req, res) => {
  db.all('SELECT * FROM creditnote', [], (err, rows) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(rows);
  });
});

// Read a single creditnote
backendApp.get('/getcreditnote/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM creditnote WHERE cn_id = ?', [id], (err, row) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(row);
  });
});


// Read a single creditnote by sell id
backendApp.get('/getcreditnotesele/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM creditnote WHERE sales_id = ?', [id], (err, row) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      if(!row){
          return res.json({message: 'Good to go'});
      }

      if(row){
          return res.json({message: 'Already Credit'});
      }
      
  });
});

// Update a creditnote
backendApp.put('/updatecreditnotes/:id', (req, res) => {
  const { id } = req.params;
  const { sales_id, date, seller_id } = req.body;
  db.run('UPDATE creditnote SET sales_id = ?, date = ?, seller_id = ? WHERE cn_id = ?', [sales_id, date, seller_id, id], function(err) {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Creditnote updated' });
  });
});

// Delete a creditnote
backendApp.delete('/apagarcreditnotes/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM creditnote WHERE cn_id = ?', [id], function(err) {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Creditnote deleted' });
  });
});

/* --------------------------- CRUD for Notify ----------------------------------------------------*/


// Define CRUD routes for the 'notify' table
backendApp.get('/getnotifys', async (req, res) => {
  try {
      db.all('SELECT * FROM notify ORDER BY notify_id DESC', (err, rows) => {
          if (err) {
              res.status(500).json({ error: err.message });
          } else {
              res.status(200).json(rows);
          }
      });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error retrieving notify' });
  }
});

// Create a new notify
backendApp.post('/setnotify', async (req, res) => {
  const { notifyfrom_id, notify_action, notifyto_id } = req.body;
  const date = new Date();
  try {
      db.run(
          `INSERT INTO notify (notifyfrom_id, notify_action, notifyto_id, date) VALUES (?, ?, ?, ?)`,
          [notifyfrom_id, notify_action, notifyto_id, date],
          (err) => {
              if (err) {
                  res.status(500).json({ error: 'Internal error', err: err.message });
                  console.log(err.message);
              } else {
                  res.status(201).json({ message: 'Notify added successfully' });
              }
          }
      );
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error adding notify' });
  }
});

// Update a notify
backendApp.put('/updatenotify/:id', async (req, res) => {
  const { id } = req.params;
  const notify_read = 'yes';
  try {
      db.run(
          'UPDATE notify SET notify_read = ? WHERE notify_id = ?',
          [notify_read, id],
          (err) => {
              if (err) {
                  res.status(500).json({ error: err.message });
              } else {
                  res.status(200).json({ message: 'Notify updated successfully' });
              }
          }
      );
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error updating notify' });
  }
});

// Delete a notify
backendApp.delete('/apagarnotify/:id', async (req, res) => {
  const { id } = req.params;
  try {
      db.run('DELETE FROM notify WHERE notify_id = ?', [id], (err) => {
          if (err) {
              res.status(500).json({ error: err.message });
          } else {
              res.status(200).json({ message: 'Notify deleted successfully' });
          }
      });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error deleted notify' });
  }
});

/*---------------------------------------------------- */
backendApp.post('/subscribe', (req, res) => {
    const { user_id, subscription_type } = req.body;

    // Calculate expiration date based on subscription type
    let expiration_date = new Date();
    if (subscription_type === 'monthly') {
        expiration_date.setMonth(expiration_date.getMonth() + 1);
    } else if (subscription_type === 'trimesterly') {
        expiration_date.setMonth(expiration_date.getMonth() + 3);
    } else if (subscription_type === 'semesterly') {
        expiration_date.setMonth(expiration_date.getMonth() + 6);
    } else if (subscription_type === 'annually') {
        expiration_date.setFullYear(expiration_date.getFullYear() + 1);
    }else if (subscription_type === '10_minutes') {
        expiration_date.setMinutes(expiration_date.getMinutes() + 10);
    } else {
        // Handle invalid subscription types
        console.error('Invalid subscription type');
        return;
    }

    // Insert subscription data into SQLite database
    const query = 'INSERT INTO subscriptions (user_id, subscription, start_date, expiration_date) VALUES (?, ?, ?, ?)';
    db.run(query, ['a'+user_id, subscription_type, new Date(), expiration_date], (err) => {
        if (err) {
            console.log(err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Subscription created successfully' });
        console.log('Subscription created successfully');
    });
});

backendApp.get('/check-subscription/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  const query = 'SELECT * FROM subscriptions WHERE id = ?';
  db.get(query, [user_id], (err, row) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }

      if (!row) {
          res.json({ message: 'User does not have an active subscription' });
          return;
      }

      const expiration_date = new Date(row.expiration_date);
      if (new Date() <= expiration_date) {
          res.json({ message: 'User has an active subscription' });
          // console.log(expiration_date);
      } else {
          res.json({ message: 'User subscription has expired' });
      }
  });
});

// db.run('DROP TABLE IF EXISTS subscriptions', (err) => {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log('subscriptions table deleted successfully');
//     }
// });


/*----------------------------------------------xml saft----------------------------------------------------*/


backendApp.get('/api/export-xml', async (req, res) => {
  const { year, month } = req.query;
  try {
      if (!year || !month) {
          res.status(400).send('Year and month are required');
          return;
      }

      const startDate = new Date(year, month - 1, 2);
      // const endDate = new Date(year, month, 1);
      const endDate = new Date();

      const companyQuery = 'SELECT * FROM companydetails LIMIT 1';
      db.get(companyQuery, [], (companyErr, companyResult) => {
          if (companyErr) {
              console.error(companyErr);
              res.status(500).send('Failed to fetch company email');
              return;
          }

          const emailid = companyResult.email;

          const productQuery = `SELECT * FROM combine_psoldmedicine WHERE date >= ? AND date < ? 
          AND sales_id NOT IN (
              SELECT sales_id 
              FROM creditnote 
              WHERE date >= ? 
              AND date < ?
          );`;
          const customerQuery = `SELECT * FROM saleclient WHERE sales_date >= ? AND sales_date < ?
          AND sales_id NOT IN (
              SELECT sales_id 
              FROM creditnote 
              WHERE date >= ? 
              AND date < ?
          );
          `;
          const creditNoteQuery = `SELECT * FROM creditnote WHERE date >= ? AND date < ?`;

          db.all(productQuery, [startDate, endDate, startDate, endDate], (productErr, productResults) => {
              if (productErr) {
                  console.error(productErr);
                  res.status(500).send('Failed to fetch product data');
                  return;
              }

              db.all(customerQuery, [startDate, endDate, startDate, endDate], (customerErr, customerResults) => {
                  if (customerErr) {
                      console.error(customerErr);
                      res.status(500).send('Failed to fetch customer data');
                      return;
                  }

                  db.all(creditNoteQuery, [startDate, endDate], (creditNoteErr, creditNoteResults) => {
                      if (creditNoteErr) {
                          console.error(creditNoteErr);
                          res.status(500).send('Failed to fetch credit note data');
                          return;
                      }

                      const formatTotal = (amount) => {
                          if (String(amount).includes(",")) {
                              amount = Number(amount.replace(",", "."));
                          }
                          return Number(amount);
                      };

                      const generateUniqueTaxID = (index) => {`999999999`};

                      // console.log(customerResults);

                      const customers = customerResults.map((customer, index) => ({
                          CustomerID: customer.client_id.toString(),
                          AccountID: 'Desconhecido',
                          CustomerTaxID: customer.nif? customer.nif: `999999999`,
                          CompanyName: customer.client_name,
                          BillingAddress: {
                              AddressDetail: 'Desconhecido',
                              City: 'Desconhecido',
                              Country: 'AO'
                          },
                          ShipToAddress: {
                              AddressDetail: 'Desconhecido',
                              City: 'Desconhecido',
                              Province: 'Desconhecido',
                              Country: 'AO'
                          },
                          SelfBillingIndicator: 0
                      }));

                      const products = productResults.map(product => ({
                          ProductType: 'P',
                          ProductCode: 'FV1000' + product.product_id,
                          ProductDescription: product.medicine_name,
                          ProductNumberCode: 'FV1000' + product.product_id
                      }));
                      // console.log(products);

                      const privateKeyPem = fs.readFileSync('key.pem', 'utf-8');

                      const calculateHash = (invoice, previousHash) => {
                          let hashString = '';
                          if(previousHash === ''){
                              hashString = `${invoice.InvoiceDate};${invoice.SystemEntryDate};${invoice.InvoiceNo};${invoice.DocumentTotals.GrossTotal};`;
                          }else{
                              hashString = `${invoice.InvoiceDate};${(invoice.SystemEntryDate)};${invoice.InvoiceNo};${invoice.DocumentTotals.GrossTotal};${previousHash}`;
                          }
                          // console.log(hashString);
                          // 2024-06-29;2024-06-29T16:53:59;FR 2024/1;200.00;

                          // Carregar a chave privateKeyPem.pem
                          const privateKeyy = forge.pki.privateKeyFromPem(privateKeyPem);
                          // Criar um hash SHA-1 da mensagem
                          const md = forge.md.sha1.create();
                          md.update(hashString, 'utf8');
                          // Assinar digitalmente o hash com a chave privada
                          const signature = privateKeyy.sign(md);
                          // Converter a assinatura para Base64
                          const signatureBase64 = forge.util.encode64(signature);
                          return signatureBase64;
                          // return crypto.createHash('sha1').update(hashString).digest('base64');
                      };

                      let previousHash = '';
                      const invoices = customerResults.map(customer => {
                          const customerProducts = productResults.filter(product => product.sales_id === customer.sales_id);
                          const customerCreditNotes = creditNoteResults.filter(note => note.sales_id === customer.sales_id);
                          const customerCreditNotesProduct = customerProducts.filter(product =>
                              customerCreditNotes.some(note => note.sales_id === product.sales_id)
                          );
                          const netTotal = formatTotal(customer.sales_totalprice).toFixed(2);

                          const lines = customerProducts.map((product, index) => {
                              // console.log(product)
                              const productPrice = formatTotal(product.product_price).toFixed(2);
                              return {
                                  LineNumber: (index + 1).toString(),
                                  ProductCode: 'FV1000' + product.product_id,
                                  ProductDescription: product.medicine_id,
                                  Quantity: `${product.product_qty}`,
                                  UnitOfMeasure: 'Unidade',
                                  UnitPrice: productPrice,
                                  TaxPointDate: new Date(customer.sales_date).toISOString().split("T")[0],
                                  Description: product.medicine_name,
                                  CreditAmount: (parseFloat(productPrice) * parseFloat(formatTotal(product.product_qty))).toFixed(2),
                                  Tax: {
                                      TaxType: 'IVA',
                                      TaxCountryRegion: 'AO',
                                      TaxCode: 'ISE',
                                      TaxPercentage: '0.0000'
                                  },
                                  TaxExemptionReason: 'Isento nos termos da alínea b) do nº1 do artigo 12.º do CIVA',
                                  TaxExemptionCode: 'M11',
                                  SettlementAmount: 0
                              };
                          });

                          // Add credit note lines
                          // customerCreditNotesProduct.forEach((note, index) => {
                          //     lines.push({
                          //         LineNumber: (lines.length + 1).toString(),
                          //         ProductCode: 'FV1000' + note.product_id,
                          //         ProductDescription: 'Product Return',
                          //         Quantity: '1',
                          //         UnitOfMeasure: 'Unidade',
                          //         UnitPrice: (formatTotal(note.product_price)).toFixed(2),
                          //         TaxPointDate: new Date(note.date).toISOString().split("T")[0],
                          //         Description: 'Return of defective product',
                          //         CreditAmount: (-(parseFloat(note.product_price) * parseFloat(note.product_qty))).toFixed(2),
                          //         Tax: {
                          //             TaxType: 'IVA',
                          //             TaxCountryRegion: 'AO',
                          //             TaxCode: 'ISE',
                          //             TaxPercentage: '0.0000'
                          //         },
                          //         TaxExemptionReason: 'Isento nos termos da alínea b) do nº1 do artigo 12.º do CIVA',
                          //         TaxExemptionCode: 'M11',
                          //         SettlementAmount: 0
                          //     });
                          // });

                          const invoice = {
                              InvoiceNo: 'FR 2024/' + customer.sales_id,
                              DocumentStatus: {
                                  InvoiceStatus: 'N',
                                  InvoiceStatusDate: new Date(customer.sales_date).toISOString().slice(0, 19),
                                  SourceID: emailid,
                                  SourceBilling: 'P'
                              },
                              Hash: '',
                              HashControl: 1,
                              Period: (new Date(customer.sales_date).getMonth() + 1).toString().padStart(2, '0'),
                              InvoiceDate: new Date(customer.sales_date).toISOString().split("T")[0],
                              InvoiceType: 'FR',
                              SpecialRegimes: {
                                  SelfBillingIndicator: 0,
                                  CashVATSchemeIndicator: 0,
                                  ThirdPartiesBillingIndicator: 0
                              },
                              SourceID: emailid,
                              SystemEntryDate: new Date(customer.sales_date).toISOString().slice(0, 19),
                              CustomerID: customer.client_id.toString(),
                              ShipTo: {
                                  Address: {
                                      BuildingNumber: 'Luanda',
                                      StreetName: 'Luanda',
                                      AddressDetail: 'Luanda',
                                      City: 'Luanda',
                                      Province: 'Luanda',
                                      Country: 'AO'
                                  }
                              },
                              ShipFrom: {
                                  Address: {
                                      BuildingNumber: 'Luanda',
                                      StreetName: 'Luanda',
                                      AddressDetail: 'Luanda',
                                      City: 'Luanda',
                                      Province: 'Luanda',
                                      Country: 'AO'
                                  }
                              },
                              Line: lines,
                              DocumentTotals: {
                                  TaxPayable: parseFloat(0).toFixed(2),
                                  NetTotal: lines.reduce((total, line) => total + parseFloat(line.CreditAmount), 0).toFixed(2),
                                  GrossTotal: lines.reduce((total, line) => total + parseFloat(line.CreditAmount), 0).toFixed(2)
                              }
                          };

                          invoice.Hash = calculateHash(invoice, previousHash);
                          previousHash = invoice.Hash;

                          return invoice;
                      });

                      const totalCredit = invoices.reduce((total, invoice) => {
                          return total + parseFloat(invoice.DocumentTotals.NetTotal);
                      }, 0).toFixed(2);

                      // console.log(companyResult);

                      const root = xmlbuilder.create({
                          AuditFile: {
                              '@xmlns': 'urn:OECD:StandardAuditFile-Tax:AO_1.01_01',
                              '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                              Header: {
                                  AuditFileVersion: '1.01_01',
                                  CompanyID: companyResult.contribuinte,
                                  TaxRegistrationNumber: companyResult.contribuinte,
                                  TaxAccountingBasis: 'F',
                                  CompanyName: companyResult.company,
                                  BusinessName: 'Farmácia',
                                  CompanyAddress: {
                                      AddressDetail: companyResult.address,
                                      City: companyResult.city,
                                      Country: 'AO'
                                  },
                                  FiscalYear: year,
                                  StartDate: startDate.toISOString().split("T")[0],
                                  EndDate: endDate.toISOString().split("T")[0],
                                  CurrencyCode: 'AOA',
                                  DateCreated: new Date().toISOString().split("T")[0],
                                  TaxEntity: 'Global',
                                  ProductCompanyTaxID: '5417141828',
                                  SoftwareValidationNumber: '480/AGT/2024',
                                  ProductID: 'Pharm App/SOFTWISE INVESTIMENT - PRESTAÇAO DE SERVIÇOS, LDA',
                                  ProductVersion: 'Ver.1.0.1',
                                  HeaderComment: 'Aplicação de Facturação',
                                  Telephone: companyResult.telefone,
                                  Fax: '0',
                                  Email: emailid
                              },
                              MasterFiles: {
                                  Customer: customers,
                                  Product: products
                              },
                              SourceDocuments: {
                                  SalesInvoices: {
                                      NumberOfEntries: invoices.length.toString(),
                                      TotalDebit: 0,
                                      TotalCredit: totalCredit,
                                      Invoice: invoices
                                  },
                                  Payments: {
                                      NumberOfEntries: 0,
                                      TotalDebit: 0,
                                      TotalCredit: totalCredit
                                  }
                              },
                          }
                      });

                      const xmlString = root.end({ pretty: true });

                      const filename = `saft-da-farmacia-${new Date().toISOString().split("T")[0]}.xml`;
                      fs.writeFile(filename, xmlString, (err) => {
                          if (err) {
                              console.error(err);
                              res.status(500).send('Failed to export data as XML');
                              return;
                          }
                          console.log('XML data exported successfully');

                          fs.readFile(filename, (err, data) => {
                              if (err) {
                                  console.error(err);
                                  res.status(500).send('Failed to read the file');
                                  return;
                              }

                              res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                              res.setHeader('Content-type', 'application/xml');
                              res.send(data);
                              fs.unlinkSync(filename); // Delete the file after sending it
                          });
                      });
                  });
              });
          });
      });
  } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
  }
});


/* --------------------- backup ---------------------------- */

// // Function to backup the database
// function backupDatabaseMinuto() {
//     const backupDir = path.join('C:', 'pharmacy');
//     if (!fs.existsSync(backupDir)) {
//         fs.mkdirSync(backupDir, { recursive: true });
//     }

//     const sourceDBPath = 'pharmy.db';
//     const backupDBPath = path.join(backupDir, `pharmy-backup-minute.db`);

//     fs.copyFile(sourceDBPath, backupDBPath, (err) => {
//         if (err) {
//             console.error('Error during database backup:', err);
//         } else {
//             console.log(`Database backup successful: ${backupDBPath}`);
//         }
//     });
// }

// // Schedule the backup to run every two hours
// cron.schedule('0 */2 * * *', () => {
//     console.log('Running database backup every two hours...');
//     backupDatabaseMinuto();
// });

// Function to backup the database
function backupDatabase() {
  const backupDir = path.join('C:', 'pharmacy');
  if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
  }

  const sourceDBPath = 'pharmy.db';
  const backupDBPath = path.join(backupDir, `pharmy-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.db`);

  fs.copyFile(sourceDBPath, backupDBPath, (err) => {
      if (err) {
          console.error('Error during database backup:', err);
      } else {
          console.log(`Database backup successful: ${backupDBPath}`);
          fs.writeFileSync(path.join(backupDir, 'last_backup.txt'), new Date().toISOString());
      }
  });
}

// Check if a backup is needed on server start
function checkLastBackup() {
  const backupDir = path.join('C:', 'pharmacy');
  const lastBackupFile = path.join(backupDir, 'last_backup.txt');

  if (fs.existsSync(lastBackupFile)) {
      const lastBackup = new Date(fs.readFileSync(lastBackupFile, 'utf8'));
      const now = new Date();

      // Check if the last backup was from a different day
      if (now.toDateString() !== lastBackup.toDateString()) {
          console.log('Creating a backup since the last one was not from today...');
          backupDatabase();
      }
  } else {
      console.log('No backup record found. Creating the first backup...');
      backupDatabase();
  }
}

// Schedule the backup to run every day at 16:00 (4 PM)
cron.schedule('0 16 * * *', () => {
  console.log('Running daily database backup at 16:00...');
  backupDatabase();
});

// API endpoint to check license
backendApp.get('/check-license', async (req, res) => {
    try {
        // Retrieve machineId from licence table
        const storedMachineId = await new Promise((resolve, reject) => {
            db.get('SELECT machineId FROM licence WHERE id = 1', (err, row) => {
                if (err) reject(err);
                resolve(row ? row.machineId : null);
            });
        });

        // Retrieve current machineId
        const currentMachineId = await machineId();
        // console.log(currentMachineId)
        const hashedID = crypto.createHash('sha256').update('pakb03-t'+currentMachineId).digest('hex'); // Hash the ID

        // Compare storedMachineId with currentMachineId
        if (storedMachineId === hashedID) {
            res.json({ message: 'License matched' });
        } else {
            res.status(403).json({ error: 'License does not match' });
        }
    } catch (error) {
        console.error('Error checking license:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server

const server = backendApp.listen(PORT, () => {
  console.log(`Express server running on port ${PORT} at Electron`);
});

/*======================== Electon file ======================================== */

const createWindow = () => {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#3b3b3b",
      symbolColor: "#74b1be",
      height: 32,
    },
  });

  win.setMenu(null); // Remove the menu bar completely

  //   const indexPath = path.join(__dirname, 'build', 'index.html');
  //   console.log('Loading:', indexPath);

  //   win.loadFile(indexPath);

  win.loadURL(`http://localhost:${PORT}`);

  // Open the DevTools.
  //   win.webContents.openDevTools()
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
