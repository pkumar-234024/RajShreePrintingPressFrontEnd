import React from "react";
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeftIcon, StarIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function CardDetail() {
  const { state } = useLocation();
  if (!state) return <div className="min-h-screen flex items-center justify-center">No data found.</div>;

  const { name, desc, imageurl, id } = state;

  // Mock data for demonstration - you can replace with real data
  const mockData = {
    price: "₹299",
    originalPrice: "₹399",
    rating: 4.8,
    reviews: 127,
    features: [
      "High-quality printing",
      "Fast turnaround time",
      "Custom designs available",
      "Multiple size options",
      "Free consultation",
      "Quality guarantee"
    ],
    specifications: {
      "Print Type": "Digital & Offset",
      "Paper Quality": "Premium GSM",
      "Turnaround Time": "2-3 business days",
      "Minimum Order": "50 pieces",
      "Design Support": "Included",
      "Delivery": "Free local delivery"
    },
    description: "Experience premium printing services with our state-of-the-art equipment and expert craftsmanship. We ensure every detail is perfect, from design to final print."
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Services
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img 
                src={imageurl || "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                alt={name} 
                className="w-full h-96 object-cover"
              />
            </div>
            
            {/* Additional Images Grid */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-${1500000000000 + i}?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80`}
                    alt={`${name} view ${i}`}
                    className="w-full h-24 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(mockData.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {mockData.rating} ({mockData.reviews} reviews)
                </span>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">{desc}</p>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold text-blue-600">{mockData.price}</span>
                <span className="ml-2 text-xl text-gray-500 line-through">{mockData.originalPrice}</span>
                <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  25% OFF
                </span>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Get Quote Now
              </button>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mockData.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Specifications</h3>
              <div className="space-y-3">
                {Object.entries(mockData.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium text-gray-700">{key}</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Full Description */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-semibold mb-4">Detailed Description</h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">{mockData.description}</p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our printing services are designed to meet the highest standards of quality and precision. 
              We use advanced printing technology combined with skilled craftsmanship to deliver exceptional results 
              for all your printing needs.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Whether you need business cards, wedding invitations, banners, or any other printing service, 
              we guarantee satisfaction with every project. Contact us today to discuss your requirements 
              and get a personalized quote.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-2">Ready to Get Started?</h3>
            <p className="text-blue-100 mb-4">Contact us for a free consultation and quote</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Call Now: +91 9632587410
              </button>
              <button className="bg-white text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                WhatsApp Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}    