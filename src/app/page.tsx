import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Image
                src="/logo.avif"
                alt="AedxCorp Logo"
                width={50}
                height={50}
                className="mr-3"
              />
              <h1 className="text-2xl font-bold text-text-primary">AedxCorp</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#about" className="text-text-secondary hover:text-brand-primary">About</a>
              <a href="#services" className="text-text-secondary hover:text-brand-primary">Services</a>
              <a href="#projects" className="text-text-secondary hover:text-brand-primary">Projects</a>
              <a href="#contact" className="text-text-secondary hover:text-brand-primary">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to AedxCorp
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Innovative solutions for modern businesses. Discover what we do and how we can help you succeed.
          </p>
          <a
            href="#contact"
            className="bg-white text-brand-primary px-8 py-3 rounded-lg font-semibold hover:bg-neutral-light transition-colors"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-text-primary mb-4">About Us</h3>
            <p className="text-text-secondary max-w-2xl mx-auto">
              AedxCorp is dedicated to delivering cutting-edge technology solutions that drive business growth and innovation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-2xl font-semibold text-text-primary mb-4">Our Mission</h4>
              <p className="text-text-secondary mb-6">
                To empower businesses with modern, scalable, and efficient technology solutions that adapt to the ever-changing digital landscape.
              </p>
              <h4 className="text-2xl font-semibold text-text-primary mb-4">Our Vision</h4>
              <p className="text-text-secondary">
                To be the leading provider of innovative tech solutions, helping companies thrive in the digital age.
              </p>
            </div>
            <div className="text-center">
              <Image
                src="/logo.avif"
                alt="AedxCorp"
                width={200}
                height={200}
                className="mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-neutral-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-text-primary mb-4">What We Do</h3>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Comprehensive technology services tailored to meet your business needs.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-brand-primary rounded-lg mb-4"></div>
              <h4 className="text-xl font-semibold text-text-primary mb-2">Web Development</h4>
              <p className="text-text-secondary">
                Modern, responsive websites built with the latest technologies.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-brand-secondary rounded-lg mb-4"></div>
              <h4 className="text-xl font-semibold text-text-primary mb-2">Cloud Solutions</h4>
              <p className="text-text-secondary">
                Scalable cloud infrastructure and deployment solutions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-status-success rounded-lg mb-4"></div>
              <h4 className="text-xl font-semibold text-text-primary mb-2">Consulting</h4>
              <p className="text-text-secondary">
                Expert advice and strategic planning for your tech initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-text-primary mb-4">Recent Projects</h3>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Showcasing our latest work and achievements.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-neutral-light p-6 rounded-lg">
              <div className="h-48 bg-brand-primary rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white font-semibold">Project 1</span>
              </div>
              <h4 className="text-xl font-semibold text-text-primary mb-2">E-commerce Platform</h4>
              <p className="text-text-secondary">
                A modern online store with advanced features and seamless user experience.
              </p>
            </div>
            <div className="bg-neutral-light p-6 rounded-lg">
              <div className="h-48 bg-brand-secondary rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white font-semibold">Project 2</span>
              </div>
              <h4 className="text-xl font-semibold text-text-primary mb-2">Mobile App</h4>
              <p className="text-text-secondary">
                Cross-platform mobile application for enhanced productivity.
              </p>
            </div>
            <div className="bg-neutral-light p-6 rounded-lg">
              <div className="h-48 bg-neutral-dark rounded-lg mb-4 flex items-center justify-center">
                <span className="text-neutral-light font-semibold">Project 3</span>
              </div>
              <h4 className="text-xl font-semibold text-text-primary mb-2">Cloud Migration</h4>
              <p className="text-text-secondary">
                Successful migration of legacy systems to modern cloud infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-neutral-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">Get In Touch</h3>
          <p className="text-neutral-light mb-8 max-w-2xl mx-auto">
            Ready to start your next project? Let's discuss how we can help bring your ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contact@aedxcorp.com"
              className="bg-brand-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-secondary transition-colors"
            >
              Email Us
            </a>
            <a
              href="tel:+1234567890"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-neutral-dark transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-dark text-neutral-light py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/logo.avif"
              alt="AedxCorp Logo"
              width={30}
              height={30}
              className="mr-2"
            />
            <span className="font-semibold">AedxCorp</span>
          </div>
          <p className="mb-4">&copy; 2025 AedxCorp. All rights reserved.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm">
            <Link href="/privacy" className="hover:text-white underline-offset-4 hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white underline-offset-4 hover:underline">Terms &amp; Conditions</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
