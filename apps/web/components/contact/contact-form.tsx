"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Phone,
  Mail,
  Headset,
  MessageSquare,
  AlertCircle,
  Facebook,
  Instagram,
  Youtube,
  Music2,
  LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useGetData } from "@/hooks/use-get-data";
import { useInsertOne } from "@/hooks/use-insert-data";
import { Card, CardContent } from "../ui/card";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  const { data: socialData } = useGetData<any>("settings_social_links");
  const { data: contactData } = useGetData<any>("settings_contact_details");

  const savedLinks = socialData?.[0]?.links || {};
  const contactInfo = contactData?.[0] || {};

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (values: ContactValues) => {
    setLoading(true);
    const loadingId = toast.loading("Sending your message...");
    try {
      await useInsertOne("contacts", values);
      toast.dismiss(loadingId);
      toast.success("✅ Message sent successfully!");
      form.reset();
    } catch (error: any) {
      toast.dismiss(loadingId);
      toast.error(error.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { icon: <Facebook size={18} />, url: savedLinks.facebook },
    { icon: <Instagram size={18} />, url: savedLinks.instagram },
    { icon: <Youtube size={18} />, url: savedLinks.youtube },
    { icon: <Music2 size={18} />, url: savedLinks.tiktok },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-16">
      <div className="space-y-10">
        <div>
          <h1 className="text-xl md:text-2xl xl:text-4xl font-semibold mb-6">
            Contact Us
          </h1>
          <p className="text-white/60 text-base max-w-md leading-relaxed">
            We’re here to answer your questions and provide the support you
            need.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 group">
            <div className="p-3 bg-secondary/10 rounded-full text-secondary group-hover:scale-110 transition-all">
              <Phone size={18} />
            </div>
            <a
              href={`tel:${contactInfo.phone}`}
              className="text-base font-medium"
            >
              {contactInfo.phone || "Loading..."}
            </a>
          </div>

          <div className="flex items-center gap-4 group">
            <div className="p-3 bg-secondary/10 rounded-full text-secondary group-hover:scale-110 transition-all">
              <Mail size={18} />
            </div>
            <a
              href={`mailto:${contactInfo.email}`}
              className="text-base font-medium"
            >
              {contactInfo.email || "Loading..."}
            </a>
          </div>
        </div>

        <div className="pt-4">
          <h5 className="text-base xl:text-xl font-bold mb-6">
            Connect with us:
          </h5>
          <div className="flex gap-4">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                className="size-10 flex items-center justify-center border border-white/20 rounded-full text-white hover:border-secondary hover:text-secondary transition-all"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-8 pt-8 border-t border-white/10">
          <SupportItem
            icon={<Headset size={18} />}
            title="Customer Support"
            desc="Assisting you every step of the way."
          />
          <SupportItem
            icon={<MessageSquare size={18} />}
            title="Feedback"
            desc="We value your input to improve."
          />
          <SupportItem
            icon={<AlertCircle size={18} />}
            title="Complaints"
            desc="Resolved quickly and fairly."
          />
        </div>
      </div>

      <Card className="bg-card/50">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <h2 className="text-xl xl:text-2xl font-semibold mb-4">
                Get In Touch
              </h2>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-white/60">Fullname</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        {...field}
                        className="mt-1 py-8 px-0 border-b border-b-white/30 outline-none text-xl rounded-none border-t-0 border-l-0 border-r-0 focus-visible:ring-0 focus-visible:border-b-secondary bg-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-white/60">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        className="mt-1 py-8 px-0 border-b border-b-white/30 outline-none text-xl rounded-none border-t-0 border-l-0 border-r-0 focus-visible:ring-0 focus-visible:border-b-secondary bg-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-white/60">
                      How can we help?
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your message here..."
                        {...field}
                        className="mt-1 min-h-[150px] py-4 px-0 border-b border-b-white/30 outline-none text-xl rounded-none border-t-0 border-l-0 border-r-0 focus-visible:ring-0 focus-visible:border-b-secondary bg-transparent resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button variant="secondary" size="lg" disabled={loading}>
                {loading && <LoaderCircle className="mr-2 animate-spin" />}
                Submit Message
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

function SupportItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="text-secondary">{icon}</div>
      <div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="text-white/40 text-sm">{desc}</p>
      </div>
    </div>
  );
}
