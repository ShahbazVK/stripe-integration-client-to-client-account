const express = require("express");
const cors = require("cors");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
const stripe = require("stripe")("key");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => res.json("hello world"));

app.post("/create-account", async (req, res) => {
  try {
    const account = await stripe.accounts.create({
      type: "custom",
      country: "US",
      email: "jenny.rosen@example.com",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "https://example.com/reauth",
      return_url: "https://example.com/return",
      type: "account_onboarding",
    });
    res.redirect(accountLink.url);
  } catch (error) {
    console.error("error");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/pay", async (req, res) => {
  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "T-shirt",
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: 100,
      },
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel",
    },
    {
      stripeAccount: "acct_1OFgxAH73xwq9ZbO", //to whom you want to pay
    }
  );
  //   console.log(session);
  res.redirect(session.url);
});

app.delete("/delete", async (req, res) => {
  const deleted = await stripe.accounts.del("acct_1OFbapH0f0pIK5jH");
  console.log(deleted);
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(5000, () => console.log("server running on 5000"));
