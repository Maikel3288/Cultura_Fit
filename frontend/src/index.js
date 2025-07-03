import { addUser } from "./services/firestoreService";
function App() {
const user = {
  uid: "abc123def456",
  email: "usuario@example.com",
  displayName: "Juan Pérez",
  role: "premium",           // puede ser "free" o "premium"
  createdAt: new Date("2023-05-01T10:30:00Z")
};

addUser(user)
  
    return (
      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold text-blue-600">¡Hola Miguel!</h1>
        <p className="mt-2 text-lg">Tailwind está funcionando correctamente 🚀</p>
      </div>
    );
  }
  