import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BASE_URL from "../api/api";
import { getAuthHeader } from "../utils/auth";

function QuizDetail() {
    const { category } = useParams();
    const [allowed, setAllowed] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${BASE_URL}/result/can-attempt/${category}`, {
            headers: getAuthHeader()
        })
            .then(res => res.json())
            .then(setAllowed);
    }, [category]);

    return (
        <div className="p-6 text-center">

            <h2 className="text-2xl font-bold mb-4">
                {category.toUpperCase()} Quiz
            </h2>

            {!allowed ? (
                <p className="text-red-500 font-semibold">
                    ❌ You already attempted twice
                </p>
            ) : (
                <button
                    onClick={() => {
                        localStorage.setItem("category", category); // ✅ FIX
                        navigate(`/quiz/${category}/start`);
                    }}
                    className="bg-blue-500 text-white px-5 py-2 rounded"
                >
                    Start Quiz 🚀
                </button>
            )}
        </div>
    );
}

export default QuizDetail;