"use client"
import { Fade } from "react-awesome-reveal"
import Image from "next/image"
import { FaLightbulb, FaUsers, FaBoxOpen } from "react-icons/fa"

const AboutPage = () => {
  return (
    <div>
      <section className="py-12 md:py-20 bg-gray-100 relative overflow-hidden">
        <Fade triggerOnce direction="up" duration={800} cascade damping={0.2}>
          <header className="mb-8 md:mb-12 w-full max-w-[90%] md:max-w-[90%] lg:max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-6 md:mb-8 text-[#3321c8] text-center">
              About Half Attire
            </h1>
            <div className="w-full text-gray-800 leading-relaxed space-y-6 text-left">
              <p className="text-base md:text-lg">
                Half Attire was founded in 2025 with a simple yet powerful vision: to create stylish, high-quality
                clothing that makes people feel confident and comfortable. What began as a small online boutique has
                grown into a beloved fashion destination known for our commitment to quality, style, and customer
                satisfaction.
              </p>

              <p className="text-base md:text-lg">
                We believe that fashion should be accessible to everyone. Our collections are thoughtfully designed to
                offer versatile pieces that seamlessly blend into your wardrobe while making a statement. Each garment
                is crafted with attention to detail, using premium fabrics and ethical manufacturing processes.
              </p>

              <p className="text-base md:text-lg">
                At Half Attire, we're more than just a clothing store – we're a community of fashion enthusiasts who
                believe in the power of self-expression through style. Our team is dedicated to providing exceptional
                shopping experiences, from browsing our collections to unboxing your new favorite pieces. We're
                committed to sustainable practices and giving back to the communities we serve.
              </p>
            </div>
          </header>
        </Fade>
        <div
          className="absolute inset-0 z-[-1] bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('/assets/mission-bg.jpg')" }}
        ></div>
      </section>

      <section className="py-16 md:py-24 bg-[#101828]">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <Fade triggerOnce direction="up" cascade damping={0.3}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src={"/assets/whiteEnergy.png"}
                  alt="Bullet"
                  width={1000}
                  height={1000}
                  className="w-6 mb-6 object-contain"
                />
                <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
                <p className="text-lg text-white/90 leading-relaxed">
                  To inspire confidence and self-expression through thoughtfully designed, high-quality clothing that
                  combines style, comfort, and affordability. We strive to create a seamless shopping experience that
                  delights our customers at every touchpoint, from browsing our collections to wearing our garments.
                  Through sustainable practices and ethical manufacturing, we aim to make a positive impact on both our
                  customers' wardrobes and the world around us.
                </p>
              </div>
              <figure className="imageSHineEffect rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/assets/mission.jpg"
                  alt="Our Mission"
                  width={800}
                  height={600}
                  className="rounded-lg shadow-md object-cover w-full hover:scale-105 transition-transform duration-500"
                />
              </figure>
            </div>
          </Fade>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-100 relative">
        <Fade triggerOnce direction="up" cascade damping={0.3}>
          <div className="container mx-auto px-4 md:px-8 lg:px-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <figure className="imageSHineEffect rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/assets/about-2.jpg"
                  alt="Our Vision"
                  width={800}
                  height={600}
                  className="rounded-lg shadow-md object-cover w-full hover:scale-105 transition-transform duration-500"
                />
              </figure>
              <div>
                <Image
                  src={"/assets/energy.png"}
                  alt="Bullet"
                  width={1000}
                  height={1000}
                  className="w-11 mb-6 object-contain"
                />
                <h2 className="text-3xl font-bold text-[#3321c8] mb-6">Our Vision</h2>
                <p className="text-lg text-gray-800 leading-relaxed">
                  To be a leading global fashion brand known for creating timeless, versatile clothing that empowers
                  individuals to express their unique style. We envision a world where sustainable fashion is the
                  standard, not the exception, and where every customer feels valued and understood. By continuously
                  innovating our designs and improving our practices, we aim to set new benchmarks for quality,
                  sustainability, and customer experience in the fashion industry.
                </p>
              </div>
            </div>
          </div>
        </Fade>
      </section>

      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute -left-20 top-40 h-[400px] w-[400px] rounded-full bg-[#3321c8]/5 blur-3xl" />
          <div className="absolute -right-20 bottom-40 h-[300px] w-[300px] rounded-full bg-[#3321c8]/5 blur-3xl" />
        </div>

        <Fade triggerOnce direction="up" cascade damping={0.3}>
          <div className="container mx-auto px-4 md:px-8 lg:px-16 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3321c8] mb-10">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="text-center bg-gray-100 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-[#3321c8]/10">
                <div className="text-[#3321c8] text-5xl mb-6 flex justify-center">
                  <FaLightbulb />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#3321c8]">Quality & Design</h3>
                <p className="text-gray-800 leading-relaxed">
                  We create thoughtfully designed pieces using premium materials that stand the test of time in both
                  style and durability.
                </p>
              </div>
              <div className="text-center bg-gray-100 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-[#3321c8]/10">
                <div className="text-[#3321c8] text-5xl mb-6 flex justify-center">
                  <FaUsers />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#3321c8]">Customer First</h3>
                <p className="text-gray-800 leading-relaxed">
                  We prioritize exceptional customer experiences at every touchpoint, from browsing to unboxing and
                  beyond.
                </p>
              </div>
              <div className="text-center bg-gray-100 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-[#3321c8]/10">
                <div className="text-[#3321c8] text-5xl mb-6 flex justify-center">
                  <FaBoxOpen />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#3321c8]">Sustainability</h3>
                <p className="text-gray-800 leading-relaxed">
                  We're committed to ethical manufacturing, reducing our environmental footprint, and creating positive
                  change in the fashion industry.
                </p>
              </div>
            </div>
          </div>
        </Fade>
      </section>
    </div>
  )
}

export default AboutPage
