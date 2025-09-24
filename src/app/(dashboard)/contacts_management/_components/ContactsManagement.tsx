"use client";

import React, { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, Calendar, Plus } from "lucide-react";
import PageHeader from "@/components/DashboardHeader/pageHeader";

// Mock data for contacts
const contactsData = [
  {
    id: 1,
    name: "Emma Thompson",
    email: "emma.thompson@example.com",
    phone: "+1 (555) 123-4567",
    joinDate: "10 June 2025",
    description:
      "Hi, I'm interested in becoming a creator with your network. I have over 500k followers on TikTok and I'd love to discuss potential opportunities.",
    avatar: "/api/placeholder/60/60",
  },
  {
    id: 2,
    name: "Michael Garcia",
    email: "michaelgarcia@example.com",
    phone: "+1 (555) 234-5678",
    joinDate: "12 July 2025",
    description:
      "Hello, I represent a lifestyle brand looking to partner with some of your creators for an upcoming campaign. Please let me know how we can collaborate.",
    avatar: "/api/placeholder/60/60",
  },
  {
    id: 3,
    name: "Sophia Chen",
    email: "sophia.chen@example.com",
    phone: "+1 (555) 345-6789",
    joinDate: "08 Aug 2025",
    description:
      "I'm a talent manager looking to bring some of my clients to your network. Could we schedule a call to discuss the benefits and process?",
    avatar: "/api/placeholder/60/60",
  },
  {
    id: 4,
    name: "James Wilson",
    email: "jameswilson@example.com",
    phone: "+1 (555) 456-7890",
    joinDate: "24 Aug 2025",
    description:
      "We're organizing a creator conference next spring and would love to have some representation from your network. Would you be interested in a speaking opportunity?",
    avatar: "/api/placeholder/60/60",
  },
  {
    id: 5,
    name: "Olivia Martinez",
    email: "olivia.martinez@example.com",
    phone: "+1 (555) 567-8901",
    joinDate: "10 Sept 2025",
    description:
      "I've been following your agency's work and I'm impressed with the campaigns you've managed. I'm a beauty influencer with 300k followers across platforms. Would love to join your network.",
    avatar: "/api/placeholder/60/60",
  },
];

function ContactsManagement() {
  const [selectedContact, setSelectedContact] = useState(1); // Emma Thompson is selected by default

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-10">
        <PageHeader
          title="Contact Management "
          breadcrumb="Organize, review, and respond to all inquiries in one place."
          // btnLink="/dashboard/category/add"
          btnText="Add Category"
          icon={Plus}
        />
      </div>
      {/* Blue badge in top right */}
      <div className="fixed top-4 right-4 z-10">
        <span className="text-white px-3 py-1 rounded text-sm font-medium">
          1570 x 62 Hug
        </span>
      </div>

      <div className="border rounded-lg">
        {contactsData.map((contact) => (
          <div
            key={contact.id}
            onClick={() => setSelectedContact(contact.id)}
            className={`cursor-pointer transition-all duration-200 ${
              selectedContact === contact.id
                ? "border-l-4 border-l-[#7DD3DD] rounded-sm"
                : "bg-transparent hover:bg-gray-800/50"
            }`}
          >
            <div className="p-6 border-b">
              <div className="space-y-3">
                {/* Contact Name */}
                <h3 className="text-white text-lg font-medium">
                  {contact.name}
                </h3>

                {/* Contact Details Row */}
                <div className="flex items-center gap-6 text-sm text-gray-400"> 
                  {/* Email */}
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-500" />
                    <span>{contact.email}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-500" />
                    <span>{contact.phone}</span>
                  </div>

                  {/* Join Date */}
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-500" />
                    <span>{contact.joinDate}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {contact.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContactsManagement;
