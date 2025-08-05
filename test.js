import { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedIcon, setSelectedIcon] = useState("🛒");

  // 🎯 Catégories par défaut
  const defaultCategories = [
    { name: "Courses", icon: "🛒", color: "#A5D8A2" },   // Vert pastel
    { name: "Loyer", icon: "🏠", color: "#A2C8F0" },     // Bleu pastel
    { name: "Essence", icon: "⛽", color: "#F9E79F" },    // Jaune pastel
    { name: "Loisirs", icon: "🎮", color: "#D7BDE2" },   // Violet pastel
    { name: "Shopping", icon: "🛍️", color: "#F5B7B1" }, // Rose pastel
    { name: "Autres", icon: "💰", color: "#D5DBDB" }     // Gris pastel
  ];

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };
  

  const iconsData = [
    // 🏠 Vie quotidienne
    "🏠","🏡","🏢","🏣","🏤","🏥","🏦","🏨","🏩","🏪","🏫","🏬","🏭","🏯","🏰",
    "🛖","⛺","🏕️","🏜️","🏝️","🏞️","🏛️","🕌","🛕","🕍","⛪","🛐",
    
    // 💰 Argent & business
    "💰","💴","💵","💶","💷","💳","💎","🪙","🏦","🏧","💱","📈","📉","📊","🧾",
  
    // 🍽️ Nourriture & boissons
    "🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍒","🍑","🥭","🍍","🥥",
    "🥝","🥑","🍅","🍆","🥦","🥬","🥒","🌽","🥕","🫑","🍠","🥔","🍞","🥐","🥖",
    "🥯","🥨","🧀","🥚","🍳","🥞","🧇","🥓","🥩","🍗","🍖","🌭","🍔","🍟","🍕",
    "🥪","🌮","🌯","🥗","🍝","🍜","🍲","🍛","🍣","🍱","🥟","🍤","🍙","🍚","🍘",
    "🥠","🍢","🍡","🍧","🍨","🍦","🥧","🧁","🍰","🎂","🍮","🍭","🍬","🍫","🍿",
    "🍩","🍪","🥤","🧋","🍺","🍻","🥂","🍷","🍸","🍹","🍾","🍼","🥛","☕","🍵","🫖",
  
    // 🚗 Transports & voyages
    "🚗","🚕","🚙","🚌","🚎","🏎️","🚓","🚑","🚒","🚐","🚚","🚛","🚜","🛻","🚚",
    "🛵","🏍️","🛴","🚲","🛹","🛼","🛷","⛷️","🏂","🚠","🚡","🚟","🚝","🚄","🚅",
    "✈️","🛫","🛬","🛩️","🚀","🛸","🚁","⛴️","🚤","🛥️","🚢","⚓",
  
    // 🎯 Loisirs & sports
    "🎯","♟️","🎮","🎲","🎳","🏀","🏈","⚽","⚾","🎾","🏐","🏉","🥏","🏓","🏸",
    "🥊","🥋","🥅","🥌","🎣","🪁","🎽","🛶","🏊","🏄","🚣","🏇","🚵","🚴",
  
    // 🎭 Culture & arts
    "🎤","🎧","🎼","🎹","🎷","🎺","🎸","🎻","🥁","🎬","🎥","🎞️","📽️","🎙️","📻",
    "📷","📸","📹","📼","💡","📜","📚","📖","📰","🗞️","📒","📓","📔","📕","📗",
    "📘","📙","📚","🔖","📑",
  
    // ⚙️ Divers & tech
    "⚙️","🖥️","💻","⌨️","🖱️","🖲️","💽","💾","💿","📀","📱","📲","☎️","📞","📟",
    "📠","🔌","🔋","🪫","🔋","📡","🛰️","🛠️","🔧","🔨","⚒️","🪓","⛏️","⚙️","🗜️",
  ];
  

  const pastelColors = [
    "rgba(255, 204, 204, 0.8)", // Fraise
    "rgba(255, 229, 180, 0.8)", // Mangue
    "rgba(255, 224, 204, 0.8)", // Citron
    "rgba(204, 255, 229, 0.8)", // Menthe
    "rgba(204, 229, 255, 0.8)", // Myrtille
    "rgba(229, 204, 255, 0.8)"  // Lavande
  ]

  // 🔹 States
  const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem("categories")) || defaultCategories);
  const [transactions, setTransactions] = useState(() => JSON.parse(localStorage.getItem("transactions")) || []);
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.name || "");
  const [description, setDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [investTransactions, setInvestTransactions] = useState(() => JSON.parse(localStorage.getItem("invest")) || []);
  const [investAmount, setInvestAmount] = useState("");
  const [investDesc, setInvestDesc] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);


  // 💾 LocalStorage
  useEffect(() => localStorage.setItem("transactions", JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem("categories", JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem("invest", JSON.stringify(investTransactions)), [investTransactions]);

  // ➕ Ajouter transaction
  const addTransaction = () => {
    if (!amount || !selectedCategory) return;
    setTransactions([...transactions, {
      id: Date.now(),
      type,
      amount: parseFloat(amount),
      category: selectedCategory,
      description,
      date: new Date().toLocaleDateString("fr-FR"),
    }]);
    setAmount("");
    setDescription("");
  };

  // ➕ Ajouter catégorie
  const addCategory = () => {
    if (!newCategory.trim() || !selectedIcon) return;
    setCategories([...categories, { name: newCategory.trim(), icon: selectedIcon, color: "#E5E7EB" }]);
    setNewCategory("");
    setSelectedIcon("🛒");
  };
  

  // ➕ Ajouter investissement
  const addInvestment = (action) => {
    if (!investAmount) return;
    setInvestTransactions([...investTransactions, {
      id: Date.now(),
      type: action,
      amount: parseFloat(investAmount),
      description: investDesc,
      date: new Date().toLocaleDateString("fr-FR"),
    }]);
    setInvestAmount("");
    setInvestDesc("");
  };

  // 🔄 Reset
  const resetAll = () => {
    if (window.confirm("Réinitialiser TOUT ?")) {
      setTransactions([]);
      setCategories(defaultCategories);
      setInvestTransactions([]);
      localStorage.clear();
    }
  };

  // 📊 Calculs
  const totalIncome = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const investTotal = investTransactions.reduce((acc, t) => t.type === "deposit" ? acc + t.amount : acc - t.amount, 0);

// filtrer seulement les catégories avec des dépenses > 0
const usedCategories = categories.filter(cat => {
  const total = transactions
    .filter(t => t.type === "expense" && t.category.replace(/^[^\w]+/, "").trim().toLowerCase() === cat.name.toLowerCase())
    .reduce((sum, t) => sum + t.amount, 0);
  return total > 0;
});

const expenseByCategory = usedCategories.map(cat => {
  return transactions
    .filter(t => t.type === "expense" && t.category.replace(/^[^\w]+/, "").trim().toLowerCase() === cat.name.toLowerCase())
    .reduce((sum, t) => sum + t.amount, 0);
});


const pieData = {
  labels: usedCategories.map(c => `${c.icon} ${c.name}`),
  datasets: [{
    data: expenseByCategory,
    backgroundColor: pastelColors.slice(0, usedCategories.length),
    borderWidth: 1,
    borderColor: "#fff",
    hoverOffset: 8
  }],
};

const barData = {
  labels: usedCategories.map(c => `${c.icon} ${c.name}`),
  datasets: [{
    label: "Dépenses (€)",
    data: expenseByCategory,
    backgroundColor: pastelColors.slice(0, usedCategories.length),
    borderRadius: 6
  }],
};


  return (
      <div className="flex min-h-screen flex-col lg:flex-row bg-[#FDFCFB] font-sans">
{/* Bouton hamburger mobile */}
<button 
  className="lg:hidden p-3 bg-[#7FB3D5] text-white fixed top-4 left-4 z-50 rounded-lg shadow"
  onClick={() => setMenuOpen(!menuOpen)}
>
  ☰
</button>

{/* Sidebar */}
<div
  className={`
    bg-white shadow-md rounded-r-xl p-4 z-40
    transition-transform duration-300
    w-3/4 sm:w-2/3 lg:w-60   /* mobile large, desktop fixe */
    lg:static lg:translate-x-0
    fixed top-0 left-0 h-full
    ${menuOpen ? "translate-x-0" : "-translate-x-full"}
  `}
>

  <h2 className="text-xl font-bold text-center mb-6 text-[#7FB3D5]">💰 BudgetApp</h2>
  {["dashboard", "categories", "transactions", "invest", "history"].map(section => (
    <button
      key={section}
      onClick={() => { setActiveSection(section); setMenuOpen(false); }}
      className={`p-3 mb-2 rounded-lg text-left transition-all ${
        activeSection === section
          ? "bg-[#D6EAF8] text-[#2874A6] font-semibold"
          : "hover:bg-[#EBF5FB]"
      }`}
    >
      {section.charAt(0).toUpperCase() + section.slice(1)}
    </button>
  ))}
  <button
    onClick={resetAll}
    className="mt-auto p-3 rounded-lg bg-[#F5B7B1] text-white hover:bg-[#E6B0AA]"
  >
    Reset
  </button>
</div>





      {/* Contenu */}
      <div className="flex-1 p-6 pt-16 space-y-6 lg:pt-8">
        
        {/* Dashboard */}
        {activeSection === "dashboard" && (
          <div>
            <h1 className="text-2xl font-bold mb-4 text-center text-[#2874A6]">Tableau de Bord</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#D5F5E3] rounded-xl p-4 shadow text-center">
                <p>Revenus</p>
                <p className="text-2xl font-bold">{totalIncome} €</p>
              </div>
              <div className="bg-[#FADBD8] rounded-xl p-4 shadow text-center">
                <p>Dépenses</p>
                <p className="text-2xl font-bold">{totalExpense} €</p>
              </div>
              <div className="bg-[#D6EAF8] rounded-xl p-4 shadow text-center">
                <p>Solde</p>
                <p className="text-2xl font-bold">{balance} €</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
              <div className="bg-white rounded-xl shadow p-4 flex justify-center">
                <div className="w-full max-w-xs h-48 sm:h-64">
                  <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-4">
                <h2 className="text-center mb-2 font-semibold">Dépenses par catégorie</h2>
                <Bar data={barData} />
              </div>
            </div>
          </div>
        )}

{/* Catégories */}
{activeSection === "categories" && (
  <div>
    <h1 className="text-xl font-bold mb-4 text-center text-[#2874A6]">Catégories</h1>
    <div className="bg-white p-4 rounded-xl shadow mb-4">
      <input 
        type="text" 
        value={newCategory} 
        onChange={e=>setNewCategory(e.target.value)} 
        placeholder="Nom" 
        className="border p-2 w-full mb-2"
      />

      {/* Liste dynamique d’icônes */}
      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto border p-2 rounded mb-2">
        {iconsData.map(icon => (
          <button
            key={icon}
            onClick={() => setSelectedIcon(icon)}
            className={`p-2 border rounded text-xl ${
              selectedIcon === icon ? "bg-[#D6EAF8]" : ""
            }`}
          >
            {icon}
          </button>
        ))}
      </div>

      <button 
        onClick={addCategory} 
        className="bg-[#D5F5E3] text-[#145A32] p-2 rounded w-full hover:bg-[#ABEBC6]"
      >
        Ajouter
      </button>
    </div>

    <div className="grid grid-cols-2 gap-2">
      {categories.map((cat,index)=>(
        <div key={index} className="p-3 rounded shadow text-center" style={{backgroundColor: cat.color}}>
          <div className="text-2xl">{cat.icon}</div>
          <div>{cat.name}</div>
        </div>
      ))}
    </div>
  </div>
)}


        {/* Transactions */}
        {activeSection === "transactions" && (
          <div>
            <h1 className="text-xl font-bold mb-4 text-center text-[#2874A6]">Transactions</h1>
            <div className="bg-white p-4 rounded-xl shadow space-y-3">
              <select value={type} onChange={e=>setType(e.target.value)} className="border p-2 rounded w-full">
                <option value="expense">Dépense</option>
                <option value="income">Revenu</option>
              </select>
              <select value={selectedCategory} onChange={e=>setSelectedCategory(e.target.value)} className="border p-2 rounded w-full">
                {categories.map(cat=><option key={cat.name}>{cat.icon} {cat.name}</option>)}
              </select>
              <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Montant" className="border p-2 rounded w-full"/>
              <input type="text" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="border p-2 rounded w-full"/>
              <button onClick={addTransaction} className="bg-[#D6EAF8] text-[#2874A6] p-2 rounded w-full hover:bg-[#AED6F1]">Ajouter</button>
            </div>
          </div>
        )}

        {/* Investissements */}
        {activeSection === "invest" && (
          <div>
            <h1 className="text-xl font-bold mb-4 text-center text-[#2874A6]">Investissements</h1>
            <p className="mb-2">Solde: {investTotal} €</p>
            <div className="bg-white p-4 rounded-xl shadow space-y-3">
              <input type="number" value={investAmount} onChange={e=>setInvestAmount(e.target.value)} placeholder="Montant" className="border p-2 rounded w-full"/>
              <input type="text" value={investDesc} onChange={e=>setInvestDesc(e.target.value)} placeholder="Description" className="border p-2 rounded w-full"/>
              <div className="flex gap-2">
                <button onClick={()=>addInvestment("deposit")} className="bg-[#D5F5E3] text-[#145A32] p-2 rounded w-1/2 hover:bg-[#ABEBC6]">Ajouter</button>
                <button onClick={()=>addInvestment("withdraw")} className="bg-[#FADBD8] text-[#922B21] p-2 rounded w-1/2 hover:bg-[#F5B7B1]">Retirer</button>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {investTransactions.map(t => (
                <div key={t.id} className={`flex justify-between p-3 rounded-xl shadow ${t.type==="deposit"?"bg-[#E8F8F5]":"bg-[#FDEDEC]"}`}>
                  <span>{t.date} - {t.description || ""}</span>
                  <span>{t.type==="deposit" ? "+" : "-"}{t.amount} €</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historique */}
        {activeSection === "history" && (
  <div>
    <h1 className="text-xl font-bold mb-4 text-center text-[#2874A6]">Historique</h1>
    <div className="space-y-3">
      {transactions.map(t => {
        const category = categories.find(c => c.name === t.category);
        const catIcon = category?.icon || "💰";

        // Couleur du fond selon type
        const bgColor = t.type === "income" ? "bg-green-100" : "bg-red-100";
        const textColor = t.type === "income" ? "text-green-800" : "text-red-800";

        return (
          <div 
            key={t.id} 
            className={`flex items-center justify-between p-4 rounded-xl shadow ${bgColor} hover:shadow-md transition-shadow`}
          >
            {/* Icône */}
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow text-2xl">
              {catIcon}
            </div>

            {/* Infos catégorie + description + date */}
            <div className="flex-1 px-4">
              <p className="font-semibold">{t.category}</p>
              {t.description && (
                <p className="text-sm opacity-80">{t.description}</p>
              )}
              <p className="text-xs opacity-60">{t.date}</p>
            </div>

            {/* Montant */}
            <div className={`font-bold ${textColor}`}>
              {t.type === "income" ? "+" : "-"}{t.amount} €
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}


      </div>
    </div>
  );
}