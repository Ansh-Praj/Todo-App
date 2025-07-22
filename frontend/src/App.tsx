import { useEffect, useState } from 'react';
import Login from './components/Login';
import Todo from './components/Todo';



export default function App() {
    const [token, setToken] = useState<null | string>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);


    

    if (!token || token.length===0) {
        return <Login setToken={setToken}/>
    }
    else{
        return <Todo token={token} setToken={setToken}/>
    }


}


