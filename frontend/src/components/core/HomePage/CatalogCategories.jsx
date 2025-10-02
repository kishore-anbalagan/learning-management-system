import React from 'react'
import { Link } from 'react-router-dom'

const CatalogCategories = () => {
  const categories = [
    {
      id: "Web Development",
      name: "Web Development",
      description: "Learn to build modern web applications",
      icon: "💻"
    },
    {
      id: "Data Science",
      name: "Data Science",
      description: "Master data analysis and machine learning",
      icon: "📊"
    },
    {
      id: "Mobile Development",
      name: "Mobile Development",
      description: "Create apps for iOS and Android",
      icon: "📱"
    }
  ]

  return (
    <div className="w-full my-8">
      <h2 className="text-white text-2xl font-semibold mb-6">Popular Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            to={`/catalog/${category.id}`} 
            className="bg-richblack-800 p-5 rounded-lg transition-all duration-200 hover:scale-105 hover:bg-richblack-700"
          >
            <div className="flex flex-col gap-3">
              <div className="text-4xl">{category.icon}</div>
              <h3 className="text-xl text-yellow-50 font-semibold">{category.name}</h3>
              <p className="text-richblack-300">{category.description}</p>
              <div className="mt-4 text-yellow-50 font-medium flex items-center gap-2">
                Browse Courses
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CatalogCategories