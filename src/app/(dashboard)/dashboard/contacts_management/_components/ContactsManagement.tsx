

"use client";

import React, { useState } from "react";
import { Phone, Mail, Calendar, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import PageHeader from "@/components/DashboardHeader/pageHeader";
import { useGetContact } from "@/hooks/apiCalling";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

// Skeleton for contacts list
const ContactSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          className="p-6 border-b border-gray-700 flex flex-col gap-3"
        >
          <div className="h-4 bg-gray-700 rounded w-1/3" />
          <div className="flex gap-6">
            <div className="h-3 bg-gray-700 rounded w-1/4" />
            <div className="h-3 bg-gray-700 rounded w-1/5" />
            <div className="h-3 bg-gray-700 rounded w-1/6" />
          </div>
          <div className="h-3 bg-gray-700 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
};

function ContactsManagement() {
  const { data: session } = useSession();
  const token = (session?.user as { accessToken: string })?.accessToken;


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch contacts with pagination
  const contactsQuery = useGetContact(token, currentPage, itemsPerPage);
  const contacts = contactsQuery.data?.data?.data || [];
  const meta = contactsQuery.data?.data?.meta;
  const totalPages = meta?.total ? Math.ceil(meta.total / meta.limit) : 1;

  // For active selection
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  // Pagination Buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    buttons.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 p-0 bg-gray-700 border-gray-600 text-white hover:bg-gray-600 disabled:opacity-50"
      >
        <ChevronLeft />
      </Button>
    );

    for (let i = 1; i <= Math.min(maxVisiblePages, totalPages); i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(i)}
          className={`w-10 h-10 p-0 ${currentPage === i
              ? "bg-[#7DD3DD] border-[#7DD3DD] text-white hover:bg-cyan-600"
              : "bg-gray-700 border-[#7DD3DD] text-white hover:bg-gray-600"
            }`}
        >
          {i}
        </Button>
      );
    }

    buttons.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() =>
          currentPage < totalPages && setCurrentPage(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className="w-10 h-10 p-0 bg-gray-700 border-gray-600 text-white hover:bg-gray-600 disabled:opacity-50"
      >
        <ChevronRight />
      </Button>
    );

    return buttons;
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-10">
        <PageHeader
          title="Contact Management"
          breadcrumb="Organize, review, and respond to all inquiries in one place."
          btnText="Add Category"
          icon={Plus}
        />
      </div>

      <div className="border border-[#1F2937] rounded-lg">
        {contactsQuery.isLoading ? (
          <ContactSkeleton rows={5} />
        ) : contacts.length === 0 ? (
          <div className="p-6 text-gray-400">No contacts found.</div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact._id}
              onClick={() => setSelectedContact(contact._id)}
              className={`cursor-pointer transition-all duration-200 ${selectedContact === contact._id
                  ? "border-l-4 border-l-[#7DD3DD] rounded-sm"
                  : "bg-transparent hover:bg-gray-800/50"
                }`}
            >
              <div className="p-6 border-b border-[#1F2937]">
                <div className="space-y-3">
                  {/* Contact Name */}
                  <h3 className="text-white text-lg font-medium">
                    {contact.fullName}
                  </h3>

                  {/* Contact Details */}
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-500" />
                      <span>{contact.email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-500" />
                      <span>{contact.phoneNumber}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-500" />
                      <span>
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {contact.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {meta && meta?.total > (meta?.limit || itemsPerPage) && (
        <div className="flex items-center justify-between p-6 border-t border-gray-700 mt-4">
          <div className="text-sm text-gray-400">
            Showing {(meta.page - 1) * meta.limit + 1} to{" "}
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} results
          </div>
          <div className="flex items-center gap-1">{renderPaginationButtons()}</div>
        </div>
      )}
    </div>
  );
}

export default ContactsManagement;
