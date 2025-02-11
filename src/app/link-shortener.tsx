"use client";

import Link from "next/link";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/components/ui/tabs";
import { Button, buttonVariants } from "~/app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/components/ui/table";
import {
  PlusCircle,
  RefreshCw,
  Check,
  X,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { Badge } from "~/app/components/ui/badge";
import { AddOrEdit } from "./components/AddOrEdit";
import { cn } from "./lib/utils";
import { deleteRedirect } from "~/utils/actions";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export const LinkShortener = ({
  configs,
}: {
  configs: {
    id: string;
    domain: string;
    repo: string;
    path: string;
    redirects: {
      from: string[];
      to: string;
      id: string;
    }[];
  }[];
  }) => {
  const [statuses, setStatuses] = useState({});
  const usedFrom = [
    ...new Set(...configs.flatMap((c) => c.redirects.map((r) => r.from))),
  ];

  useEffect(() => { 
    // fetch statuses
    // void getStatus(configs[0]!.domain, configs[0]!.secret);
  }, []);

  return (
    <div className="container mx-auto p-4">
      {usedFrom}
      <h1 className="mb-4 text-2xl font-bold">Link Shortener</h1>
      <Tabs defaultValue={configs.map((c) => c.id)[0]}>
        <div className="mb-4 flex items-center justify-between">
          <TabsList>
            {configs.map((c) => (
              <TabsTrigger key={c.domain} value={c.id}>
                {c.domain}
              </TabsTrigger>
            ))}
          </TabsList>
          <Link href="/add" className={buttonVariants()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Domain
          </Link>
        </div>

        {configs.map((config, configIndex) => (
          <TabsContent key={config.id} value={config.id}>
            <div className="mb-4">
              <h2 className="mb-2 text-xl font-semibold">
                Redirects for {config.domain}
              </h2>
              <Button
                onClick={() => {
                  throw new Error("Implement all refresh");
                }}
                className="mb-2"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Update Status
              </Button>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead className="text-center">Edit</TableHead>
                    <TableHead className="text-center">Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {config.redirects.map((redirect, redirectIndex) => (
                    <TableRow key={redirectIndex}>
                      <TableCell className="flex flex-wrap gap-2">
                        {redirect.from.map((from, fromIndex) => (
                          <Badge key={fromIndex}>{from}</Badge>
                        ))}
                      </TableCell>
                      <TableCell>
                        <a
                          className={cn(
                            buttonVariants({ variant: "link" }),
                            "hover:cursor-pointer",
                          )}
                          href={redirect.to}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {redirect.to}
                        </a>
                      </TableCell>
                      <TableCell className="text-center">
                        <AddOrEdit
                          repo={config.repo}
                          path={config.path}
                          usedFrom={usedFrom}
                          edit={{
                            id: redirect.id,
                            from: redirect.from,
                            to: redirect.to,
                          }}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          onClick={() =>
                            toast.promise(
                              deleteRedirect({
                                id: redirect.id,
                                repo: config.repo,
                                path: config.path,
                              }),
                            )
                          }
                          size="icon"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <AddOrEdit
              repo={config.repo}
              path={config.path}
              usedFrom={usedFrom}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
