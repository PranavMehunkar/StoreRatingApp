import React, { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_stores: 0,
    total_ratings: 0,
  });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const { logout } = useContext(AuthContext); // ← LOGOUT IMPORTED

  useEffect(() => {
    fetchDashboardStats();
    fetchUsers();
    fetchStores();
  }, []);

  const fetchDashboardStats = async () => {
    const res = await API.get("/admin/dashboard");
    setStats(res.data);
  };

  const fetchUsers = async () => {
    const res = await API.get(`/admin/users?search=${search}&role=${role}`);
    setUsers(res.data);
  };

  const fetchStores = async () => {
    const res = await API.get("/admin/stores");
    setStores(res.data);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };
  
  const [newUser, setNewUser] = useState({
  name: "",
  email: "",
  password: "",
  address: "",
  role: "",
});

const handleAddUser = async (e) => {
  e.preventDefault();

  try {
    await API.post("/admin/add-user", newUser);
    alert("User created successfully");
    setNewUser({ name: "", email: "", password: "", address: "", role: "" });
    fetchUsers();
  } catch (err) {
    alert(err.response?.data?.error || "Failed to add user");
  }
};

 const [newStore, setNewStore] = useState({
  name: "",
  address: "",
  owner_id: "",
});

const handleAddStore = async (e) => {
  e.preventDefault();

  try {
    await API.post("/admin/add-store", newStore);
    alert("Store added successfully");
    setNewStore({ name: "", address: "", owner_id: "" });
    fetchStores();
  } catch (err) {
    alert(err.response?.data?.error || "Failed to add store");
  }
};

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      
      {/* ===== HEADER WITH LOGOUT BUTTON ===== */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow"
        >
          Logout
        </button>
      </div>

      {/* ===== Stats Section ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
        <div className="bg-white shadow-md p-6 rounded-xl text-center">
          <h2 className="text-xl font-semibold text-gray-700">Users</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">
            {stats.total_users}
          </p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-xl text-center">
          <h2 className="text-xl font-semibold text-gray-700">Stores</h2>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {stats.total_stores}
          </p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-xl text-center">
          <h2 className="text-xl font-semibold text-gray-700">Ratings</h2>
          <p className="text-4xl font-bold text-yellow-500 mt-2">
            {stats.total_ratings}
          </p>
        </div>
      </div>

      {/* ===== Users Section ===== */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-10">
        <h2 className="text-2xl font-semibold mb-4">Users</h2>

        <form
          onSubmit={handleSearch}
          className="flex flex-wrap gap-3 items-center mb-4"
        >
          <input
            type="text"
            placeholder="Search name/email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-60"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        <table className="min-w-full border text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Email</th>
              <th className="border px-3 py-2">Role</th>
              <th className="border px-3 py-2">Address</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{u.name}</td>
                <td className="border px-3 py-2">{u.email}</td>
                <td className="border px-3 py-2 capitalize">{u.role}</td>
                <td className="border px-3 py-2">{u.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
   
      <div className="bg-white shadow-md rounded-xl p-6 mb-10">
  <h2 className="text-2xl font-semibold mb-4">Add New User</h2>

  <form
    onSubmit={handleAddUser}
    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
  >
    <input
      type="text"
      placeholder="Name"
      className="border p-2 rounded"
      value={newUser.name}
      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
      required
    />

    <input
      type="email"
      placeholder="Email"
      className="border p-2 rounded"
      value={newUser.email}
      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      required
    />

    <input
      type="password"
      placeholder="Password"
      className="border p-2 rounded"
      value={newUser.password}
      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
      required
    />

    <input
      type="text"
      placeholder="Address"
      className="border p-2 rounded"
      value={newUser.address}
      onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
      required
    />

    <select
      className="border p-2 rounded"
      value={newUser.role}
      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
      required
    >
      <option value="">Select Role</option>
      <option value="user">User</option>
      <option value="admin">Admin</option>
      <option value="owner">Owner</option>
    </select>

    <button className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
      Add User
    </button>
    </form>
   </div>

      {/* ===== Stores Section ===== */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Stores</h2>

        <table className="min-w-full border text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">Store Name</th>
              <th className="border px-3 py-2">Owner</th>
              <th className="border px-3 py-2">Address</th>
              <th className="border px-3 py-2">Average Rating ⭐</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{s.name}</td>
                <td className="border px-3 py-2">{s.owner_name || "—"}</td>
                <td className="border px-3 py-2">{s.address}</td>
                <td className="border px-3 py-2 text-yellow-600 font-bold">
                  {s.average_rating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    <div className="bg-white shadow-md rounded-xl p-6 mb-10">
  <h2 className="text-2xl font-semibold mb-4">Add New Store</h2>

  <form onSubmit={handleAddStore} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <input
      type="text"
      placeholder="Store Name"
      className="border p-2 rounded"
      value={newStore.name}
      onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
      required
    />

    <input
      type="text"
      placeholder="Address"
      className="border p-2 rounded"
      value={newStore.address}
      onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
      required
    />

    <input
      type="number"
      placeholder="Owner ID"
      className="border p-2 rounded"
      value={newStore.owner_id}
      onChange={(e) => setNewStore({ ...newStore, owner_id: e.target.value })}
    />

    <button className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700">
      Add Store
    </button>
  </form>
</div>

    </div>
  );
};

export default DashboardAdmin;
