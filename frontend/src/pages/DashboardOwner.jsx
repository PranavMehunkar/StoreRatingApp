import React, { useEffect, useState, useContext} from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const DashboardOwner = () => {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const { logout } = useContext(AuthContext);
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  console.log("TOKEN:", localStorage.getItem("token"));
  console.log("USER:", localStorage.getItem("user"));
  console.log("ROLE:", localStorage.getItem("role"));
  console.log("USER_ID:", localStorage.getItem("user_id"));

  useEffect(() => {
    fetchOwnerDashboard();
  }, []);

  const fetchOwnerDashboard = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.get("/owner/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setStore(res.data.store);
    setRatings(res.data.ratings);
    setAvgRating(res.data.avg_rating);
  } catch (err) {
    console.error(err);
  }
};

  const handlePasswordChange = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    const res = await API.post("/owner/change-password", {
      oldPassword,
      newPassword,
    });

    setMessage(res.data.message);
    setOldPassword("");
    setNewPassword("");

  } catch (err) {
    setMessage(err.response?.data?.message || "Error updating password");
  }
};

  if (!store)
    return <p className="text-center mt-10">No store found for this owner.</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Store Owner Dashboard
      </h1>

       <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
       >
        Logout
       </button>
       <div className="bg-white shadow-md rounded-xl p-6 mb-6">

  <h2 className="text-xl font-semibold mb-4">Change Password</h2>

  {message && (
    <p className="mb-3 text-center text-blue-600 font-medium">{message}</p>
  )}

  <form onSubmit={handlePasswordChange}>
    <input
      type="password"
      placeholder="Old Password"
      className="border p-2 w-full rounded mb-3"
      value={oldPassword}
      onChange={(e) => setOldPassword(e.target.value)}
      required
    />

    <input
      type="password"
      placeholder="New Password"
      className="border p-2 w-full rounded mb-3"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      required
    />

    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Update Password
    </button>
  </form>
</div>

      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-semibold">{store.name}</h2>
        <p className="text-gray-600">{store.address}</p>
        <p className="mt-3 text-yellow-600 font-bold">
          ⭐ Average Rating: {avgRating || 0}
        </p>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">User Reviews</h2>
        {ratings.length === 0 ? (
          <p className="text-gray-500">No ratings yet.</p>
        ) : (
          <table className="min-w-full border text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">User</th>
                <th className="border px-3 py-2">Email</th>
                <th className="border px-3 py-2">Rating</th>
                <th className="border px-3 py-2">Review</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{r.user_name}</td>
                  <td className="border px-3 py-2">{r.email}</td>
                  <td className="border px-3 py-2 text-yellow-600 font-bold">
                    {r.rating}
                  </td>
                  <td className="border px-3 py-2">{r.review || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};


export default DashboardOwner;
