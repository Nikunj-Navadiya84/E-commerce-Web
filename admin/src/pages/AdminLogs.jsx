import React, { useEffect, useState } from "react";

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState("");
  const [searchTime, setSearchTime] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/admin/logs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLogs(data.logs);
        }
      })
      .catch((err) => console.error("Error fetching logs:", err))
      .finally(() => setLoading(false));
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.timestamp).toISOString().split("T")[0];
    const logTime = new Date(log.timestamp).toTimeString().slice(0, 5);

    return (
      (!searchDate || logDate === searchDate) &&
      (!searchTime || logTime === searchTime)
    );
  });

  return (
    <div className="main-content">
      <h2 className="text-xl shadow p-5">System Logs</h2>
      
      <div className="flex space-x-4 p-4 text-sm">
        <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} className="border px-3 py-2 rounded cursor-pointer bg-white"/>
        <input type="time" value={searchTime} onChange={(e) => setSearchTime(e.target.value)} className="border px-3 py-2 rounded cursor-pointer bg-white"/>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading logs...</p>
      ) : filteredLogs.length === 0 ? (
        <p className="text-center text-gray-500">No logs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="text-md">
              <tr className="bg-gray-200 text-gray-700">
                <th className="border border-gray-300 px-4 py-2">Level</th>
                <th className="border border-gray-300 px-4 py-2 ">Timestamp</th>
                <th className="border border-gray-300 px-4 py-2 ">User Id</th>
                <th className="border border-gray-300 px-4 py-2">IP Address</th>
                <th className="border border-gray-300 px-4 py-2">Method</th>
                <th className="border border-gray-300 px-4 py-2">Path</th>
                <th className="border border-gray-300 px-4 py-2 ">Message</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredLogs.map((log, index) => (
                <tr key={index} className="border border-gray-300 text-center hover:bg-gray-100">

                  <td className="border border-gray-300 px-4 py-2 font-bold text-blue-600">{log.level}</td>
                  <td className="border border-gray-300 px-4 py-2">{formatTimestamp(log.timestamp)}</td>
                  <td className="border border-gray-300 px-4 py-2">{log.username}</td>
                  <td className="border border-gray-300 px-4 py-2">{log.ip}</td>
                  <td className="border border-gray-300 px-4 py-2">{log.method}</td>
                  <td className="border border-gray-300 px-4 py-2">{log.path}</td>
                  <td className="border border-gray-300 px-4 py-2 text-left">
                    {typeof log.message === "object" ? JSON.stringify(log.message) : log.message}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminLogs;
