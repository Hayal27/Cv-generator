import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FileText, 
  Zap, 
  Download, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Shield,
  Clock,
  Award,
  TrendingUp,
  Globe,
  Briefcase,
  Target,
  Sparkles,
  ChevronRight,
  Brain,
  Rocket,
  Zap as Lightning
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: <Brain className="h-12 w-12 text-white" />,
      title: 'AI-Powered Intelligence',
      description: 'Advanced machine learning algorithms analyze job markets and optimize your CV content for maximum impact and ATS compatibility.',
      gradient: 'from-purple-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&auto=format&q=80'
    },
    {
      icon: <Shield className="h-12 w-12 text-white" />,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and security protocols ensure your personal information and career data remain completely protected.',
      gradient: 'from-green-500 to-teal-500',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop&auto=format&q=80'
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-white" />,
      title: 'Performance Analytics',
      description: 'Real-time insights and performance metrics help you understand how your CV performs across different industries and roles.',
      gradient: 'from-blue-500 to-indigo-500',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&auto=format&q=80'
    },
    {
      icon: <Globe className="h-12 w-12 text-white" />,
      title: 'Global Standards',
      description: 'Templates and formats that meet international hiring standards across 50+ countries and multiple languages.',
      gradient: 'from-orange-500 to-red-500',
      image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=300&fit=crop&auto=format&q=80'
    }
  ];

  const stats = [
    { number: '50+', label: 'CVs Created', icon: <FileText className="h-6 w-6" /> },
    { number: '98%', label: 'Success Rate', icon: <Target className="h-6 w-6" /> },
    { number: '2+', label: 'Countries', icon: <Globe className="h-6 w-6" /> },
  ];

  const benefits = [
    'AI-powered content optimization and enhancement',
    'ATS-compatible templates with 99% pass rate',
    'Real-time job market analysis and matching',
    'Multi-format export (PDF, DOCX, HTML)',
    'Collaborative editing and team management',
    'Advanced analytics and performance tracking',
    'Industry-specific template customization',
    'Mobile-responsive design and editing'
  ];

  const testimonials = [
    {
      name: 'Dawit Mekonnen',
      role: 'Senior Software Developer',
      company: 'Ethio Telecom',
      content: 'የዚህ መድረክ AI ቴክኖሎጂ በጣም አስደናቂ ነው። በቀላሉ ሙያዊ CV መፍጠር ችያለሁ። This platform helped me showcase my technical skills perfectly for the Ethiopian tech market.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format&q=80'
    },
    {
      name: 'Hanan Ahmed',
      role: 'Digital Marketing Manager',
      company: 'Commercial Bank of Ethiopia',
      content: 'The templates are perfectly suited for Ethiopian corporate standards. I got three interview calls within a week of using this platform. Highly recommended!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&auto=format&q=80'
    },
    {
      name: 'Yohannes Tadesse',
      role: 'Project Manager',
      company: 'Ethiopian Airlines',
      content: 'As someone working in aviation industry, presentation matters. This AI-powered CV generator created a professional resume that impressed international partners.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format&q=80'
    },
    {
      name: 'Meron Bekele',
      role: 'Data Analyst',
      company: 'Dashen Bank',
      content: 'The job matching feature is incredible! It analyzed banking sector requirements and optimized my CV accordingly. Got promoted within 3 months.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format&q=80'
    },
    {
      name: 'Abebe Worku',
      role: 'Operations Director',
      company: 'Ethiopian Electric Power',
      content: 'Used this for our entire engineering team recruitment. The quality and professionalism of CVs generated here is outstanding. Perfect for Ethiopian enterprises.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format&q=80'
    },
    {
      name: 'Selamawit Girma',
      role: 'HR Business Partner',
      company: 'Awash Bank',
      content: 'From HR perspective, CVs created here are well-structured and ATS-friendly. We now recommend this platform to all our job applicants.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
          style={{
            left: `${mousePosition.x * 0.02}%`,
            top: `${mousePosition.y * 0.02}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.3s ease-out'
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/10 to-teal-400/10 rounded-full blur-3xl"
          style={{
            right: `${mousePosition.x * 0.01}%`,
            bottom: `${mousePosition.y * 0.01}%`,
            transform: 'translate(50%, 50%)',
            transition: 'all 0.5s ease-out'
          }}
        />
      </div>

      {/* Hero Section with Brand Gradient */}
      <div 
        className="relative overflow-hidden z-10"
        style={{ background: 'linear-gradient(100deg, rgb(22, 40, 79) 2%, rgb(12, 124, 146) 100%)' }}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 animate-pulse" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Floating AI Icons */}
        <div className="absolute inset-0 overflow-hidden">
          <Brain className="absolute top-20 left-10 h-8 w-8 text-white/20 animate-bounce" style={{ animationDelay: '0s' }} />
          <Rocket className="absolute top-40 right-20 h-6 w-6 text-white/20 animate-bounce" style={{ animationDelay: '1s' }} />
          <Lightning className="absolute bottom-40 left-20 h-10 w-10 text-white/20 animate-bounce" style={{ animationDelay: '2s' }} />
          <Sparkles className="absolute bottom-20 right-10 h-7 w-7 text-white/20 animate-bounce" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div 
              className="text-white animate-fade-in-up"
              data-animate
              id="hero-content"
            >
              {/* Logo Integration with Animation */}
              <div className="flex items-center mb-8 animate-slide-in-left">
                <img 
                  src="/img/logo.jpg" 
                  alt="Ethiopian IT Park Logo" 
                  className="h-16 w-16 rounded-lg shadow-lg mr-4 hover:scale-110 transition-transform duration-300"
                />
                <div>
                  <h3 className="text-xl font-semibold">Ethiopian IT Park</h3>
                  <p className="text-blue-200">AI-Powered Career Solutions</p>
                </div>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up">
                Build Your
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent animate-pulse">
                  Perfect Career
                </span>
                with AI
              </h1>
              
              <p className="text-xl lg:text-2xl mb-8 text-blue-100 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Enterprise-grade CV generation platform powered by advanced AI. 
                Create professional resumes that get noticed by top employers worldwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="group inline-flex items-center px-8 py-4 bg-white text-brand-dark font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
                  >
                    Access Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="group inline-flex items-center px-8 py-4 bg-white text-brand-dark font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
                    >
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/templates"
                      className="group inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-brand-dark transition-all duration-300 transform hover:scale-105"
                    >
                      Explore Templates
                      <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </>
                )}
              </div>

              {/* Animated Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="text-center transform hover:scale-110 transition-all duration-300"
                    style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                  >
                    <div className="flex justify-center mb-2 text-blue-200 animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold">{stat.number}</div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Animated Visual */}
            <div className="relative animate-fade-in-right">
              {/* Main CV Preview with Enhanced Animation */}
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="h-4 bg-brand-light rounded w-2/3 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="space-y-2 pt-4">
                    <div className="h-3 bg-gray-100 rounded w-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                    <div className="h-3 bg-gray-100 rounded w-5/6 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    <div className="h-3 bg-gray-100 rounded w-4/5 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                  <div className="pt-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-ping"></div>
                      <div className="h-2 bg-gray-200 rounded flex-1 animate-pulse"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                      <div className="h-2 bg-gray-200 rounded flex-1 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background Decorative Elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl transform -rotate-6 opacity-20 animate-pulse"></div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-30 animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with Scroll Animations */}
      <div className="py-24 bg-gray-50 relative">
        {/* Background Image with Transparency */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop&auto=format&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className={`text-center mb-20 transition-all duration-1000 ${isVisible['features-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            data-animate
            id="features-header"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Leverage cutting-edge technology and professional design to create CVs that stand out 
              in today's competitive job market.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${isVisible[`feature-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                data-animate
                id={`feature-${index}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="relative p-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-brand-dark transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits & CTA Section with Parallax */}
      <div className="py-24 bg-white relative overflow-hidden">
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop&auto=format&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${mousePosition.y * 0.1}px)`
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div 
              className={`transition-all duration-1000 ${isVisible['benefits'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
              data-animate
              id="benefits"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                Everything You Need for
                <span className="block text-brand-light">Career Success</span>
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Our comprehensive platform provides all the tools, insights, and support 
                you need to create compelling CVs that get results.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start space-x-3 transition-all duration-500 hover:translate-x-2 ${isVisible['benefits'] ? 'opacity-100' : 'opacity-0'}`}
                    style={{ transitionDelay: `${index * 0.1}s` }}
                  >
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5 animate-pulse" />
                    <span className="text-gray-700 leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>

              {!isAuthenticated && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-4 bg-brand-dark text-white font-semibold rounded-xl hover:bg-brand-light transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
                  >
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/templates"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-brand-dark text-brand-dark font-semibold rounded-xl hover:bg-brand-dark hover:text-white transition-all duration-300 transform hover:scale-105"
                  >
                    View Templates
                  </Link>
                </div>
              )}
            </div>

            <div 
              className={`relative transition-all duration-1000 ${isVisible['premium-card'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
              data-animate
              id="premium-card"
            >
              <div className="bg-gradient-to-r from-brand-dark to-brand-light rounded-2xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <Award className="h-8 w-8 mr-3 animate-spin" style={{ animationDuration: '3s' }} />
                  <h3 className="text-2xl font-bold">Premium Features</h3>
                </div>
                
                <div className="space-y-4 mb-8">
                  {['AI Content Enhancement', 'Advanced Analytics', 'Priority Support', 'Unlimited Downloads'].map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between hover:translate-x-2 transition-transform duration-300"
                      style={{ transitionDelay: `${index * 0.1}s` }}
                    >
                      <span>{feature}</span>
                      <CheckCircle className="h-5 w-5 animate-pulse" />
                    </div>
                  ))}
                </div>

                {isAuthenticated ? (
                  <Link
                    to="/cv/new"
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-white text-brand-dark font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                  >
                    Create New CV
                    <Briefcase className="ml-2 h-5 w-5" />
                  </Link>
                ) : (
                  <Link
                    to="/register"
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-white text-brand-dark font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section with Staggered Animation */}
      <div className="py-24 bg-gray-50 relative">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop&auto=format&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${isVisible['testimonials-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            data-animate
            id="testimonials-header"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Ethiopian Industry Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of Ethiopian professionals from leading companies who have accelerated their careers with our AI-powered platform.
            </p>
          </div>

          {/* First row - 3 testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 ${isVisible[`testimonial-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                data-animate
                id={`testimonial-${index}`}
                style={{ transitionDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 hover:scale-110 transition-transform duration-300"
                  />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                  "{testimonial.content}"
                </p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                  <div className="text-sm text-brand-light font-medium">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Second row - 3 testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.slice(3, 6).map((testimonial, index) => (
              <div 
                key={index + 3} 
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 ${isVisible[`testimonial-${index + 3}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                data-animate
                id={`testimonial-${index + 3}`}
                style={{ transitionDelay: `${(index + 3) * 0.2}s` }}
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 hover:scale-110 transition-transform duration-300"
                  />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                  "{testimonial.content}"
                </p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                  <div className="text-sm text-brand-light font-medium">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Ethiopian Companies Logos Section with Animation */}
          <div 
            className={`mt-16 text-center transition-all duration-1000 ${isVisible['companies'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            data-animate
            id="companies"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Trusted by Leading Ethiopian Organizations
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {['Ethiopian Airlines', 'Ethio Telecom', 'Commercial Bank of Ethiopia', 'Dashen Bank', 'Awash Bank', 'Ethiopian Electric Power'].map((company, index) => (
                <div 
                  key={index}
                  className="text-lg font-semibold text-gray-600 hover:text-brand-light transition-all duration-300 transform hover:scale-110"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section with Animated Background */}
      <div 
        className="py-24 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(100deg, rgb(22, 40, 79) 2%, rgb(12, 124, 146) 100%)' }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 animate-pulse" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-4 h-4 bg-white/20 rounded-full animate-ping"></div>
          <div className="absolute top-20 right-20 w-6 h-6 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-20 w-3 h-3 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-10 right-10 w-5 h-5 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div 
          className={`relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible['final-cta'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          data-animate
          id="final-cta"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in-up">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Join the thousands of professionals who have already elevated their careers 
            with our AI-powered CV generation platform.
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link
                to="/register"
                className="inline-flex items-center px-10 py-5 bg-white text-brand-dark font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
              >
                Start Your Success Story
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
              <Link
                to="/templates"
                className="inline-flex items-center px-10 py-5 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-brand-dark transition-all duration-300 transform hover:scale-105"
              >
                Explore Templates
                <FileText className="ml-3 h-6 w-6" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;