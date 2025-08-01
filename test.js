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

// Regroupement des dépenses par catégorie
const expenseByCategory = categories.map(cat => {
  const total = transactions
    .filter(t => {
      const cleanCat = t.category.replace(/^[^\w]+/, "").trim().toLowerCase(); // supprime icône
      return t.type === "expense" && cleanCat === cat.name.toLowerCase();
    })
    .reduce((sum, t) => sum + t.amount, 0);
  return total;
});

const pieData = {
  labels: categories.map(c => `${c.icon} ${c.name}`),
  datasets: [{
    data: expenseByCategory,
    backgroundColor: pastelColors,
    borderWidth: 1,
    borderColor: "#fff",
    hoverOffset: 8
  }],
};

const barData = {
  labels: categories.map(c => `${c.icon} ${c.name}`),
  datasets: [{
    label: "Dépenses (€)",
    data: expenseByCategory,
    backgroundColor: pastelColors,
    borderRadius: 6
  }],
};




  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-gray-50 font-sans">
      
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-60 bg-white shadow-md rounded-r-xl p-4">
        <h2 className="text-xl font-bold text-center mb-6 text-blue-500">💰 BudgetApp</h2>
        {["dashboard","categories","transactions","invest","history"].map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`p-3 mb-2 rounded-lg text-left transition-all ${
              activeSection === section ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-100"
            }`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
        <button onClick={resetAll} className="mt-auto p-3 rounded-lg bg-red-500 text-white hover:bg-red-600">
          Reset
        </button>
      </div>

      {/* Contenu */}
      <div className="flex-1 p-6 space-y-6">
        
        {/* Dashboard */}
        {activeSection === "dashboard" && (
          <div>
            <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Tableau de Bord</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-green-100 rounded-xl p-4 shadow text-center">
                <p>Revenus</p>
                <p className="text-2xl font-bold">{totalIncome} €</p>
              </div>
              <div className="bg-red-100 rounded-xl p-4 shadow text-center">
                <p>Dépenses</p>
                <p className="text-2xl font-bold">{totalExpense} €</p>
              </div>
              <div className="bg-blue-100 rounded-xl p-4 shadow text-center">
                <p>Solde</p>
                <p className="text-2xl font-bold">{balance} €</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            <div className="bg-white rounded-xl shadow p-4 flex justify-center">
  <div className="w-full max-w-xs h-48 sm:h-64">
    <Pie 
      data={pieData} 
      options={{
        responsive: true,
        maintainAspectRatio: false
      }} 
    />
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
            <h1 className="text-xl font-bold mb-4 text-center text-blue-600">Catégories</h1>
            <div className="bg-white p-4 rounded-xl shadow mb-4">
              <input type="text" value={newCategory} onChange={e=>setNewCategory(e.target.value)} placeholder="Nom" className="border p-2 w-full mb-2"/>
              <div className="flex gap-2 mb-2">
                {["🛒","🏠","⛽","🎮","🛍️","💰"].map(icon => (
                  <button key={icon} onClick={()=>setSelectedIcon(icon)} className={`p-2 border rounded ${selectedIcon===icon?"bg-blue-100":""}`}>{icon}</button>
                ))}
              </div>
              <button onClick={addCategory} className="bg-green-500 text-white p-2 rounded w-full">Ajouter</button>
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
            <h1 className="text-xl font-bold mb-4 text-center text-blue-600">Transactions</h1>
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
              <button onClick={addTransaction} className="bg-blue-500 text-white p-2 rounded w-full">Ajouter</button>
            </div>
          </div>
        )}

        {/* Investissements */}
        {activeSection === "invest" && (
          <div>
            <h1 className="text-xl font-bold mb-4 text-center text-blue-600">Investissements</h1>
            <p className="mb-2">Solde: {investTotal} €</p>
            <div className="bg-white p-4 rounded-xl shadow space-y-3">
              <input type="number" value={investAmount} onChange={e=>setInvestAmount(e.target.value)} placeholder="Montant" className="border p-2 rounded w-full"/>
              <input type="text" value={investDesc} onChange={e=>setInvestDesc(e.target.value)} placeholder="Description" className="border p-2 rounded w-full"/>
              <div className="flex gap-2">
                <button onClick={()=>addInvestment("deposit")} className="bg-green-500 text-white p-2 rounded w-1/2">Ajouter</button>
                <button onClick={()=>addInvestment("withdraw")} className="bg-red-500 text-white p-2 rounded w-1/2">Retirer</button>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {investTransactions.map(t => (
                <div key={t.id} className={`flex justify-between p-3 rounded-xl shadow ${t.type==="deposit"?"bg-green-50":"bg-red-50"}`}>
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
            <h1 className="text-xl font-bold mb-4 text-center text-blue-600">Historique</h1>
            <div className="space-y-2">
              {transactions.map(t=>{
                const catIcon = categories.find(c=>c.name===t.category)?.icon || "💰";
                return (
                  <div key={t.id} className={`flex justify-between p-3 rounded-xl shadow ${t.type==="income"?"bg-green-50":"bg-red-50"}`}>
                    <span>{t.date} - {catIcon} {t.category}</span>
                    <span>{t.type==="income" ? "+" : "-"}{t.amount} €</span>
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

