import React from 'react'

function CardList() {
  return (
    <>
    <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Printing Services</h3>
                <p className="text-gray-600">We offer a wide range of printing services, including digital printing, offset printing, and large format printing.</p>
            </div>
        </div>
    </div>
    </>
  )
}

export default CardList