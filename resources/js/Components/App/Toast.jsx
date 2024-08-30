import {useEventBus} from "@/EventBus.jsx";
import {useEffect, useState} from "react";
import {v4} from "uuid";


export default function Toast({ }) {
    const [toasts, setToasts] = useState([])
    const {on} =useEventBus()

    useEffect(() => {
        on('toast.show', (message) => {
            const uuid = v4(); // Call v4 to generate a new UUID
            setToasts((oldToasts) => [...oldToasts, { message, uuid }]);
            setTimeout(() => {
                setToasts((oldToasts) => oldToasts.filter((toast) => toast.uuid !== uuid));
            }, 5000);
        });
    }, [on]);

    return(
        <div className="toast toast-top toast-center min-w-[280px]">
            {toasts.map((toast, index) => (
                <div key={toast.uuid} className="alert alert-success py-3 px-4 text-gray-100 rounded-lg">
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    );
}
