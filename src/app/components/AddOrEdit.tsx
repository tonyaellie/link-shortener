"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { InputTags } from "./ui/input-tags";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { addOrUpdateConfig } from "~/utils/actions";
import { toast } from "sonner";
import { Edit, Plus } from "lucide-react";

export const AddOrEdit = (props: {
  edit?: { id: string; from: string[]; to: string };
  repo: string;
  path: string;
  usedFrom: string[];
}) => {
  const [newRedirectFrom, setNewRedirectFrom] = useState<string[]>(
    props.edit?.from ?? [],
  );
  const [newRedirectTo, setNewRedirectTo] = useState(props.edit?.to ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const usedFrom = props.usedFrom.filter(
    (from) => !newRedirectFrom.includes(from),
  );

  const addRedirect = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newRedirectFrom.length === 0 || newRedirectTo.length === 0 || submitting) {
      return;
    }
    setSubmitting(true);
    toast.promise(
      addOrUpdateConfig({
        newRedirect: { from: newRedirectFrom, to: newRedirectTo, id: props.edit?.id },
        path: props.path,
        repo: props.repo,
      }),
      {
        success() {
          setNewRedirectFrom([]);
          setNewRedirectTo("");
          setSubmitting(false);
          setOpen(false);
          return "Redirect added!";
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon">
          {props.edit ? (
            <Edit className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.edit ? "Edit" : "Add"} Redirect</DialogTitle>
          <form className="flex flex-col gap-4" onSubmit={addRedirect}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="from">From:</Label>
              <InputTags
                id="from"
                onChange={setNewRedirectFrom}
                value={newRedirectFrom}
                placeholder="Enter froms"
                validate={(value) => !usedFrom.includes(value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="to">To:</Label>
              <Input
                id="to"
                value={newRedirectTo}
                onChange={(e) => setNewRedirectTo(e.target.value)}
                className="flex-grow"
              />
            </div>
            <Button
              type="submit"
              disabled={
                submitting ||
                newRedirectFrom.length === 0 ||
                newRedirectTo.length === 0
              }
            >
              Add Redirect
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
