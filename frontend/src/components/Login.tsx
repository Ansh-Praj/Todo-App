import { useState } from 'react'
import { toast, ToastContainer, Zoom } from 'react-toastify'

interface LoginProps{
    setToken: (token: string)=> void
}

export default function Login({setToken} : LoginProps) {
    const [isSignup, setIsSignup] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const toastID = toast.loading('Submitting Details...')

        if (isSignup) {
            try {
                const response = await fetch('http://localhost:3000/api/v1/auth/signup', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username: formData.username, password: formData.password })
                })
                
                const resData = await response.json()

                if(response.status===500){
                    toast.update(toastID, {
                    render: resData.message,
                    type: 'error',
                    isLoading: false,
                    autoClose: 2000,
                    closeButton: true
                    })
                    return
                }

                if(response.status===400){
                    toast.update(toastID, {
                    render: resData.message,
                    type: 'error',
                    isLoading: false,
                    autoClose: 2000,
                    closeButton: true
                    })
                    return
                }

                if(response.ok){
                    localStorage.setItem('token', resData.token)
                    setToken(resData.token)

                    toast.update(toastID, {
                    render: "Account Created Successfully!",
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                    closeButton: true
                    })
                    return
                }
                

            }
            catch (error: any) {
                const errMssg = error?.message || "Internal Server Error"
                toast.update(toastID, {
                    render: errMssg,
                    type: 'error',
                    isLoading: false,
                    autoClose: 2000,
                    closeButton: true
                })
            }
        }

        else {
            try{

                const response = await fetch('http://localhost:3000/api/v1/auth/login', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username: formData.username, password: formData.password })
                })
                
                const resData = await response.json()

                if(!response.ok){
                    toast.update(toastID, {
                        render: resData.message,
                        type: 'error',
                        isLoading: false,
                        autoClose: 2000,
                        closeButton: true
                    })
                    return
                }
                
                // if(response.status===500){
                //     toast.update(toastID, {
                //         render: resData.message,
                //         type: 'error',
                //         isLoading: false,
                //         autoClose: 2000,
                //         closeButton: true
                //     })
                //     return
                // }
                
                // if(response.status===400){
                //     toast.update(toastID, {
                //     render: resData.message,
                //     type: 'error',
                //     isLoading: false,
                //     autoClose: 2000,
                //     closeButton: true
                //     })
                //     return
                // }

                // if(response.status===404){
                //     toast.update(toastID, {
                //     render: resData.message,
                //     type: 'error',
                //     isLoading: false,
                //     autoClose: 2000,
                //     closeButton: true
                //     })
                //     return
                // }
                
                // if(response.status===401){
                //     toast.update(toastID, {
                //     render: resData.message,
                //     type: 'error',
                //     isLoading: false,
                //     autoClose: 2000,
                //     closeButton: true
                //     })
                //     return
                // }
                
                if(response.ok){
                    localStorage.setItem('token', resData.token)
                    setToken(resData.token)
                    toast.update(toastID, {
                        render: "Account Created Successfully!",
                        type: 'success',
                        isLoading: false,
                        autoClose: 2000,
                        closeButton: true
                    })
                    return
                }
                
                
            }
            catch (error: any) {
                const errMssg = error?.message || "Internal Server Error"
                toast.update(toastID, {
                    render: errMssg,
                    type: 'error',
                    isLoading: false,
                    autoClose: 2000,
                    closeButton: true
                })
            }
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
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



            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    {isSignup ? 'Create an account' : 'Sign in to your account'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        name="username"
                        type="text"
                        onChange={handleChange}
                        value={formData.username}
                        placeholder="Username"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                    />
                    <input
                        name="password"
                        type="password"
                        onChange={handleChange}
                        value={formData.password}
                        placeholder="Password"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                    />
                    <button
                        type="submit"
                        className="w-full cursor-pointer bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200"
                    >
                        {isSignup ? 'Sign Up' : 'Login'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-4">
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        className="text-indigo-600 hover:underline cursor-pointer"
                        onClick={() => setIsSignup(!isSignup)}
                    >
                        {isSignup ? 'Login' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    )
}
