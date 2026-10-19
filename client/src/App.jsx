
import { useEffect, useState } from "react";
import {
  Truck, ShieldCheck, Clock3, ArrowRight, Menu, X,
  MapPin, Phone, Mail, PackageCheck, Send,
  ChevronLeft, ChevronRight
} from "lucide-react";
import "./App.css";

const truckPhotos = [
  {
    src: "photo2.jpeg",
    title: "Your Cargo.",
    highlight: "Our Responsibility.",
    subtitle: "Safe • Reliable • On Time",
    description: "Professional trailer transportation solutions for your business."
  },
  {
    src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1800&q=85",
    title: "Moving Business",
    highlight: "Forward.",
    subtitle: "Reliable Cargo Transportation",
    description: "Transport solutions designed around your cargo and delivery requirements."
  },
  {
    src: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1800&q=85",
    title: "Every Shipment",
    highlight: "Matters.",
    subtitle: "Your Trusted Transport Partner",
    description: "Tell us your pickup and destination details to plan your next shipment."
  }
];

const services = [
  {
    icon: <Truck />,
    title: "Full Truck Load",
    description: "Dedicated truck transportation for your cargo requirements."
  },
  {
    icon: <PackageCheck />,
    title: "Part Load Transport",
    description: "Discuss suitable transport arrangements for smaller consignments."
  },
  {
    icon: <MapPin />,
    title: "Long Route Transport",
    description: "Plan cargo movement between pickup and destination locations."
  },
  {
    icon: <ShieldCheck />,
    title: "Industrial Goods",
    description: "Transportation solutions for industrial and business cargo."
  },
  {
    icon: <Truck />,
    title: "Commercial Cargo",
    description: "Transport support for a range of commercial goods."
  },
  {
    icon: <Send />,
    title: "Custom Requirements",
    description: "Contact our team to discuss your specific transport needs."
  }
];

// Verify the phone number before publishing the website.
const PHONE_NUMBER = "9227007774,7046807002";
const PHONE_DISPLAY = "+91 92270 07774,7046807002";

