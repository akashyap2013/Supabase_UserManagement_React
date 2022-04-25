import { useEffect, useState } from 'react';
import './App.css';
import { supabase } from './supabaseClient'
import Auth from './components/Auth';
import Account from './components/Account';

function App() {

  const [session, setSession] = useState(null)

  useEffect(() =>{
    setSession(supabase.auth.session())
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div className="container mx-auto">
      {!session ? <Auth /> : <Account key={session.user.id} session={session} />}
    </div>
  );
}

export default App;
