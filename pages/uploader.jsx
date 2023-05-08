import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { AuthLayout } from '@/components/AuthLayout'
import { Button } from '@/components/Button'
import { useState } from 'react'
import axios from 'axios'


export default function uploader() {
  const [selectedFile, setSelectedFile] = useState()
  const [uploading, setUploading] = useState(false)

  const uploadHandler = async () => {
    try{
      if(!selectedFile) return;
      setUploading(true)
      const formData = new FormData();
      formData.append("myFile", selectedFile);
      const {data} = await axios.post("/api/uploader", formData);
      console.log(data);
    }
    catch(error){
      console.log(error.response?.data)
    }
    setUploading(false)
  }

  return (
    <AuthLayout>
    <form>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Upload your preferred documents</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            in .PDF, .Doc, .txt
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">




            <div className="col-span-full">
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>select a file</span>
                      <input onChange={({target}) => {
                        if(target.files){
                          const file = target.files[0]
                          setSelectedFile(file);
                        }
                      }} 
                      id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
          Cancel
        </button>
        <button 
          type="button"
          className="text-sm font-semibold leading-6 text-blue-500"
          onClick={uploadHandler}
          disabled={uploading}
          >
          Upload
        </button>
        <Button href="/chatbot" className="px-4">
              Start talking with the chatbot
            </Button>
      </div>
    </form>
    </AuthLayout>
  )
}
