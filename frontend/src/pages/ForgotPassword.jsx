import { useState } from "react";
import { Check } from "lucide-react";
import { FaGooglePlusG } from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    // Here you would typically make an API call to handle password reset
    console.log("Reset password requested for:", email);
    setIsSubmitted(true);
  };

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
          <p className="text-gray-600">Remember your password?</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-6 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-between max-w-7xl mx-auto px-8 py-12 gap-12">
        {/* Left Section - Hero */}
        <div className="flex-1">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">Reset Your Password</h2>
          <p className="text-md text-gray-600 mb-8 leading-relaxed">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {/* Features */}
          <div className="space-y-4">
            {[
              "Secure password reset process",
              "Instant email delivery",
              "24/7 support available"
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

        {/* Right Section - Reset Form */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h3>
            <p className="text-gray-600 mb-8">Enter your email to reset your password</p>

            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Check Your Email</h4>
                <p className="text-gray-600 mb-6">We've sent a password reset link to {email}</p>
                <button
                  onClick={() => window.location.href = '/login'}
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      error ? "border-red-500" : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                  {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105 active:scale-95"
                >
                  Send Reset Link
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <p className="text-gray-500 text-sm">Or sign in with</p>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-1 gap-4">
                  <button
                    type="button"
                    onClick={() => window.location.href = '/auth/google'}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <FaGooglePlusG className="text-red-500" size={20} />
                    <span className="font-semibold text-gray-700">Continue with Google</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
