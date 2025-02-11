"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Lock } from "lucide-react";

import { Button } from "~/app/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/app/components/ui/command";
import { Input } from "~/app/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/app/components/ui/popover";
import {
  Avatar,
  AvatarImage,
} from "~/app/components/ui/avatar";
import { cn } from "~/app/lib/utils";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface Props {
  repositories?: Repository[];
  onSelect?: (user: string, repo: string, path: string, domain: string) => void;
}

export const GithubSelector = ({ repositories = [], onSelect }: Props) => {
  const [openUser, setOpenUser] = useState(false);
  const [openRepo, setOpenRepo] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("");
  const [configPath, setConfigPath] = useState("");
  const [domain, setDomain] = useState(""); // New state for domain

  // Get unique users from repositories
  const users =
    Array.from(new Set(repositories?.map((repo) => repo.owner.login))).map(
      (login) => {
        return repositories.find((repo) => repo.owner.login === login)!.owner;
      },
    ) || [];
  
  // Get repositories for selected user
  const userRepos =
    repositories?.filter((repo) => repo.owner.login === selectedUser) || [];

  const handleUserSelect = (user: string) => {
    setSelectedUser(user);
    setSelectedRepo("");
    setDomain(""); 
    setOpenUser(false);
  };

  const handleRepoSelect = (repo: string) => {
    setSelectedRepo(repo);
    setOpenRepo(false);
  };

  return (
    <div className="bg-card text-card-foreground w-full max-w-md space-y-4 rounded-lg border p-4 shadow-sm">
      <h2 className="text-xl font-semibold">Import Git Repository</h2>

      <div className="space-y-4">
        {/* User Selection */}
        <Popover open={openUser} onOpenChange={setOpenUser}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openUser}
              className="w-full justify-between"
            >
              {selectedUser ? (
                <div className="flex items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarImage src={users.find((user) => user.login === selectedUser)?.avatar_url} />
                  </Avatar>
                  {selectedUser}
                </div>
              ) : (
                "Select user..."
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search users..." />
              <CommandList>
                <CommandEmpty>No user found.</CommandEmpty>
                <CommandGroup>
                  {users.map((user) => (
                    <CommandItem
                      key={user.login}
                      onSelect={() => handleUserSelect(user.login)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedUser === user.login
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <Avatar>
                        <AvatarImage src={user.avatar_url} />
                      </Avatar>
                      {user.login}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Repository Selection */}
        <Popover open={openRepo} onOpenChange={setOpenRepo}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openRepo}
              className="w-full justify-between"
              disabled={!selectedUser}
            >
              {selectedRepo ? (
                <div className="flex items-center gap-2">
                  {selectedRepo}
                </div>
              ) : (
                "Select repository..."
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search repositories..." />
              <CommandList>
                <CommandEmpty>No repository found.</CommandEmpty>
                <CommandGroup>
                  {userRepos.map((repo) => (
                    <CommandItem
                      key={repo.id}
                      onSelect={() => handleRepoSelect(repo.name)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedRepo === repo.name
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {repo.name}
                      {repo.private && <Lock className="ml-2 h-4 w-4" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Domain Input */}
        <div className="space-y-2">
          <Input
            placeholder="Enter domain..."
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            disabled={!selectedRepo}
          />
        </div>

        {/* Config Path Input */}
        <div className="space-y-2">
          <Input
            placeholder="Path to config..."
            value={configPath}
            onChange={(e) => setConfigPath(e.target.value)}
            disabled={!selectedRepo}
          />
        </div>

        <Button
          className="w-full"
          disabled={!selectedUser || !selectedRepo}
          onClick={() => onSelect?.(selectedUser, selectedRepo, configPath, domain)}
        >
          Import Repository
        </Button>
      </div>
    </div>
  );
};
