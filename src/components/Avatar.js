import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Icon from '../assets/Face.png'
import camera from '../assets/camera on.png'

export default function Avatar({ url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  const downloadImage = async (path) => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }

  const uploadAvatar = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ width: size }} aria-live="polite" className='container mx-auto text-center'>
       <div class="flex justify-center">
          <div class="flex flex-col justify-center shrink-0 relative">
              <label for="files" class=" opacity-25 w-full h-full bg-gray-400 rounded-full flex justify-center absolute  cursor-pointer">
                  {/* <img src={camera} alt="" class="w-24 h-24 mt-5" /> */}
              </label>
              <img 
                class="w-18 h-18 object-cover rounded-full" 
                src={avatarUrl ? avatarUrl : camera}
                alt={avatarUrl ? 'Avatar' : 'No image'}
                style={{ height: size, width: size }}
               />
               {uploading ? "Uploading..." : (
                 <>
                    <input 
                      type="file" 
                      id="files" 
                      accept="image/*"
                      class="hidden"
                      onChange={uploadAvatar}
                      disabled={uploading}/>
                 </>
                )}
          </div>
        </div>
    </div>
  )
}