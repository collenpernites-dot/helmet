import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
      <span>Page {page} of {pages}</span>
      <div className="flex gap-1">
        <button className="icon-btn" disabled={page === 1} onClick={() => onPage(page - 1)}>
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            onClick={() => onPage(i + 1)}
            className={`rounded-md px-3 py-1 ${page === i + 1 ? 'bg-brand-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            {i + 1}
          </button>
        ))}
        <button className="icon-btn" disabled={page === pages} onClick={() => onPage(page + 1)}>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
