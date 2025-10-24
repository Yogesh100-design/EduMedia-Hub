// Pricing.jsx
import React, { useState } from "react";

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: { monthly: 0, yearly: 0 },
      description: "Perfect for students exploring the platform.",
      features: [
        "1 GB Cloudinary storage",
        "JWT authentication",
        "Student role only",
        "Community support",
      ],
      cta: "Start for free",
      popular: false,
    },
    {
      name: "Creator",
      price: { monthly: 12, yearly: 8 },
      description: "For educators publishing rich content.",
      features: [
        "25 GB Cloudinary storage",
        "Unlimited uploads",
        "Student & Teacher roles",
        "Detailed analytics",
        "Priority support",
      ],
      cta: "Start 14-day trial",
      popular: true,
    },
    {
      name: "Institution",
      price: { monthly: 39, yearly: 200 },
      description: "Scale across departments and campuses.",
      features: [
        "100 GB Cloudinary storage",
        "All roles + Admin dashboard",
        "SSO & custom branding",
        "Advanced analytics",
        "24×7 phone & email support",
      ],
      cta: "Contact sales",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-gray-600">
            Choose the plan that fits your teaching or learning needs.
          </p>

          {/* Toggle */}
          <div className="mt-6 inline-flex items-center gap-3 bg-white rounded-full p-1 shadow">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                !annual ? "bg-indigo-600 text-white" : "text-gray-600"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                annual ? "bg-indigo-600 text-white" : "text-gray-600"
              }`}
            >
              Yearly
              <span className="ml-1.5 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                Save 33%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl ${
                p.popular ? "border-2 border-indigo-500 shadow-xl" : "border border-gray-200 bg-white"
              } p-6 flex flex-col`}
            >
              {p.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">
                  Most popular
                </span>
              )}

              {/* Price */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800">{p.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${annual ? p.price.yearly : p.price.monthly}
                  </span>
                  <span className="text-gray-500">/ {annual ? "yr" : "mo"}</span>
                </div>
                {p.price.monthly > 0 && annual && (
                  <p className="text-xs text-green-600 mt-1">Billed yearly</p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 text-sm text-gray-600 mb-6 flex-grow">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={p.name === "Institution" ? "/contact" : "/register"}
                className={`w-full text-center rounded-lg px-4 py-2.5 font-medium transition ${
                  p.popular
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                }`}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-10 text-center text-xs text-gray-500">
          All prices in USD. Cancel anytime. No hidden fees.
        </p>
      </div>
    </section>
  );
}