import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Globe,
  Shield,
  Zap,
  Check,
  X,
  Crown,
  Sparkles,
  Book,
  Code,
  Gamepad2,
  Palette,
  Download,
  Play,
  Package,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';

interface TabContentProps {
  activeTab: string;
}

const TabContent: React.FC<TabContentProps> = ({ activeTab }) => {
  const { settings, updateSettings, saveSettings, resetSettings } = useTheme();
  const { addToCart } = useCart();
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'shop') {
      fetchProducts();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('category', { ascending: true });

    if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-themed-primary mb-4 gradient-text">
                Welcome to My Website
              </h1>
              <p className="text-xl text-themed-secondary max-w-3xl mx-auto">
                Discover amazing features and services that will transform your
                experience. We're here to help you achieve your goals with
                cutting-edge solutions.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-themed-primary p-6 rounded-lg shadow-themed card-hover">
                <div className="w-12 h-12 bg-accent-secondary rounded-lg flex items-center justify-center mb-4 animate-float">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-themed-primary">
                  Fast Performance
                </h3>
                <p className="text-themed-secondary">
                  Lightning-fast loading times and optimized performance for the
                  best user experience.
                </p>
              </div>

              <div className="bg-themed-primary p-6 rounded-lg shadow-themed card-hover">
                <div className="w-12 h-12 bg-accent-secondary rounded-lg flex items-center justify-center mb-4 animate-float">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-themed-primary">
                  Secure & Reliable
                </h3>
                <p className="text-themed-secondary">
                  Top-notch security measures and reliable infrastructure you
                  can trust.
                </p>
              </div>

              <div className="bg-themed-primary p-6 rounded-lg shadow-themed card-hover">
                <div className="w-12 h-12 bg-accent-secondary rounded-lg flex items-center justify-center mb-4 animate-float">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-themed-primary">
                  Premium Quality
                </h3>
                <p className="text-themed-secondary">
                  High-quality solutions designed to exceed your expectations
                  every time.
                </p>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-themed-primary mb-4">
                About Me
              </h2>
              <p className="text-lg text-themed-secondary max-w-3xl mx-auto">
                We are a passionate team dedicated to creating exceptional
                digital experiences that make a difference in people's lives.
              </p>
            </div>

            <div className="bg-themed-primary rounded-lg shadow-themed p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-themed-primary">
                    Our Story
                  </h3>
                  <p className="text-themed-secondary mb-4">
                    Founded with a vision to bridge the gap between technology
                    and human needs, we've been at the forefront of innovation
                    for over a decade.
                  </p>
                  <p className="text-themed-secondary">
                     I combine creativity, technical expertise, and a
                    deep understanding of user experience to deliver solutions
                    that truly matter.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-accent-primary" />
                    <span className="text-themed-primary">
                      Not Really Any Years of Experience
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-accent-primary" />
                    <span className="text-themed-primary">
                      Just Started None Yet
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-accent-primary" />
                    <span className="text-themed-primary">
                      Trying To See Where This Goes
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-accent-primary" />
                    <span className="text-themed-primary">
                      24/7 Customer Support
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-themed-primary mb-4">
                Our Services
              </h2>
              <p className="text-lg text-themed-secondary max-w-3xl mx-auto">
                We offer a comprehensive range of services to help your business
                thrive in the digital world.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Web Development',
                  description:
                    'Custom websites and web applications built with modern technologies.',
                  price: 'Starting at $2,999',
                },
                {
                  title: 'Mobile Apps',
                  description:
                    'Native and cross-platform mobile applications for iOS and Android.',
                  price: 'Starting at $4,999',
                },
                {
                  title: 'UI/UX Design',
                  description:
                    'Beautiful, user-friendly designs that convert visitors into customers.',
                  price: 'Starting at $1,999',
                },
                {
                  title: 'E-commerce',
                  description:
                    'Complete online store solutions with payment processing and inventory management.',
                  price: 'Starting at $3,999',
                },
                {
                  title: 'Digital Marketing',
                  description:
                    'SEO, social media marketing, and online advertising campaigns.',
                  price: 'Starting at $999/month',
                },
                {
                  title: 'Consulting',
                  description:
                    'Strategic technology consulting to help you make informed decisions.',
                  price: 'Starting at $199/hour',
                },
              ].map((service, index) => (
                <div
                  key={index}
                  className="bg-themed-primary p-6 rounded-lg shadow-themed hover:shadow-themed-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-3 text-themed-primary">
                    {service.title}
                  </h3>
                  <p className="text-themed-secondary mb-4">
                    {service.description}
                  </p>
                  <div className="text-accent-primary font-semibold">
                    {service.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'pricing':
        const plans = [
          {
            name: 'Basic',
            icon: Star,
            description:
              'Perfect for beginners starting their game design journey',
            monthlyPrice: 9.99,
            yearlyPrice: 99.99,
            features: [
              'Access to basic tutorials',
              'Community forum access',
              'Email support',
              'Basic design templates',
              '5 project slots',
            ],
            limitations: [
              'No advanced tutorials',
              'Limited community features',
            ],
            popular: false,
            color: 'blue',
          },
          {
            name: 'Premium',
            icon: Crown,
            description: 'Most popular choice for serious game designers',
            monthlyPrice: 24.99,
            yearlyPrice: 249.99,
            features: [
              'All basic features',
              'Advanced tutorials & courses',
              'Priority support',
              'Premium design assets',
              'Unlimited projects',
              'Live workshops',
              'Code templates',
              'Asset marketplace access',
            ],
            limitations: [],
            popular: true,
            color: 'purple',
          },
          {
            name: 'Pro',
            icon: Sparkles,
            description: 'For professional game developers and studios',
            monthlyPrice: 49.99,
            yearlyPrice: 499.99,
            features: [
              'All premium features',
              '1-on-1 mentoring sessions',
              'Custom asset creation',
              'White-label solutions',
              'API access',
              'Advanced analytics',
              'Team collaboration tools',
              'Custom integrations',
              'Priority feature requests',
            ],
            limitations: [],
            popular: false,
            color: 'gold',
          },
        ];

        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-themed-primary mb-4">
                Choose Your Plan
              </h2>
              <p className="text-xl text-themed-secondary max-w-3xl mx-auto mb-8">
                Unlock your game design potential with our comprehensive plans
                designed for every skill level.
              </p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <span
                  className={`text-sm font-medium ${
                    billingCycle === 'monthly'
                      ? 'text-themed-primary'
                      : 'text-themed-secondary'
                  }`}
                >
                  Monthly
                </span>
                <button
                  onClick={() =>
                    setBillingCycle(
                      billingCycle === 'monthly' ? 'yearly' : 'monthly'
                    )
                  }
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-themed-tertiary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-accent-primary transition-transform ${
                      billingCycle === 'yearly'
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
                <span
                  className={`text-sm font-medium ${
                    billingCycle === 'yearly'
                      ? 'text-themed-primary'
                      : 'text-themed-secondary'
                  }`}
                >
                  Yearly
                </span>
                <span className="bg-accent-primary text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Save 17%
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => {
                const Icon = plan.icon;
                const price =
                  billingCycle === 'monthly'
                    ? plan.monthlyPrice
                    : plan.yearlyPrice;
                const period = billingCycle === 'monthly' ? 'month' : 'year';

                return (
                  <div
                    key={index}
                    className={`relative bg-themed-primary rounded-2xl shadow-themed card-hover animate-scale-in ${
                      plan.popular ? 'ring-2 ring-accent-primary scale-105' : ''
                    }`}
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-accent-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="p-8">
                      <div className="text-center mb-6">
                        <div
                          className={`w-16 h-16 mx-auto mb-4 rounded-full bg-accent-secondary flex items-center justify-center`}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-themed-primary mb-2">
                          {plan.name}
                        </h3>
                        <p className="text-themed-secondary text-sm">
                          {plan.description}
                        </p>
                      </div>

                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-themed-primary">
                          ${price}
                          <span className="text-lg font-normal text-themed-secondary">
                            /{period}
                          </span>
                        </div>
                        {billingCycle === 'yearly' && (
                          <div className="text-sm text-themed-secondary mt-1">
                            ${(plan.monthlyPrice * 12).toFixed(2)} billed
                            annually
                          </div>
                        )}
                      </div>

                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center space-x-3"
                          >
                            <Check className="w-5 h-5 text-accent-primary flex-shrink-0" />
                            <span className="text-themed-primary text-sm">
                              {feature}
                            </span>
                          </li>
                        ))}
                        {plan.limitations.map((limitation, limitIndex) => (
                          <li
                            key={limitIndex}
                            className="flex items-center space-x-3"
                          >
                            <X className="w-5 h-5 text-themed-tertiary flex-shrink-0" />
                            <span className="text-themed-secondary text-sm line-through">
                              {limitation}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <button
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                          plan.popular
                            ? 'bg-accent-primary text-white hover:bg-accent-hover'
                            : 'bg-themed-tertiary text-themed-primary hover:bg-themed-secondary'
                        }`}
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <p className="text-themed-secondary mb-4">
                All plans include a 14-day free trial • No credit card required
              </p>
              <div className="flex justify-center space-x-8 text-sm text-themed-secondary">
                <span>✓ Cancel anytime</span>
                <span>✓ 30-day money back guarantee</span>
                <span>✓ Free migration support</span>
              </div>
            </div>
          </div>
        );

      case 'shop':
        const iconMap: Record<string, any> = {
          Book, Palette, Play, Gamepad2, Code, Shield, Package
        };

        const groupedProducts = products.reduce((acc: any, product) => {
          if (!acc[product.category]) {
            acc[product.category] = [];
          }
          acc[product.category].push(product);
          return acc;
        }, {});

        const oldProducts = [
          {
            category: 'Digital Flipbooks',
            items: [
              {
                title: 'Game Design Fundamentals Flipbook',
                description:
                  'Interactive digital flipbook covering core game design principles, mechanics, and player psychology.',
                price: 29.99,
                icon: Book,
                features: [
                  '150+ pages',
                  'Interactive elements',
                  'Video examples',
                  'Downloadable resources',
                ],
              },
              {
                id: 'character-design-flipbook',
                title: 'Character Design Masterclass Flipbook',
                description:
                  'Complete guide to creating memorable game characters with step-by-step tutorials.',
                price: 34.99,
                icon: Palette,
                features: [
                  '200+ pages',
                  'Character templates',
                  'Art techniques',
                  'Industry insights',
                ],
              },
            ],
          },
          {
            category: 'Video Tutorials',
            items: [
              {
                id: 'unity-course',
                title: 'Unity Game Development Course',
                description:
                  'Complete Unity course from beginner to advanced, build 5 complete games.',
                price: 89.99,
                icon: Play,
                features: [
                  '40+ hours video',
                  '5 complete projects',
                  'Source code included',
                  'Lifetime access',
                ],
              },
              {
                id: 'unreal-course',
                title: 'Unreal Engine 5 Masterclass',
                description:
                  'Master UE5 with hands-on projects including Lumen, Nanite, and Blueprint scripting.',
                price: 99.99,
                icon: Gamepad2,
                features: [
                  '50+ hours video',
                  'UE5 latest features',
                  'Blueprint & C++',
                  'Portfolio projects',
                ],
              },
            ],
          },
          {
            category: 'Programming Software',
            items: [
              {
                id: 'code-generator',
                title: 'GameDev Code Generator Pro',
                description:
                  'AI-powered code generation tool for common game development patterns and systems.',
                price: 149.99,
                icon: Code,
                features: [
                  'AI code generation',
                  'Multiple languages',
                  'Pattern library',
                  '1-year updates',
                ],
              },
              {
                id: 'level-design-toolkit',
                title: 'Level Design Toolkit',
                description:
                  'Professional level design software with procedural generation and testing tools.',
                price: 199.99,
                icon: Shield,
                features: [
                  'Procedural generation',
                  'Playtesting tools',
                  'Export to engines',
                  'Team collaboration',
                ],
              },
            ],
          },
        ];

        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-themed-primary mb-4">
                Game Design Shop
              </h2>
              <p className="text-xl text-themed-secondary max-w-3xl mx-auto">
                Premium resources, tutorials, and tools to accelerate your game
                development journey.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
                <p className="text-themed-secondary mt-4">Loading products...</p>
              </div>
            ) : (
            Object.keys(groupedProducts).map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-6">
                <div className="flex items-center space-x-3">
                  <h3 className="text-2xl font-bold text-themed-primary">
                    {category}
                  </h3>
                  <div className="flex-1 h-px bg-themed-tertiary"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {groupedProducts[category].map((item: any, itemIndex: number) => {
                    const Icon = iconMap[item.icon_name] || Package;
                    const features = typeof item.features === 'string' ? JSON.parse(item.features) : item.features;

                    const handleAddToCart = () => {
                      addToCart({
                        id: item.id,
                        title: item.title,
                        price: item.price,
                        category: item.category,
                        icon: item.icon_name,
                        inventoryId: item.inventory_id,
                      });
                    };

                    return (
                      <div
                        key={itemIndex}
                        className="bg-themed-primary rounded-xl shadow-themed card-hover animate-fade-in overflow-hidden"
                        style={{animationDelay: `${itemIndex * 0.1}s`}}
                      >
                        <div className="p-6">
                          <div className="flex items-start space-x-4 mb-4">
                            <div className="w-12 h-12 bg-accent-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-themed-primary mb-2">
                                {item.title}
                              </h4>
                              <p className="text-themed-secondary text-sm">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-6">
                            {features.map((feature: string, featureIndex: number) => (
                              <div
                                key={featureIndex}
                                className="flex items-center space-x-2"
                              >
                                <Check className="w-4 h-4 text-accent-primary" />
                                <span className="text-themed-secondary text-sm">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-2xl font-bold text-themed-primary">
                                ${item.price}
                              </div>
                              <div className="text-xs text-themed-secondary mt-1">
                                Stock: {item.stock_quantity} | ID: {item.inventory_id}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button className="bg-themed-tertiary text-themed-primary px-4 py-2 rounded-lg hover:bg-themed-secondary transition-colors text-sm">
                                Preview
                              </button>
                              <button
                                onClick={handleAddToCart}
                                disabled={item.stock_quantity === 0}
                                className="bg-accent-primary text-white px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors text-sm flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Download className="w-4 h-4" />
                                <span>{item.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
            )}

            {!loading && products.length > 0 && (
            <div className="bg-accent-primary rounded-xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-4">
                Bundle Deal - Save 40%!
              </h3>
              <p className="text-lg mb-6">
                Get all digital products for one low price. Perfect for serious
                game developers.
              </p>
              <div className="flex items-center justify-center space-x-4 mb-6">
                <span className="text-3xl font-bold line-through opacity-75">
                  $634.94
                </span>
                <span className="text-4xl font-bold">$379.99</span>
              </div>
              <button className="bg-white text-accent-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Get Complete Bundle
              </button>
            </div>
            )}
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-themed-primary mb-4">
                Get In Touch
              </h2>
              <p className="text-lg text-themed-secondary max-w-3xl mx-auto">
                Ready to start your project? We'd love to hear from you. Contact
                us today for a free consultation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-themed-primary p-6 rounded-lg shadow-themed">
                <h3 className="text-xl font-semibold mb-4 text-themed-primary">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-accent-primary" />
                    <span className="text-themed-primary">
                      +1 (757) 343-1936
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-accent-primary" />
                    <span className="text-themed-primary">
                      caidenknorr4@outlook.com
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-accent-primary" />
                    <span className="text-themed-primary">
                      Virginia Beach, Virginia 23464
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-accent-primary" />
                    <span className="text-themed-primary">https://gmedesignweb1-xkt0.bolt.host/</span>
                  </div>
                </div>
              </div>

              <div className="bg-themed-primary p-6 rounded-lg shadow-themed">
                <h3 className="text-xl font-semibold mb-4 text-themed-primary">
                  Send us a Message
                </h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-themed-primary mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-themed bg-themed-secondary text-themed-primary rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-themed-primary mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-themed bg-themed-secondary text-themed-primary rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-themed-primary mb-1">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-themed bg-themed-secondary text-themed-primary rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                      placeholder="Tell us about your project..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-accent-primary text-white py-2 px-4 rounded-md hover:bg-accent-hover transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        );

      case 'settings':
        const themes = [
          { name: 'light', label: 'Light', colors: ['#ffffff', '#3b82f6', '#f9fafb'] },
          { name: 'dark', label: 'Dark', colors: ['#0f172a', '#06b6d4', '#1e293b'] },
          { name: 'ocean', label: 'Ocean', colors: ['#e0f2fe', '#0284c7', '#bae6fd'] },
          { name: 'sunset', label: 'Sunset', colors: ['#fff7ed', '#ea580c', '#ffedd5'] },
          { name: 'forest', label: 'Forest', colors: ['#f0fdf4', '#16a34a', '#dcfce7'] },
          { name: 'royal', label: 'Royal', colors: ['#faf5ff', '#9333ea', '#f3e8ff'] },
          { name: 'cyber', label: 'Cyber', colors: ['#0a0e27', '#ff00ff', '#141b3d'] },
          { name: 'lavender', label: 'Lavender', colors: ['#faf5ff', '#7c3aed', '#f3e8ff'] },
          { name: 'autumn', label: 'Autumn', colors: ['#fef3c7', '#d97706', '#fde68a'] },
          { name: 'midnight', label: 'Midnight', colors: ['#0c1222', '#6366f1', '#151d33'] }
        ];

        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-themed-primary mb-4">
                Settings
              </h2>
              <p className="text-lg text-themed-secondary max-w-3xl mx-auto">
                Customize your experience and manage your preferences.
              </p>
            </div>

            <div className="bg-themed-primary rounded-lg shadow-themed p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-themed-primary">
                    Choose Your Theme
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {themes.map((theme) => (
                      <button
                        key={theme.name}
                        onClick={() => updateSettings({ theme: theme.name as any })}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-300 card-hover ${
                          settings.theme === theme.name
                            ? 'border-accent-primary shadow-themed-lg scale-105'
                            : 'border-themed hover:border-accent-secondary'
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div className="flex space-x-1">
                            {theme.colors.map((color, idx) => (
                              <div
                                key={idx}
                                className="w-8 h-8 rounded-lg shadow-sm"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <span className={`text-sm font-medium ${
                            settings.theme === theme.name ? 'text-accent-primary' : 'text-themed-primary'
                          }`}>
                            {theme.label}
                          </span>
                          {settings.theme === theme.name && (
                            <CheckCircle className="w-5 h-5 text-accent-primary absolute top-2 right-2 animate-scale-in" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-themed-primary">
                    Notifications
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-3 text-accent-primary"
                        checked={settings.emailNotifications}
                        onChange={(e) =>
                          updateSettings({
                            emailNotifications: e.target.checked,
                          })
                        }
                      />
                      <span className="text-themed-primary">
                        Email notifications
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-3 text-accent-primary"
                        checked={settings.pushNotifications}
                        onChange={(e) =>
                          updateSettings({
                            pushNotifications: e.target.checked,
                          })
                        }
                      />
                      <span className="text-themed-primary">
                        Push notifications
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-3 text-accent-primary"
                        checked={settings.smsNotifications}
                        onChange={(e) =>
                          updateSettings({ smsNotifications: e.target.checked })
                        }
                      />
                      <span className="text-themed-primary">
                        SMS notifications
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-themed-primary">
                    Privacy
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-3 text-accent-primary"
                        checked={settings.allowAnalytics}
                        onChange={(e) =>
                          updateSettings({ allowAnalytics: e.target.checked })
                        }
                      />
                      <span className="text-themed-primary">
                        Allow analytics
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-3 text-accent-primary"
                        checked={settings.shareUsageData}
                        onChange={(e) =>
                          updateSettings({ shareUsageData: e.target.checked })
                        }
                      />
                      <span className="text-themed-primary">
                        Share usage data
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={saveSettings}
                    className="bg-accent-primary text-white px-6 py-2 rounded-md hover:bg-accent-hover transition-colors mr-3"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={resetSettings}
                    className="bg-themed-tertiary text-themed-primary px-6 py-2 rounded-md hover:bg-themed-secondary transition-colors"
                  >
                    Reset to Defaults
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Tab not found</div>;
    }
  };

  return <div className="max-w-7xl mx-auto px-4 py-8">{renderContent()}</div>;
};

export default TabContent;
