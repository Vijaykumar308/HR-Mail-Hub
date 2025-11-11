import { useState } from "react"
import { Check } from "lucide-react"
import { FaGooglePlusG } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.username.trim()) newErrors.username = "Username is required"
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format"
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length === 0) {
      alert("Account created successfully!")
      setFormData({
        username: "",
        fullName: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
      })
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="The HR Hub Logo"
            className="h-12 w-auto object-contain"
            style={{
              maxHeight: '60px',
              width: 'auto',
              height: 'auto',
              maxWidth: '200px',
              display: 'block',
              mixBlendMode: 'multiply'
            }}
          />
          <h1 className="text-2xl font-bold text-gray-900 hidden sm:block">The HR Hub</h1>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-gray-600">Already have an account?</p>
          <Link to="/login" className="px-6 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition">
            Log In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-between max-w-7xl mx-auto px-8 py-12 gap-12">
        {/* Left Section - Hero */}
        <div className="flex-1">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">Take Control of Your Job Search.</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Streamline your job hunt with our all-in-one dashboard. Stop juggling spreadsheets and start landing
            interviews.
          </p>

          {/* Features */}
          <div className="space-y-4">
            {[
              "Track all your applications in one place.",
              "Manage resumes and cover letters.",
              "Prepare for interviews with key insights.",
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-gray-700 font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Signup Form */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Create Your Account</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username and Full Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="e.g. john.doe"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.username ? "border-red-500" : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                  {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.fullName ? "border-red-500" : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
              </div>

              {/* Email and Mobile */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.email ? "border-red-500" : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Mobile No.</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="(123) 456-7890"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.mobile ? "border-red-500" : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                  {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                </div>
              </div>

              {/* Password and Confirm Password */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.password ? "border-red-500" : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full  text-white bg-primary-600 hover:bg-primary-700 font-bold py-3 rounded-lg transition transform hover:scale-105 active:scale-95"
              >
                Create Account
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-300"></div>
                <p className="text-gray-500 text-sm">Or sign up with</p>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-1 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  {/* <span>🔍</span> */}
                  <span className="font-semibold text-gray-700"><FaGooglePlusG size={50}/></span>
                </button>
                {/* <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <span>💼</span>
                  <span className="font-semibold text-blue-600">LinkedIn</span>
                </button> */}
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-600 text-center">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                &{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
