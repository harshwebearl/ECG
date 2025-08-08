import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";

// Routes Import

// APP ADMIN
import appAdminRoutes from "./src/routes/appAdmin.routes.js";
// USER ROUTES
import userRoutes from "./src/routes/user.routes.js";
// ADD USER ROUTES 
import addUserRoutes from "./src/routes/addUser.routes.js";
// PLAN ROUTES
import planRoutes from "./src/routes/plan.routes.js";
// TEST ROUTES 
import testRoutes from "./src/routes/test.routes.js";
// Article ROUTES
import articleRoutes from "./src/routes/article.routes.js";
// HELP & Support ROUTES
import helpRoutes from "./src/routes/help.routes.js";
// PrivacyPolicy
import PrivacyPolicy from "./src/routes/privacypolicy.routes.js";
// Terms & Condition
import TermsCondition from "./src/routes/termsCondition.routes.js";
// Coupon 
import Coupon from "./src/routes/coupon.routes.js";
// appliedCoupon
import AppliedCoupon from "./src/routes/appliedCoupon.routes.js";
// Device
import Device from './src/routes/device.routes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/appAdmin", appAdminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/adduser", addUserRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/test", testRoutes);
app.use("/api/article", articleRoutes);
app.use("/api/help", helpRoutes);
app.use("/api/privacypolicy", PrivacyPolicy);
app.use("/api/termscondition", TermsCondition);
app.use("/api/coupon", Coupon);
app.use("/api/appliedCoupon", AppliedCoupon);
app.use("/api/device", Device);

// 📌 Root Route — All API list
app.get("/", (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host');
  res.json({
    message: "Welcome to the API",
    baseUrl: baseUrl + '/api',
    total: 70,
    apis: {
      "👤 User Auth & Profile": [
        `POST ${baseUrl}/api/user/signup`,
        `POST ${baseUrl}/api/user/signin`,
        `GET ${baseUrl}/api/user/getprofile`,
        `PUT ${baseUrl}/api/user/updateprofile`,
        `PUT ${baseUrl}/api/user/changepassword`,
        `POST ${baseUrl}/api/user/forgotPassword`
      ],
      "🧾 Plans": [
        `POST ${baseUrl}/api/plan/add`,
        `GET ${baseUrl}/api/plan/getAllPlan`,
        `GET ${baseUrl}/api/plan/getById/:id`,
        `PUT ${baseUrl}/api/plan/update/:id`,
        `DELETE ${baseUrl}/api/plan/delete/:id`,
        `PATCH ${baseUrl}/api/plan/statusUpdate/:id`
      ],
      "🧪 Tests": [
        `GET ${baseUrl}/api/test/getalltest`,
        `GET ${baseUrl}/api/getTest//:id`,
        `POST ${baseUrl}/api/test/testCreate`,
        `PUT ${baseUrl}/api/test/updateTest/:id`,
        `DELETE ${baseUrl}/api/test/deleteTest/:id`
      ],
      "📰 Articles": [
        `GET ${baseUrl}/api/article/getAllArticles`,
        `GET ${baseUrl}/api/article/getById/:id`,
        `POST ${baseUrl}/api/article/create`,
        `GET ${baseUrl}/api/article/getall`,
        `PUT ${baseUrl}/api/article/update/:id`,
        `DELETE ${baseUrl}/api/article/delete/:id`
      ],
      "👨‍👩‍👧 Family Member Management": [
        `POST ${baseUrl}/api/adduser/addMember`,
        `PUT ${baseUrl}/api/adduser/family-member-update/:id`,
        `DELETE ${baseUrl}/api/adduser/family-member-delete/:id`,
        `GET ${baseUrl}/api/adduser/getall-family-members`,
        `GET ${baseUrl}/api/adduser/getById-family-member/:id`
      ],
      "🛡️ Admin Auth & User Management": [
        `POST ${baseUrl}/api/appAdmin/login`,
        `GET ${baseUrl}/api/appAdmin/getadminprofile`,
        `PUT ${baseUrl}/api/appAdmin/updateprofile`,
        `PUT ${baseUrl}/api/appAdmin/changepassword`,
        `GET ${baseUrl}/api/appAdmin/getAllUser`,
        `GET ${baseUrl}/api/appAdmin/getUserById/:id`,
        `PATCH ${baseUrl}/api/appAdmin/userStatus/:id`,
        `GET ${baseUrl}/api/appAdmin/user-with-family/:id`,
        `DELETE ${baseUrl}/api/appAdmin/deleteUser/:id`
      ],
      "🎟️ Coupons": [
        `POST ${baseUrl}/api/coupon/create`,
        `GET ${baseUrl}/api/coupon/get`,
        `PATCH ${baseUrl}/api/coupon/updatecoupons/:id`,
        `DELETE ${baseUrl}/api/coupon/deletecoupons/:id`,
        `POST ${baseUrl}/api/appliedCoupon/apply`,
        `GET ${baseUrl}/api/appliedCoupon/`
      ],
      "📱 Devices": [
        `POST ${baseUrl}/api/device/add`,
        `PUT ${baseUrl}/api/device/update/:id`,
        `GET ${baseUrl}/api/device/getall`,
        `GET ${baseUrl}/api/device/getById/:id`,
        `DELETE ${baseUrl}/api/device/delete/:id`
      ],
      "🆘 Help & Support": [
        `GET ${baseUrl}/api/help/getAll`,
        `GET ${baseUrl}/api/help/getById/:id`,
        `POST ${baseUrl}/api/help/create`,
        `PUT ${baseUrl}/api/help/update/:id`,
        `DELETE ${baseUrl}/api/help/delete/:id`
      ],
      "🔐 Privacy Policy": [
        `GET ${baseUrl}/api/privacypolicy/getAll`,
        `GET ${baseUrl}/api/privacypolicy/getById/:id`,
        `POST ${baseUrl}/api/privacypolicy/create`,
        `PUT ${baseUrl}/api/privacypolicy/update/:id`,
        `DELETE ${baseUrl}/api/privacypolicy/delete/:id`
      ],
      "📄 Terms & Conditions": [
        `GET ${baseUrl}/api/termscondition/getAll`,
        `GET ${baseUrl}/api/termscondition/getById/:id`,
        `POST ${baseUrl}/api/termscondition/create`,
        `PUT ${baseUrl}/api/termscondition/update/:id`,
        `DELETE ${baseUrl}/api/termscondition/delete/:id`
      ]
    }
  });
});

// Connect DB and Start Server
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("✅ SERVER RUNNING ON PORT:", process.env.PORT || 5000);
    });
  })
  .catch((err) => {
    console.log("❌ MONGODB CONNECTION FAILED: ", err);
  });
