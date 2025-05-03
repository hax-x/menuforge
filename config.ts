const config = {
  appName: "MenuForge",
  appDescription:
    "MenuForge is a powerful tool for creating and managing Restaurants for restaurants and food businesses.",
  domainName:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://menuforge.vercel.app", // prod url
};

export default config;
