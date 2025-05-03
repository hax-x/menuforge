// components/templates/TemplateThree.tsx
export default function TemplateThree() {
    // TODO: Replace with data fetched from the database
    const logo = "/images/sample-logo.png";
    const categories = ["Snacks", "Meals", "Drinks"];
    const menuItems = [
      { name: "Taco", description: "Spicy chicken taco", price: "$4.99" },
      { name: "Iced Tea", description: "Chilled and sweet", price: "$1.99" },
    ];
    const colors = {
      primary: "#264653",
      secondary: "#2A9D8F",
      accent: "#E9C46A",
    };
  
    return (
      <div className="p-4" style={{ backgroundColor: colors.secondary }}>
        <header className="text-center mb-6" style={{ color: colors.accent }}>
          <img src={logo} alt="Restaurant Logo" className="h-14 mx-auto mb-2" />
          <h1 className="text-3xl font-bold">Welcome to Our Eatery</h1>
        </header>
        <div className="flex overflow-x-auto space-x-4 mb-6">
          {categories.map((cat, i) => (
            <span key={i} className="bg-white px-4 py-2 rounded-full shadow text-sm font-medium" style={{ color: colors.primary }}>
              {cat}
            </span>
          ))}
        </div>
        <div className="space-y-4">
          {menuItems.map((item, idx) => (
            <div key={idx} className="p-4 rounded-lg shadow-md" style={{ backgroundColor: colors.accent }}>
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p>{item.description}</p>
              <p className="font-bold">{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  