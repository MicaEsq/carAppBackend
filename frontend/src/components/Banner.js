
export default function Banner() {
  return (
    <div className="relative isolate flex items-center justify-center overflow-hidden bg-indigo-100 px-6 py-2.5 sm:px-8">
        <div className="flex items-center gap-x-4 gap-y-2">
            <p className="text-sm leading-6 text-gray-900">
            <strong className="font-semibold pr-1">Latest news!  ·</strong>
            For the month of July we have a special offer for you! Do you want to hear it?
            </p>
            <a
            href="#"
            className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            >
            Tell me more!
            </a>
        </div>
    </div>
  )
}