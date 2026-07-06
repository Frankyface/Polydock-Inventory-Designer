export function CategoryTabs({ categories, labels, active, onSelect }) {
  return (
    <div className="category-tabs" role="tablist">
      {categories.map((category) => (
        <button
          key={category}
          role="tab"
          type="button"
          aria-selected={category === active}
          className={category === active ? 'tab tab-active' : 'tab'}
          onClick={() => onSelect(category)}
        >
          {labels[category]}
        </button>
      ))}
    </div>
  )
}
