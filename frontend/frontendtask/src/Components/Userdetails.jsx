import { useState, useEffect } from "react";

export default function Userdetails() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        fetchUsers();
    }, [currentPage]);
    const fetchUsers = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`http://localhost:3000/users?page=${currentPage}&limit=10`);
            if (!response.ok) {
                throw new Error(`Error:${response.status}`);
            }
            const data = await response.json();
            setUsers(data.users);
            setTotalPages(data.totalPages);
        } catch (error) {
            setError("Failed to fetch users");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-2 border-2 w-2/4 mx-auto border-solid border-gray-300 rounded-lg shadow-md mt-4">
            <h1 className="text-xl font-bold mb-2">User directory</h1>
            {
                loading && <p>Loading...</p>
            }
            {
                error && <p>Error: {error}</p>
            }
            {
                users.length > 0 && (
                    <table className="min-w-full text-sm text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="py-2">Username</th>
                                <th className="py-2">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b">
                                    <td className="py-2">{user.username}</td>
                                    <td className="py-2">{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            }
        </div>
    )
}