import { Kbd } from "@/components/custom/kbd";
import { Link } from "@/components/custom/link";
import { Bluesky } from "@/components/icons/bluesky";
import { Github } from "@/components/icons/github";
import { X } from "@/components/icons/x";
import { ModeToggle } from "@/components/theme/toggle-mode";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Book, Command } from "lucide-react";
import { Link as NextLink } from "react-router";

export function SocialsFooter() {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid w-full grid-cols-3 items-center justify-center gap-2 p-1 md:grid-cols-6">
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0" asChild>
          <NextLink to="https://github.com/openstatusHQ/data-table-filters">
            <Github className="h-4 w-4" />
          </NextLink>
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0" asChild>
          <NextLink to="https://twitter.com/openstatusHQ">
            <X className="h-4 w-4" />
          </NextLink>
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0" asChild>
          <NextLink to="https://bsky.app/profile/openstatus.dev">
            <Bluesky className="h-4 w-4" />
          </NextLink>
        </Button>
        <ModeToggle className="h-8 w-8 [&>svg]:h-4 [&>svg]:w-4" />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
              <Command className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto px-2 py-1">
            <HotkeyOverview />
          </PopoverContent>
        </Popover>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0" asChild>
          <NextLink to="/guide">
            <Book className="h-4 w-4" />
          </NextLink>
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Powered by{" "}
        <Link href="https://openstatus.dev" hideArrow>
          OpenStatus
        </Link>
      </p>
      <p className="text-center text-[10px] text-muted-foreground">
        The project is in active development. For feedback, please{" "}
        <Link
          href="https://github.com/openstatusHQ/data-table-filters/issues/new"
          className="text-muted-foreground"
          hideArrow
        >
          open an issue
        </Link>{" "}
        on GitHub.
      </p>
    </div>
  );
}

const hotkeys = [
  { key: "K", description: "Toggle command input" },
  { key: "B", description: "Toggle sidebar controls" },
  {
    key: "U",
    description: "Undo column state (order, visibility)",
  },
  {
    key: "J",
    description: "Toggle live mode",
  },
  { key: "Esc", description: "Reset table filters" },
  {
    key: ".",
    description: "Reset element focus to start",
  },
];

function HotkeyOverview() {
  return (
    <ul className="divide-y">
      {hotkeys.map((props) => {
        return (
          <li key={props.key} className="grid grid-cols-4 gap-2 py-0.5">
            <span className="col-span-1 text-left">
              <Kbd className="ml-1">
                <span className="mr-1">⌘</span>
                <span>{props.key}</span>
              </Kbd>
            </span>
            <span className="col-span-3 place-content-center text-xs text-muted-foreground">
              {props.description}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
