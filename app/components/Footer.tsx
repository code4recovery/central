import { config } from "~/helpers";
import { strings } from "~/i18n";
import { GithubLogo } from "~/icons";

export function Footer() {
  return (
    <footer className="border-t border-gray-300">
      <div className="mx-auto max-w-7xl py-12 px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <a
            className="text-gray-400 hover:text-gray-500"
            href={config.sourceLink}
            target="_blank"
            rel="noreferrer"
          >
            <span className="sr-only">{config.sourceLabel}</span>
            <GithubLogo className="h-8 w-8" />
          </a>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-sm leading-5 text-gray-500">
            <a href={config.aboutUrl} target="_blank" rel="noreferrer">
              {strings.about}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
