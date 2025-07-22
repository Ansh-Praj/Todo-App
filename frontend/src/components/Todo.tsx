import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer, Zoom } from "react-toastify";

const BACKEND_URL= "http://localhost:3000/api/v1"

interface Todo {
  id: number;
  task: string;
  completed: boolean;
}

interface LoginProps{
    token: string | null;
    setToken: (token: string | null) => void
}

export default function Todo({setToken, token}: LoginProps) {

	const [todos, setTodos] = useState<Todo[]>([])
	const [newTodo, setNewTodo] = useState('')


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

        if (!newTodo.trim()) return;

		try {
			const response = await axios.post(`${BACKEND_URL}/todo`, { task: newTodo }, {
				headers: { Authorization: `${token}` }
			});
			const todo = response.data

			setNewTodo('');
			setTodos((prev) => [...prev, todo])
		} catch (error:any) {
			toast.error(error.message)
		}
    };

	const handleToggle = async(id: number) => {
		setTodos(prev => 
			prev.map((todo)=> 
				todo.id === id ? {...todo, completed: !todo.completed } : todo
		))

		try {
			const response = await axios.put(`${BACKEND_URL}/todo/${id}`, { completed: !(todos.find(todo => todo.id === id)?.completed) }, {
				headers: { Authorization: `${token}` }
			});

			const updatedTodo = response.data

			// just to make sure UI and DB is in sync
			setTodos(prev => 
				prev.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo))
			)

		} catch (error:any) {
			toast.error(error.message)
		}
	}

    const deleteTodo = async (id: number) => {

		setTodos(prev =>
			prev.filter(todo =>
				todo.id !== id
			)
		)

        const response = await axios.delete(`${BACKEND_URL}/todo/${id}`, {
            headers: { Authorization: `${token}` }
        });

		toast.success(response.data)
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setTodos([]);
    };


    useEffect(() => {
      const fetchTodos = async () => {
        try {
          
          const res = await axios.get(`${BACKEND_URL}/todo`, {
            headers: { Authorization: `${token}` }
          });
          setTodos(res.data);
        } catch (error) {
          console.error('Invalid or expired token');
          localStorage.removeItem('token');
          setToken('');
        }
      };
      fetchTodos()

    }, [])
    

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg p-8">
		<div className="relative flex items-center justify-between mb-6">
			<h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold">
				Todo App
			</h1>

			<div></div>

			<button onClick={logout} className="text-sm font-bold text-indigo-500 hover:underline cursor-pointer text-end">Log out</button>
		</div>

        <form onSubmit={handleSubmit} className="flex items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter a new task..."
			value={newTodo}
			onChange={(e) => setNewTodo(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
            Add
          </button>
        </form>

        {/* Todo list */}
        <ul className="space-y-4">
			{todos.map((todo:Todo)=>(
				<li key={todo.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md shadow-sm">
					<div className="flex items-center gap-3">
						<input 
						type="checkbox" 
						checked={todo.completed} 
						readOnly={todo.completed} 
						className="h-5 w-5 text-indigo-600" 
						onChange={() => handleToggle(todo.id)}
						/>
						<span className={`${todo.completed ? "text-gray-400 line-through" : "text-gray-800"}`}>{todo.task}</span>
					</div>
					<div className="space-x-2">
						<button onClick={()=> deleteTodo(todo.id)} className="text-sm text-red-600 hover:underline cursor-pointer">Delete</button>
					</div>
				</li>
			))}

        </ul>
      </div>
	  <ToastContainer
		position="top-right"
		autoClose={5000}
		hideProgressBar={false}
		newestOnTop={false}
		closeOnClick={false}
		rtl={false}
		pauseOnFocusLoss
		draggable
		pauseOnHover
		theme="light"
		transition={Zoom}
		/>
    </div>
  );
}
