export const plansMap = [
  {
    id: "basic",
    name: "Basic",
    description: "Get started with Crazy TypeWriter!",
    price: "10",
    items: ["3 Blog Posts", "3 Transcription"],
    paymentLink: "https://buy.stripe.com/test_7sIaIbd6O6Se3HW289",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1Q9YA705F9BoM8qAOmJdXBD7"
        : "",
  },
  {
    id: "pro",
    name: "Pro",
    description: "All Blog Posts, let’s go!",
    price: "19.99",
    items: ["Unlimited Blog Posts", "Unlimited Transcriptions"],
    paymentLink: "https://buy.stripe.com/test_bIY9E7gj0dgC2DS4gi",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1Q9YBU05F9BoM8qAo4jLrbZ6"
        : "",
  },
];

export const ORIGIN_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://crazy-type-writer.vercel.app/";
