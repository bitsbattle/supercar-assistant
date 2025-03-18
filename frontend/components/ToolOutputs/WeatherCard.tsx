export const WeatherCard = ({ city, temp }: { city: string; temp: number }) => (
  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
    <div className="flex items-center gap-2 text-blue-600">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
      </svg>
      <h3 className="font-semibold">Weather in {city}</h3>
    </div>
    <div className="mt-2 text-2xl font-bold text-blue-800">{temp}°C</div>
  </div>
); 