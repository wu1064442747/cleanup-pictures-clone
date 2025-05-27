import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-lg font-semibold text-gray-900">
                cleanup.pictures
              </div>
              <Badge variant="secondary" className="ml-2 bg-[#bdf60b] text-black hover:bg-[#bdf60b]/90">
                by Clipdrop
              </Badge>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="https://clipdrop.co" className="text-gray-900 hover:text-gray-700">Other tools</a>
              <a href="#usecases" className="text-gray-900 hover:text-gray-700">Use cases</a>
              <a href="#pricing" className="text-gray-900 hover:text-gray-700">Pricing</a>
              <a href="#faq" className="text-gray-900 hover:text-gray-700">FAQ</a>
              <a href="#api" className="text-gray-900 hover:text-gray-700">API</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Remove any unwanted <br />
              <span className="bg-[#bdf60b] px-2 py-1 rounded">object</span>, defect, people or <br />
              <span className="bg-[#bdf60b] px-2 py-1 rounded">text</span> from your pictures in <br />
              seconds
            </h1>

            {/* File Upload Area */}
            <div className="mt-12 max-w-2xl mx-auto">
              <Card className="border-2 border-dashed border-gray-300 hover:border-[#bdf60b] transition-colors">
                <div className="p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg text-gray-600 mb-2">Click here or drag an image file</p>
                  <p className="text-sm text-gray-500 mb-4">Tap here to load your picture</p>
                  <Button className="bg-[#bdf60b] hover:bg-[#bdf60b]/90 text-black">
                    Choose File
                  </Button>
                </div>
              </Card>

              {/* Example Images */}
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-4">Try with an example</p>
                <div className="flex justify-center space-x-4">
                  <img
                    src="https://ext.same-assets.com/303058917/3718851338.jpeg"
                    alt="table example"
                    className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:ring-2 hover:ring-[#bdf60b]"
                  />
                  <img
                    src="https://ext.same-assets.com/303058917/2814348788.jpeg"
                    alt="jacket example"
                    className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:ring-2 hover:ring-[#bdf60b]"
                  />
                  <img
                    src="https://ext.same-assets.com/303058917/1247788992.jpeg"
                    alt="bag example"
                    className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:ring-2 hover:ring-[#bdf60b]"
                  />
                  <img
                    src="https://ext.same-assets.com/303058917/2203028963.jpeg"
                    alt="paris example"
                    className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:ring-2 hover:ring-[#bdf60b]"
                  />
                  <img
                    src="https://ext.same-assets.com/303058917/3695643734.jpeg"
                    alt="shoe example"
                    className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:ring-2 hover:ring-[#bdf60b]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Retouch Section */}
      <section className="bg-[#bdf60b] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Retouch images in seconds<br />
              with <span className="underline">incredible quality</span>
            </h2>
            <p className="text-lg text-black/80 mb-8">
              Drag & drop an image above to get started for free
            </p>

            {/* Before/After Image */}
            <div className="max-w-4xl mx-auto">
              <img
                src="https://ext.same-assets.com/303058917/1421482652.jpeg"
                alt="Before and after cleanup example"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="usecases" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Use cases</h2>

            {/* Category Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <Badge className="bg-black text-white hover:bg-gray-800">Photographers</Badge>
              <Badge className="bg-[#bdf60b] text-black hover:bg-[#bdf60b]/90">Creative Agencies</Badge>
              <Badge className="bg-gray-600 text-white hover:bg-gray-700">Real Estate</Badge>
              <Badge className="bg-gray-600 text-white hover:bg-gray-700">E-commerce</Badge>
              <Badge className="bg-gray-600 text-white hover:bg-gray-700">Remove text, logo or watermark</Badge>
              <Badge className="bg-gray-600 text-white hover:bg-gray-700">Developers API</Badge>
            </div>
          </div>

          {/* Use Case Examples */}
          <div className="space-y-16">
            {/* Photographers */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex space-x-4">
                <img
                  src="https://ext.same-assets.com/303058917/4188543113.jpeg"
                  alt="Before photo cleanup"
                  className="flex-1 rounded-lg"
                />
                <img
                  src="https://ext.same-assets.com/303058917/1105933852.jpeg"
                  alt="After photo cleanup"
                  className="flex-1 rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Photographers</h3>
                <p className="text-gray-600 mb-4">
                  Photographers use Cleanup.pictures to remove time stamps or remove tourists from holiday pictures before printing them for their customers. They clean portrait photos to create the perfect profile pictures.
                </p>
                <p className="text-gray-600">
                  Cleanup.pictures is the perfect app to remove cracks on photographs. You can clean any images, removing any unwanted things. It is a must-have for professional studios.
                </p>
              </div>
            </div>

            {/* Creative Agencies */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Creative Agencies</h3>
                <p className="text-gray-600 mb-4">
                  Creatives use Cleanup's technology to quickly create stunning visuals. You can easily remix any existing photo to replace parts with your own.
                </p>
                <p className="text-gray-600">
                  Stay in the creative flow by using tools that are not on your way.
                </p>
              </div>
              <div className="order-1 md:order-2 flex space-x-4">
                <img
                  src="https://ext.same-assets.com/303058917/20747508.jpeg"
                  alt="Before agency cleanup"
                  className="flex-1 rounded-lg"
                />
                <img
                  src="https://ext.same-assets.com/303058917/318439831.jpeg"
                  alt="After agency cleanup"
                  className="flex-1 rounded-lg"
                />
              </div>
            </div>

            {/* Real Estate */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex space-x-4">
                <img
                  src="https://ext.same-assets.com/303058917/3764727283.jpeg"
                  alt="Before real estate cleanup"
                  className="flex-1 rounded-lg"
                />
                <img
                  src="https://ext.same-assets.com/303058917/1366979681.jpeg"
                  alt="After real estate cleanup"
                  className="flex-1 rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Real Estate</h3>
                <p className="text-gray-600 mb-4">
                  Real Estate agents use CleanUp.pictures to remove unwanted objects from pictures. Cleanup.pictures technology allows you to depersonalize and clean your photos of any room, flat, house, or apartment.
                </p>
              </div>
            </div>

            {/* E-commerce */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">E-commerce</h3>
                <p className="text-gray-600 mb-4">
                  Make your online store shine. Simply upload photographs or your products directly on the plateform and create stunning product images. You can create the ideal product shot and quickly update your social media, with stunning visual for your instagram stories.
                </p>
              </div>
              <div className="order-1 md:order-2 flex space-x-4">
                <img
                  src="https://ext.same-assets.com/303058917/1936897166.jpeg"
                  alt="Before ecommerce cleanup"
                  className="flex-1 rounded-lg"
                />
                <img
                  src="https://ext.same-assets.com/303058917/3253889435.jpeg"
                  alt="After ecommerce cleanup"
                  className="flex-1 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Green Highlighted Section */}
          <div className="mt-16 bg-[#bdf60b] rounded-lg p-8 text-center">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex space-x-4">
                <img
                  src="https://ext.same-assets.com/303058917/2314789232.jpeg"
                  alt="Before watermark removal"
                  className="flex-1 rounded-lg"
                />
                <img
                  src="https://ext.same-assets.com/303058917/521416573.jpeg"
                  alt="After watermark removal"
                  className="flex-1 rounded-lg"
                />
              </div>
              <div className="text-left">
                <p className="text-black font-medium">
                  Cleanup.pictures is also useful to remove any unwanted text, logo, date stamp, or watermark.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Testimonial */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">What experts say about Cleanup</h2>

          <div className="bg-gray-50 rounded-lg p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src="https://ext.same-assets.com/303058917/3840121517.jpeg"
                alt="Dawn Veltri"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="text-left">
                <p className="text-gray-700 mb-4 italic">
                  "I spent a significant amount of time last week trying to clean up a picture with similar programs and I kept getting weird smears and lines. I just edited the same photo with Cleanup.pictures and I was done in 30 secs without the smears and lines!"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">Dawn Veltri</p>
                  <p className="text-gray-600">Director of Marketing at Raek</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Logos */}
      <section className="bg-[#bdf60b] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-8">
            Powering the best creatives
          </h2>
          <div className="flex justify-center items-center space-x-8 md:space-x-12 opacity-60">
            <img src="https://ext.same-assets.com/303058917/2728975530.png" alt="AGP" className="h-8" />
            <img src="https://ext.same-assets.com/303058917/4017508395.svg" alt="Hyundai" className="h-8" />
            <img src="https://ext.same-assets.com/303058917/4198022680.svg" alt="Treze" className="h-8" />
            <img src="https://ext.same-assets.com/303058917/3886622620.png" alt="Wemuda" className="h-8" />
            <img src="https://ext.same-assets.com/303058917/4010050931.png" alt="Zigzag" className="h-8" />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">Pricing</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="p-6 border-2">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Free</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">0</span>
                </div>
                <ul className="space-y-3 mb-6 text-left">
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Unlimited images
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Resolution limited to 720p
                  </li>
                </ul>
                <Button variant="outline" className="w-full">Try Free</Button>
              </div>
            </Card>

            {/* Pro Plan */}
            <Card className="p-6 border-2 border-[#bdf60b] relative">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Pro</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">3</span>
                  <span className="text-gray-600 ml-1">starting from</span>
                </div>
                <ul className="space-y-3 mb-6 text-left">
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Unlimited images
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Unlimited resolution
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    High quality refiner
                  </li>
                </ul>
                <Button className="w-full bg-[#bdf60b] hover:bg-[#bdf60b]/90 text-black">Try Free</Button>
              </div>
            </Card>

            {/* ClipDrop Pro */}
            <Card className="p-6 border-2">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">ClipDrop Pro</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">11</span>
                  <span className="text-gray-600 ml-1">starting from</span>
                </div>
                <ul className="space-y-3 mb-6 text-left">
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Cleanup
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Remove background
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Replace background
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Uncrop
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Generative fill
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    A lot of other tools
                  </li>
                </ul>
                <Button variant="outline" className="w-full">Try Free</Button>
              </div>
            </Card>
          </div>

          {/* API Pricing */}
          <div className="mt-12 text-center">
            <Card className="p-6 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">API</h3>
              <p className="text-gray-600 mb-4">Usage-based pricing</p>
              <Button variant="outline">API documentation</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section id="faq" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">FAQ</h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">What is Inpainting?</h3>
              <p className="text-gray-600">
                Inpainting is a retouch technology used to remove any unwanted objects from photos (object removal). It can be used to remove an unwanted person. It used to work with a Clone tool like the inpaint, but using artificial intelligence gives much better results today.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Why Cleanup.Pictures is better than other inpainting app?</h3>
              <p className="text-gray-600">
                Cleanup.picture is an advanced editing tool based on Artificial Intelligence that is much better than other clone stamp tool. Clone tool like adobe photoshop fix, need a background reference, while our AI is truly able to guess what was behind the unwanted text, the unwanted people, unnecessary objects in just a few clicks.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">How much Cleanup.pictures cost?</h3>
              <p className="text-gray-600">
                Cleanup.Picture is free unless you need better quality and process hi-resolution images. The price is then $5 per month or $36 per year ($3 per month) for processing images of any size.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* API Section */}
      <section id="api" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img
            src="https://ext.same-assets.com/303058917/2104630990.jpeg"
            alt="API Documentation"
            className="w-full max-w-md mx-auto rounded-lg mb-8"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Use cleanup's high-quality & high availability inpainting API in your product today.
          </h2>
          <Button className="bg-[#bdf60b] hover:bg-[#bdf60b]/90 text-black">
            API documentation
          </Button>
        </div>
      </section>

      {/* Background Removal CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Looking for the best<br />background removal?
          </h2>

          <div className="bg-white rounded-lg p-6 inline-block">
            <img
              src="https://ext.same-assets.com/303058917/548389142.svg"
              alt="Remove Background"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Remove Background</h3>
            <p className="text-gray-600 mb-4 max-w-md">
              Remove the background of any image for free with incredible accuracy and ultra high-resolutions. Download your image with a transparent or white background.
            </p>
            <Button className="bg-[#bdf60b] hover:bg-[#bdf60b]/90 text-black">
              Try it now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <img
              src="https://ext.same-assets.com/303058917/1527332691.svg"
              alt="CleanUp.pictures"
              className="h-8 mx-auto mb-4"
            />
            <p className="text-gray-400 mb-4">
              CleanUp.pictures is a web application that lets you cleanup photos with a quick & simple interface.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>2022 Init ML</span>
              <a href="https://clipdrop.co/terms" className="hover:text-white">Terms & Services</a>
              <a href="https://clipdrop.co/privacy" className="hover:text-white">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
