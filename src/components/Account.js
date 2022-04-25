// get the fields values 
import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import Avatar from './Avatar';

const Account = ( { session } ) => {

    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [website, setWebsite] = useState(null)
    const [avatar_url, setAvatarUrl] = useState(null)

    useEffect(() => {
        getProfile()
    }, [session])

    const getProfile = async () => {
        try {
            setLoading(true)
            const user = supabase.auth.user()

            let { data, error, status } = await supabase
            .from('profiles')
            .select(`username, website, avatar_url`)
            .eq('id', user.id)
            .single()

            if(data){
                setUsername(data.username)
                setWebsite(data.website)
                setAvatarUrl(data.avatar_url)
            }

        } catch (error) {
            alert(error.message)
        }finally{
            setLoading(false)
        }
    }

    const updateProfile = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const user = supabase.auth.user();

            const updates = {
                id : user.id,
                username,
                website,
                avatar_url,
                updated_at: new Date()
            }

            let { error } = await supabase.from("profiles")
            .upsert(updates, { returning : 'minimal'})

            if(error){
                throw error;
            }
        } catch (error) {
            alert(error.message)
        } finally{
            setLoading(false)
        }
    }

    return (
        <div aria-live="polite" className='container mx-auto'>
      {loading ? (
        'Saving ...'
      ) : (
        <form onSubmit={updateProfile} className="form-widget">
            <Avatar
            url={avatar_url}
            size={150}
            onUpload={(url) => {
                setAvatarUrl(url)
                updateProfile({ username, website, avatar_url: url })
            }}
            />
          {/* <div>Email: {session.user.email}</div> */}
          <div class="container mx-auto w-72 py-4">
                <input type="text" 
                name="text" 
                id="username"
                class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="Your Name" 
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
                />
          </div>
          <div class="container mx-auto w-72 py-4">
              <input type="text" 
              name="text" 
              class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" 
              placeholder="your@website.com"
              id="website"
              value={website || ''}
              onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          <div className='text-center'>
              <button class="w-44 h-11 rounded-full text-gray-50 bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                Update Profile
              </button>
          </div>
          <div className="text-center">
              <button type="button" className="button" onClick={() => supabase.auth.signOut()}>
                  Sign Out
              </button>
          </div>
        </form>
      )}
      
    </div>
    )


}

export default Account;

// update these values