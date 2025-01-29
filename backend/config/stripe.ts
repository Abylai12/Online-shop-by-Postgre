import Stripe from "stripe";

// Function to connect to Stripe and check the connection
export const connectStripe = async (secretKey: string) => {
  try {
    // Initialize the Stripe client with the secret key
    const stripe = new Stripe(secretKey);

    // Perform a simple API call to check if the connection works
    const account = await stripe.accounts.retrieve("your-account-id"); // Example: Retrieve account info

    console.log("Stripe connection successful:", account);
  } catch (error) {
    console.error("Error connecting to Stripe:", error.message);
  }
};
