import Image from "next/image";

export interface TestimonialsProps {
  title?: string;
  testimonials?: Array<{
    name: string;
    role?: string;
    content: string;
    avatar?: string;
  }>;
}

export function Testimonials({ title = "What Our Customers Say", testimonials = [
  { name: "John Doe", role: "CEO", content: "This product is amazing!" },
  { name: "Jane Smith", role: "CTO", content: "Changed our workflow completely." },
  { name: "Bob Johnson", role: "Developer", content: "Best investment we made." },
] }: TestimonialsProps) {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6 rounded-lg bg-gray-50">
              <div className="flex items-center mb-4">
                {testimonial.avatar ? (
                  <Image 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  {testimonial.role && (
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  )}
                </div>
              </div>
              <p className="text-gray-700 italic">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
