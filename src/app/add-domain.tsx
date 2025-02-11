"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/app/components/ui/button";
import { Input } from "~/app/components/ui/input";
import { Label } from "~/app/components/ui/label";

export default function AddDomain() {
  const [newDomain, setNewDomain] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the new domain to your backend
    console.log("New domain:", newDomain);
    // Then redirect back to the main page
    router.push("/");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Add New Domain</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="domain">Domain Name</Label>
          <Input
            id="domain"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="example.com"
          />
        </div>
        <Button type="submit">Add Domain</Button>
      </form>
    </div>
  );
}
