import React, { useEffect, useState, useContext} from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const DashboardUser = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const { logout } = useContext(AuthContext);

  const token = localStorage.getItem("token");

  // Fetch stores
  const fetchStores = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/stores", {
        
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("STORE RESPONSE:", response.data);
      setStores(response.data);
    } catch (err) {
      console.log(err.response?.data || err);
      console.log("TOKEN:", token);
    }
  };

  // Submit or update rating
  const rateStore = async (storeId, rating) => {
    try {
      await axios.post(
        "http://localhost:5000/api/ratings/submit",
        { store_id: storeId, rating },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchStores(); // refresh store list
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase()) ||
    store.address.toLowerCase().includes(search.toLowerCase())
  );
console.log("STORES STATE:", stores);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
   
      <div className="flex gap-3">
    <button
      onClick={() => navigate("/change-password")}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Change Password
    </button>
       <button
       onClick={logout}
       className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
       >
       Logout
      </button>
      <input
        type="text"
        placeholder="Search stores..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      {filteredStores.map((store) => (
        <div key={store.id} className="border p-4 rounded mb-4 shadow">
          <h2 className="text-xl font-semibold">{store.name}</h2>
          <p className="text-gray-700">{store.address}</p>
          <p className="mt-2">
            <strong>Overall Rating:</strong> {store.avg_rating || "No ratings yet"}
          </p>
          <p>
            <strong>Your Rating:</strong> {store.user_rating || "Not rated"}
          </p>

          <div className="mt-3">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => rateStore(store.id, num)}
                className={`px-3 py-1 mr-2 border rounded ${
                  store.user_rating === num
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {num} ⭐
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default DashboardUser;
