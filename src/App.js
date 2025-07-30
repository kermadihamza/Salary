import { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function App() {
  const [transactions, setTransactions] = useState(() => JSON.parse(localStorage.getItem("transactions")) || []);
  const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem("categories")) || ["Courses", "Loyer", "Sorties"]);
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || "");
  const [description, setDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [salary, setSalary] = useState(2500);
  const savingsRate = 0.2;

  useEffect(() => localStorage.setItem("transactions", JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem("categories", JSON.stringify(categories)), [categories]);

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

  const addCategory = () => {
    if (!newCategory.trim()) return;
    setCategories([...categories, newCategory.trim()]);
    setNewCategory("");
  };

  const deleteTransaction = (id) => setTransactions(transactions.filter((t) => t.id !== id));
  const deleteCategory = (cat) => setCategories(categories.filter((c) => c !== cat));

  const resetAll = () => {
    if (window.confirm("Réinitialiser TOUT ?")) {
      setTransactions([]);
      setCategories(["Courses", "Loyer", "Sorties"]);
      localStorage.clear();
    }
  };

  const totalIncome = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const expenseByCategory = categories.map(cat => 
    transactions.filter(t => t.type === "expense" && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const pieData = {
    labels: categories,
    datasets: [{
      data: expenseByCategory,
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
    }],
  };
  const barData = {
    labels: categories,
    datasets: [{
      label: "Dépenses par catégorie (€)",
      data: expenseByCategory,
      backgroundColor: "#36A2EB",
    }],
  };

  const savingsRecommendation = salary * savingsRate;
  const actualSavingsCapacity = balance > 0 ? balance : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard Budget</h1>

      {/* --- Layout Responsive --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-6xl">
        
        {/* --- Résumé + Épargne --- */}
        <div className="bg-white p-4 rounded shadow flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-100 p-3 rounded text-center">Revenus: {totalIncome.toFixed(2)} €</div>
            <div className="bg-red-100 p-3 rounded text-center">Dépenses: {totalExpense.toFixed(2)} €</div>
            <div className="bg-blue-100 p-3 rounded text-center col-span-2">Solde: {balance.toFixed(2)} €</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded">
            <h2 className="font-semibold mb-2">Épargne</h2>
            <input type="number" value={salary} onChange={e => setSalary(parseFloat(e.target.value) || 0)} className="border p-2 rounded w-full mb-2" placeholder="Salaire mensuel" />
            <p>Recommandée (20%): <strong>{savingsRecommendation.toFixed(2)} €</strong></p>
            <p>Capacité réelle: <strong>{actualSavingsCapacity.toFixed(2)} €</strong></p>
          </div>
        </div>

        {/* --- Graphiques --- */}
        <div className="bg-white p-4 rounded shadow flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-center">Graphiques Dépenses</h2>
          <div className="w-full max-w-sm mx-auto"><Pie data={pieData} /></div>
          <div className="w-full"><Bar data={barData} /></div>
        </div>

      </div>

      {/* --- Catégories + Transactions --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-6xl mt-6">
        
        {/* Catégories */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Catégories</h2>
          <div className="flex mb-2">
            <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} className="border p-2 rounded flex-1" placeholder="Nouvelle catégorie" />
            <button onClick={addCategory} className="bg-blue-500 text-white p-2 ml-2 rounded">+</button>
          </div>
          <ul>
            {categories.map(cat => (
              <li key={cat} className="flex justify-between items-center py-1">
                {cat}
                <button onClick={() => deleteCategory(cat)} className="text-red-500">X</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Transactions */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Ajouter Transaction</h2>
          <select value={type} onChange={e => setType(e.target.value)} className="border p-2 rounded w-full mb-2">
            <option value="expense">Dépense</option>
            <option value="income">Revenu</option>
          </select>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="border p-2 rounded w-full mb-2">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Montant" className="border p-2 rounded w-full mb-2" />
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (optionnel)" className="border p-2 rounded w-full mb-2" />
          <button onClick={addTransaction} className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600">Ajouter</button>
        </div>

      </div>

      {/* --- Historique --- */}
      <div className="bg-white shadow-md rounded p-4 w-full max-w-6xl mt-6">
        <h2 className="text-lg font-semibold mb-2">Historique Transactions</h2>
        {transactions.length === 0 ? <p>Aucune transaction</p> :
          <ul>
  {transactions.map(t => (
    <li 
      key={t.id} 
      className={`flex justify-between items-center border-b py-2 ${
        t.type === "income" ? "text-green-600" : "text-red-600"
      }`}
    >
      <span>
        {t.date} - [{t.category}] {t.description || ""}: 
        {t.type === "income" ? "+" : "-"}{t.amount} €
      </span>
      <button 
        onClick={() => deleteTransaction(t.id)} 
        className="text-gray-400 hover:text-red-500"
      >
        X
      </button>
    </li>
  ))}
</ul>

        }
                  <button onClick={resetAll} className="bg-red-600 text-white p-2 mt-5 rounded w-full hover:bg-red-700">
            Réinitialiser TOUT
          </button>
      </div>
      
    </div>
  );
}
