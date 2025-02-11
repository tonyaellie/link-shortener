"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/components/ui/tabs";
import { Button } from "~/app/components/ui/button";
import { Input } from "~/app/components/ui/input";
import { Label } from "~/app/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/components/ui/table";
import { PlusCircle, RefreshCw, Check, X, Plus } from "lucide-react";

// Mock data
const initialDomains = [
  {
    name: "example.com",
    redirects: [
      {
        from: ["short1", "alias1"],
        to: "https://destination.com/full-url",
        isLive: true,
      },
      {
        from: ["short2"],
        to: "https://another-destination.com",
        isLive: false,
      },
    ],
  },
  {
    name: "another-domain.com",
    redirects: [],
  },
];

export default function LinkShortener() {
  const [domains, setDomains] = useState(initialDomains);
  const [newRedirect, setNewRedirect] = useState({ from: [""], to: "" });

  const addRedirect = (domainIndex: number) => {
    const updatedDomains = [...domains];
    updatedDomains[domainIndex].redirects.push({
      ...newRedirect,
      isLive: false,
    });
    setDomains(updatedDomains);
    setNewRedirect({ from: [""], to: "" });
  };

  const addFromValue = () => {
    setNewRedirect({ ...newRedirect, from: [...newRedirect.from, ""] });
  };

  const updateFromValue = (index: number, value: string) => {
    const newFrom = [...newRedirect.from];
    newFrom[index] = value;
    setNewRedirect({ ...newRedirect, from: newFrom });
  };

  const recheckRedirect = (domainIndex: number, redirectIndex: number) => {
    const updatedDomains = [...domains];
    // Simulate checking the redirect
    updatedDomains[domainIndex].redirects[redirectIndex].isLive =
      Math.random() > 0.5;
    setDomains(updatedDomains);
  };

  const recheckAllRedirects = (domainIndex: number) => {
    const updatedDomains = [...domains];
    updatedDomains[domainIndex].redirects.forEach((redirect, index) => {
      // Simulate checking all redirects
      redirect.isLive = Math.random() > 0.5;
    });
    setDomains(updatedDomains);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Link Shortener</h1>
      <Tabs defaultValue={domains[0]?.name}>
        <div className="mb-4 flex items-center justify-between">
          <TabsList>
            {domains.map((domain) => (
              <TabsTrigger key={domain.name} value={domain.name}>
                {domain.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <Link
            href="/add-domain"
            className="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Domain
          </Link>
        </div>

        {domains.map((domain, domainIndex) => (
          <TabsContent key={domain.name} value={domain.name}>
            <div className="mb-4">
              <h2 className="mb-2 text-xl font-semibold">
                Redirects for {domain.name}
              </h2>
              <Button
                onClick={() => recheckAllRedirects(domainIndex)}
                className="mb-2"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Recheck All Redirects
              </Button>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {domain.redirects.map((redirect, redirectIndex) => (
                    <TableRow key={redirectIndex}>
                      <TableCell>
                        {redirect.from.map((from, fromIndex) => (
                          <div key={fromIndex} className="mb-1">
                            <Label>{from}</Label>
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>{redirect.to}</TableCell>
                      <TableCell>
                        {redirect.isLive ? (
                          <Check className="text-green-500" />
                        ) : (
                          <X className="text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() =>
                            recheckRedirect(domainIndex, redirectIndex)
                          }
                          size="sm"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
              <h3 className="mb-2 text-lg font-semibold">Add New Redirect</h3>
              <div className="space-y-2">
                {newRedirect.from.map((from, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Label htmlFor={`from-${index}`}>From:</Label>
                    <Input
                      id={`from-${index}`}
                      value={from}
                      onChange={(e) => updateFromValue(index, e.target.value)}
                      className="flex-grow"
                    />
                    {index === newRedirect.from.length - 1 && (
                      <Button onClick={addFromValue} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Label htmlFor="to">To:</Label>
                  <Input
                    id="to"
                    value={newRedirect.to}
                    onChange={(e) =>
                      setNewRedirect({ ...newRedirect, to: e.target.value })
                    }
                    className="flex-grow"
                  />
                </div>
                <Button onClick={() => addRedirect(domainIndex)}>
                  Add Redirect
                </Button>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
