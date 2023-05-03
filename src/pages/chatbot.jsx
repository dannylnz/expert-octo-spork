import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { AuthLayout } from '@/components/AuthLayout'

export default function chatbot() {
  return (
    <AuthLayout>
    <form>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Chatbot</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
          Ask any info related to your document in this instance
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">




            <div className="col-span-full">
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">

              </div>
            </div>
          </div>
        </div>

      </div>

    </form>
    </AuthLayout>
  )
}