export default function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Full Truck Load",
    pickup: "",
    destination: "",
    message: ""
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(current => (current + 1) % truckPhotos.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  function updateForm(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  async function submitEnquiry(event) {
    event.preventDefault();
    setSending(true);
    setStatus("");

    try {
      const response = await fetch("http://localhost:5000/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Enquiry could not be submitted.");
      }

      setStatus("Thank you! Your enquiry has been submitted successfully.");

      setForm({
        name: "",
        email: "",
        phone: "",
        service: "Full Truck Load",
        pickup: "",
        destination: "",
        message: ""
      });
    } catch (error) {
      setStatus(
        error.message ||
        "Enquiry submit nahi hui. Backend aur MongoDB connection check karein."
      );
    } finally {
      setSending(false);
    }
  }

  function previousSlide() {
    setActiveSlide(current =>
      (current - 1 + truckPhotos.length) % truckPhotos.length
    );
  }

  function nextSlide() {
    setActiveSlide(current => (current + 1) % truckPhotos.length);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="website">

      {/* TOP CONTACT BAR */}
      <div className="topbar">
        <div className="container topbar-inner">
          <a href={`tel:${PHONE_NUMBER}`}>
            <Phone size={15} /> {PHONE_DISPLAY}
          </a>
          <a href="#contact">
            <Mail size={15} /> Send an enquiry
          </a>
          <span>
            <MapPin size={15} /> Gandhidham, Gujarat
          </span>
        </div>
      </div>

      {/* HEADER AND RTS LOGO */}
      <header className="header">
        <div className="container nav-inner">

          <a className="brand" href="#home" onClick={closeMenu}>
            <div className="brand-logo">
              <Truck size={29} />
              <strong>RTS</strong>
            </div>

            <div className="brand-text">
              <strong>RUDRA</strong>
              <span>TRAILOR SERVICE</span>
              <small>SAFE · SECURE · ON TIME</small>
            </div>
          </a>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <nav className={menuOpen ? "nav-links open" : "nav-links"}>
            <a href="#home" onClick={closeMenu}>Home</a>
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#services" onClick={closeMenu}>Services</a>
            <a href="#fleet" onClick={closeMenu}>Our Fleet</a>
            <a href="#contact" onClick={closeMenu}>Contact</a>
            <a className="nav-button" href="#contact" onClick={closeMenu}>
              Get a Quote <ArrowRight size={16} />
            </a>
          </nav>

        </div>
      </header>

      <main>

        {/* AUTOMATIC TRUCK PHOTO SLIDER */}
        <section className="hero" id="home">

          {truckPhotos.map((photo, index) => (
            <img
              key={photo.src}
              src={photo.src}
              alt={`Rudra Trailor Service truck ${index + 1}`}
              className={`hero-photo ${activeSlide === index ? "active" : ""}`}
            />
          ))}

          <div className="hero-overlay"></div>

          <div className="container hero-content">
            <div className="hero-text" key={activeSlide}>

              <span className="eyebrow">
                YOUR TRUSTED TRANSPORT PARTNER
              </span>

              <h1>
                {truckPhotos[activeSlide].title}
                <br />
                <span>{truckPhotos[activeSlide].highlight}</span>
              </h1>

              <h3>{truckPhotos[activeSlide].subtitle}</h3>

              <p>{truckPhotos[activeSlide].description}</p>

              <div className="hero-buttons">
                <a href="#services" className="btn btn-primary">
                  Explore Services <ArrowRight size={18} />
                </a>

                <a href="#contact" className="btn btn-outline">
                  Contact Us
                </a>
              </div>

              <div className="hero-note">
                <ShieldCheck size={20} />
                Dependable transportation for your business.
              </div>
            </div>

            <div className="slider-controls">
              <button onClick={previousSlide} aria-label="Previous photo">
                <ChevronLeft />
              </button>

              <div className="slider-dots">
                {truckPhotos.map((photo, index) => (
                  <button
                    key={photo.src}
                    className={activeSlide === index ? "dot active" : "dot"}
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Show truck photo ${index + 1}`}
                  />
                ))}
              </div>

              <button onClick={nextSlide} aria-label="Next photo">
                <ChevronRight />
              </button>

              <span className="slide-count">
                0{activeSlide + 1} / 0{truckPhotos.length}
              </span>
            </div>

            <div className="hero-label">
              <Truck size={28} />
              <div>
                <strong>Rudra Trailor Service</strong>
                <span>Moving business forward</span>
              </div>
            </div>
          </div>

          <a className="scroll-cue" href="#services">
            SCROLL TO EXPLORE ↓
          </a>
        </section>

        {/* HIGHLIGHTS */}
        <section className="benefits">
          <div className="container benefits-grid">
            <div className="benefit">
              <ShieldCheck />
              <div>
                <strong>Safe Transport</strong>
                <span>Care for every shipment</span>
              </div>
            </div>

            <div className="benefit">
              <Clock3 />
              <div>
                <strong>Timely Service</strong>
                <span>We value your time</span>
              </div>
            </div>

            <div className="benefit">
              <Truck />
              <div>
                <strong>Trailer Solutions</strong>
                <span>For your cargo needs</span>
              </div>
            </div>

            <div className="benefit">
              <PackageCheck />
              <div>
                <strong>Customer Focus</strong>
                <span>Professional support</span>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="section" id="about">
          <div className="container about-grid">

            <div className="about-image-wrap">
              <img src="photo.jpeg"
              
              />

              <div className="image-caption">
                <Truck size={27} />
                <div>
                  <strong>Moving Your Business</strong>
                  <span>One journey at a time</span>
                </div>
              </div>
            </div>

            <div className="about-copy">
              <span className="section-label">ABOUT OUR COMPANY</span>

              <h2>
                Transport you can <span>count on.</span>
              </h2>

              <p>
                Rudra Trailor Service focuses on dependable transportation
                solutions for businesses and cargo owners.
              </p>

              <p>
                We understand the importance of careful handling, clear
                communication and professional service. Tell us your
                transportation requirements and let us discuss the right
                solution for your cargo.
              </p>

              <a className="text-link" href="#contact">
                Discuss Your Requirement <ArrowRight size={18} />
              </a>
            </div>

          </div>
        </section>

        {/* SERVICES */}
        <section className="section services-section" id="services">
          <div className="container">

            <div className="section-heading">
              <span className="section-label">WHAT WE DO</span>
              <h2>Transportation <span>Solutions</span></h2>
              <p>Transport support designed around your requirements.</p>
            </div>

            <div className="services-grid">
              {services.map(service => (
                <article className="service-card" key={service.title}>
                  <div className="service-icon">{service.icon}</div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <a href="#contact">
                    Enquire Now <ArrowRight size={16} />
                  </a>
                </article>
              ))}
            </div>

          </div>
        </section>

        {/* LARGE TRUCK PHOTO BANNER */}
        <section className="fleet-section" id="fleet">
          <img
            src="/rudra-truck.jpg"
            alt="Truck and container trailer at a cargo yard"
            loading="lazy"
          />
          <div className="fleet-overlay"></div>

          <div className="container fleet-content">
            <span className="section-label">BUILT AROUND YOUR CARGO</span>
            <h2>Every shipment matters.</h2>
            <p>
              Share your pickup location, destination and cargo requirements
              to discuss a suitable transportation arrangement.
            </p>
            <a href="#contact" className="btn btn-primary">
              Request a Quote <ArrowRight size={18} />
            </a>
          </div>
        </section>

        {/* CONTACT AND ENQUIRY FORM */}
        <section className="section contact-section" id="contact">
          <div className="container contact-grid">

            <div className="contact-copy">
              <span className="section-label">LET'S CONNECT</span>
              <h2>Plan your next <span>shipment.</span></h2>
              <p>
                Share your pickup and destination details. Send us an enquiry
                about your transportation needs.
              </p>

              <div className="contact-detail">
                <div className="detail-icon"><MapPin /></div>
                <div>
                  <strong>Our Location</strong>
                  <p>
                    Office No. 266/A, 2nd Floor, Panchratna Market,
                    N.H. 8/A, Padana, Gandhidham, Gujarat.
                  </p>
                </div>
              </div>

              <div className="contact-detail">
                <div className="detail-icon"><Phone /></div>
                <div>
                  <strong>Call Us</strong>
                  <p>
                    <a className="phone-link" href={`tel:${PHONE_NUMBER}`}>
                      {PHONE_DISPLAY}
                    </a>
                  </p>
                </div>
              </div>

              <div className="contact-detail">
                <div className="detail-icon"><Mail /></div>
                <div>
                  <strong>Transport Enquiries</strong>
                  <p>Complete the form and share your requirements.</p>
                </div>
              </div>
            </div>

            <form className="contact-form" onSubmit={submitEnquiry}>
              <h3>Request a Transport Quote</h3>
              <p className="form-intro">Fields marked * are required.</p>

              <div className="form-row">
                <label>
                  Full Name *
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateForm}
                    placeholder="Your name"
                    required
                  />
                </label>

                <label>
                  Phone Number *
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={updateForm}
                    placeholder="Your phone number"
                    required
                  />
                </label>
              </div>

              <label>
                Email Address *
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateForm}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label>
                Required Service *
                <select
                  name="service"
                  value={form.service}
                  onChange={updateForm}
                  required
                >
                  <option>Full Truck Load</option>
                  <option>Part Load Transport</option>
                  <option>Long Route Transport</option>
                  <option>Industrial Goods</option>
                  <option>Commercial Cargo</option>
                  <option>Custom Requirements</option>
                </select>
              </label>

              <div className="form-row">
                <label>
                  Pickup Location *
                  <input
                    name="pickup"
                    value={form.pickup}
                    onChange={updateForm}
                    placeholder="Pickup city"
                    required
                  />
                </label>

                <label>
                  Destination *
                  <input
                    name="destination"
                    value={form.destination}
                    onChange={updateForm}
                    placeholder="Destination city"
                    required
                  />
                </label>
              </div>

              <label>
                Additional Details
                <textarea
                  name="message"
                  value={form.message}
                  onChange={updateForm}
                  rows="4"
                  placeholder="Cargo details or other requirements"
                />
              </label>

              {status && (
                <div className="form-message" role="status">
                  {status}
                </div>
              )}

              <button className="btn btn-primary submit-btn" disabled={sending}>
                {sending ? "Submitting..." : "Submit Enquiry"}
                <ArrowRight size={18} />
              </button>

              <small className="form-footnote">
                Enquiries are saved when the backend and MongoDB connection
                are working correctly.
              </small>
            </form>

          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-inner">

          <a className="brand footer-brand" href="#home">
            <div className="brand-logo">
              <Truck size={29} />
              <strong>RTS</strong>
            </div>
            <div className="brand-text">
              <strong>RUDRA</strong>
              <span>TRAILOR SERVICE</span>
              <small>SAFE · SECURE · ON TIME</small>
            </div>
          </a>

          <p>Dependable transport. Professional service.</p>

          <a className="footer-phone" href={`tel:${PHONE_NUMBER}`}>
            <Phone size={16} /> {PHONE_DISPLAY}
          </a>

          <a href="#home" className="back-top">Back to top ↑</a>
        </div>

        <div className="copyright">
          © {new Date().getFullYear()} Rudra Trailor Service. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
