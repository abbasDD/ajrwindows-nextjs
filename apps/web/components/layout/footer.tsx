"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Youtube,
  Music2,
  Phone,
  Mail,
} from "lucide-react";
import { useGetData } from "@/hooks/use-get-data";
import LayoutXSmall from "../layout/layout-x-small";
import { Button } from "../ui/button";
import TikTokIcon from "../tiktok-icon";

const Footer = () => {
  const { data } = useGetData<any>("settings_social_links");
  const { data: contactData } = useGetData<any>("settings_contact_details");

  const quicklinks = [
    { name: "Design Center", path: "/custom-design" },
    { name: "Shop", path: "/categories" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  const resources = [{ name: "E-Catalog", path: "/catalog" }];

  const paymentMethods = [
    { src: "/payment/master.png", alt: "Mastercard" },
    { src: "/payment/paypal.png", alt: "Paypal" },
    { src: "/payment/cash.png", alt: "Cash" },
  ];

  const savedLinks = data?.[0]?.links || {};
  const contact = contactData?.[0];

  const socialLinks = [
    {
      icon: <Facebook size={18} />,
      url: savedLinks.facebook,
      label: "Facebook",
    },
    {
      icon: <Instagram size={18} />,
      url: savedLinks.instagram,
      label: "Instagram",
    },
    { icon: <Youtube size={18} />, url: savedLinks.youtube, label: "YouTube" },
    {
      icon: <TikTokIcon size={18} color="#000" />,
      url: savedLinks.tiktok,
      label: "TikTok",
    },
  ];

  return (
    <footer className="text-white py-16">
      <LayoutXSmall>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand & Socials */}
          <div className="lg:col-span-2 space-y-6">
            <Image
              src="/assets/AJR.png"
              alt="Logo"
              width={70}
              height={40}
              className="h-auto"
            />
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Build customizable doors and windows with AJR. One Stop Solution
              for all your architectural needs.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(
                (social, i) =>
                  social.url && (
                    <Link
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="secondary" size="icon">
                        {social?.icon}
                      </Button>
                    </Link>
                  ),
              )}
            </div>
          </div>

          <div>
            <h3 className="text-secondary font-bold uppercase tracking-widest text-xs mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {quicklinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.path}
                    className="text-white/50 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-secondary font-bold uppercase tracking-widest text-xs mb-6">
              Resources
            </h3>
            <ul className="space-y-4">
              {resources.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.path}
                    className="text-white/50 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-secondary font-bold uppercase tracking-widest text-xs mb-6">
                Contact
              </h3>
              <ul className="space-y-3 text-sm text-white/50">
                <li className="flex items-center gap-3">
                  <Phone size={14} className="text-secondary" />
                  <Link
                    href={`tel:${contact?.phone}`}
                    className="hover:text-white transition-colors"
                  >
                    {contact?.phone}
                  </Link>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={14} className="text-secondary" />
                  <Link
                    href={`mailto:${contact?.email}`}
                    className="hover:text-white transition-colors"
                  >
                    {contact?.email}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-secondary font-bold uppercase tracking-widest text-xs mb-6">
                Payment Methods
              </h3>
              <div className="flex gap-3">
                {paymentMethods.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white/5 grid place-items-center rounded px-3 py-2 border border-white/5 grayscale hover:grayscale-0 transition-all"
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={35}
                      height={20}
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 text-[10px] uppercase tracking-widest font-bold">
          <p>© 2026 AJR Systems. All Rights Reserved.</p>
        </div>
      </LayoutXSmall>
    </footer>
  );
};

export default Footer;
