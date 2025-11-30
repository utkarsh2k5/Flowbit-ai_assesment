import { useMapStore } from '../store/mapStore'

function SidebarToggleButton() {
  const { sidebarOpen, setSidebarOpen } = useMapStore()

  const handleClick = () => {
    console.log('Toggle clicked, current state:', sidebarOpen)
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <button
      onClick={handleClick}
      className="relative z-50 bg-white dark:bg-gray-800 p-2 rounded-md shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200"
      aria-label="Toggle sidebar"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {sidebarOpen ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        )}
      </svg>
    </button>
  )
}

export default SidebarToggleButton
