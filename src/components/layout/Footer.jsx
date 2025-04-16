import Link from "next/link";
import {
  Leaf,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="w-full xl:w-[80%] p-[20px] m-auto py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xl font-bold text-orange-600"
            >
              <Leaf className="h-6 w-6" />
              <span>Yumcycle</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              Connecting you with great food while reducing waste. Our mission
              is to make food ordering convenient while promoting
              sustainability.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-orange-600"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-orange-600"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-orange-600"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-orange-600"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-orange-600">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/restaurants"
                  className="text-gray-500 hover:text-orange-600"
                >
                  Restaurants
                </Link>
              </li>
              <li>
                <Link
                  href="/food-waste"
                  className="text-gray-500 hover:text-orange-600"
                >
                  Food Waste Initiative
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-500 hover:text-orange-600"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-500 hover:text-orange-600"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="/faq"
                  className="text-gray-500 hover:text-orange-600"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-500 hover:text-orange-600"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/partner"
                  className="text-gray-500 hover:text-orange-600"
                >
                  Partner With Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-500 hover:text-orange-600"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-500 hover:text-orange-600"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-500 hover:text-orange-600"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-start">
                <Mail className="mr-2 h-5 w-5 text-gray-500" />
                <span className="text-gray-500">support@yumcycle.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="mr-2 h-5 w-5 text-gray-500" />
                <span className="text-gray-500">+234 904 945 5966</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-sm text-gray-500 m-auto">
          <p>© {new Date().getFullYear()} Yumcycle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
