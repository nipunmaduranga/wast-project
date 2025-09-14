import { FaRecycle, FaDollarSign, FaLeaf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white font-sans overflow-x-hidden">
      {/* Header */}
      <header className="flex justify-between items-center px-12 py-6 backdrop-blur-lg bg-white/5 sticky top-0 z-50 border-b border-orange-500/30 shadow-lg">
        <div className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent tracking-wide">
          Smart Waste Sorting
        </div>
        <nav className="space-x-6 flex items-center">
          <a
            href="#features"
            className="hover:text-orange-400 transition duration-300 font-semibold"
          >
            Features
          </a>
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-orange-500 to-orange-700 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:shadow-orange-600/40 hover:scale-105 transition-transform duration-300"
          >
            Get Started
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col justify-center items-center text-center mt-28 px-6">
        <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-700 text-transparent bg-clip-text mb-6 animate-fade-in">
          Sort Waste & Earn Rewards
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mb-10 leading-relaxed drop-shadow-lg">
          Join our eco-community and protect the planet by sorting plastic,
          metal, and glass bottles. Every action you take is rewarded while
          making Earth greener 🌍.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-gradient-to-r from-orange-500 to-orange-700 text-white px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-orange-600/50 transition transform hover:scale-110"
        >
          Start Sorting Now
        </button>
      </main>

      {/* Features Section */}
      <section
        id="features"
        className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-28 px-12"
      >
        <FeatureCard
          Icon={FaRecycle}
          title="Eco-Friendly"
          description="Reduce pollution by recycling waste correctly."
          gradient="from-green-400 to-green-600"
        />
        <FeatureCard
          Icon={FaDollarSign}
          title="Earn Rewards"
          description="Turn your recycling into money and benefits."
          gradient="from-yellow-400 to-orange-500"
        />
        <FeatureCard
          Icon={FaLeaf}
          title="Sustainable Future"
          description="Together we build a cleaner, healthier tomorrow."
          gradient="from-cyan-400 to-blue-600"
        />
      </section>

      {/* Footer */}
      <footer className="p-8 text-center text-gray-300 bg-black/70 mt-28 border-t border-orange-500/30 backdrop-blur-lg">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Smart Waste Sorting System. All
          rights reserved.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ Icon, title, description, gradient }) {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 flex flex-col items-center text-center shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 border border-orange-500/20">
      <div
        className={`p-6 rounded-2xl bg-gradient-to-br ${gradient} mb-6 shadow-lg`}
      >
        <Icon size={40} className="text-white" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}

export default Home;
