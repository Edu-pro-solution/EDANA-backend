import express from "express";


import { paystackWebhook,   initializePayment,
  verifyPayment,
  checkAccess, } from "../controller/schPaymentController.js";
import { protect } from "../middleware/protectUser.js";

const router = express.Router();

// ──────────────────────────────────────────────────────────────────────────────
// PUBLIC ROUTES (no auth required)
// ──────────────────────────────────────────────────────────────────────────────

// Paystack webhook — must be raw body, no auth
// ⚠️  Register this BEFORE express.json() in your app.js for this route only
router.post(
  "/sch-webhook",
  express.raw({ type: "application/json" }), // raw body for signature check
  paystackWebhook
);

// Check if email has access to an article (called on page load)
// GET /api/payments/access?email=xxx&articleId=yyy
router.get("/sch-access", checkAccess);

// Verify payment after redirect from Paystack
// GET /api/payments/verify/:reference
router.get("/sch/verify/:reference", verifyPayment);

// ──────────────────────────────────────────────────────────────────────────────
// PROTECTED ROUTES (JWT required)
// ──────────────────────────────────────────────────────────────────────────────

// Initialize a new payment
// POST /api/payments/initialize
// Body: { email, articleId, articleTitle }
router.post("/sch-initialize", protect, initializePayment);

export default router;

// ──────────────────────────────────────────────────────────────────────────────
// REGISTER IN YOUR app.js / server.js like this:
//
//   import paymentRouter from "./paymentRouter.js";
//   app.use("/api/payments", paymentRouter);
//
// Add to your .env:
//   PAYSTACK_SECRET_KEY=sk_live_xxxx   (or sk_test_xxxx for testing)
//   FRONTEND_URL=https://yourdomain.com
// ──────────────────────────────────────────────────────────────────────────────
