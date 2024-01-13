const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./.env" });
require("./config/db");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const constantRoutes = require("./routes/constantsRoutes");
const paveRoutes = require("./routes/paveRoutes");
const materielRoutes = require("./routes/materielRoutes");
const devisRoutes = require("./routes/devisRoutes");
const factureRoutes = require("./routes/factureRoutes");
const clientRoutes = require("./routes/clientRoutes");
const documentRoutes = require("./routes/documentRoutes");
const paiementRoutes = require("./routes/paiementRoutes");
const billRoutes = require("./routes/billRoutes");
// const { checkUser, requireAuth } = require("./middleware/auth.middleware");

var whitelist = [
  "http://localhost:3000",
  "https://facebook-front-uubv.vercel.app",
  "https://facebook-front.vercel.app",
  "https://meta.laguidev.com",
];
const corsOptions = {
  // origin: process.env.CLIENT_URL,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type", "x-access-token"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// jwt
// app.get("*", checkUser);
// app.get("/jwt", requireAuth, (req, res) => {
//   res.status(200).send(res.locals.user._id);
// });

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// routes
app.use("/api/users", userRoutes);
app.use("/api/constants", constantRoutes);
app.use("/api/paves", paveRoutes);
app.use("/api/materiels", materielRoutes);
app.use("/api/devis", devisRoutes);
app.use("/api/factures", factureRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/paiements", paiementRoutes);
app.use("/api/document", documentRoutes);
app.use("/api/bill", billRoutes);

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));
  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Listening on port ${process.env.PORT}`);
});

const data = {
  statut: false,
  _id: "65a1cb02f71015bd06a82193",
  payment_amount: "15155.55",
  payment_currency: "USD",
  payment_date: "2023-09-21T04:00:00.000Z",
  payment_number: 6647147125401094,
  total: "15155.55",
  createdAt: "2024-01-12T23:28:02.080Z",
  updatedAt: "2024-01-12T23:28:02.080Z",
  __v: 0,
  tab: [
    {
      facebook_Id: "1554909011221861",
      facebook_name: "Anata fooly",
      payout_period_end: "31-Aug-2023",
      payout_period_start: "01-Aug-2023",
      payout_reference: "6647147125401094",
      product: "Ads on Reels",
      remittance: 0.15,
      conversion: 1,
      payment_currency: "USD",
      payment_date: "21-Sep-2023",
      pourcentage: 0.7,
      status: false,
      notes: "",
    },

    {
      facebook_Id: "103665318627717",
      facebook_name: "Safi officiel",
      payout_period_end: "31-Aug-2023",
      payout_period_start: "01-Aug-2023",
      payout_reference: "6647147125401094",
      product: "Video Ad Activity",
      remittance: 13.23,
      conversion: 1,
      payment_currency: "USD",
      payment_date: "21-Sep-2023",
      pourcentage: 0.7,
      status: false,
      notes: "",
    },
    {
      facebook_Id: "103665318627717",
      facebook_name: "Safi officiel",
      payout_period_end: "31-Aug-2023",
      payout_period_start: "01-Aug-2023",
      payout_reference: "6647147125401094",
      product: "Video Ad Activity",
      remittance: 0.07,
      conversion: 1,
      payment_currency: "USD",
      payment_date: "21-Sep-2023",
      pourcentage: 0.7,
      status: false,
      notes: "",
    },
  ],
};
