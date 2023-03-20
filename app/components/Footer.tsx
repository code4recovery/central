import { config } from "~/helpers";
import { strings } from "~/i18n";

export function Footer() {
  return (
    <footer className="border-t border-gray-300">
      <div className="mx-auto max-w-7xl pt-6 pb-16 px-6 lg:px-8 text-center">
        <a
          className="text-sm leading-5 text-gray-500 underline"
          href={config.aboutUrl}
          rel="noreferrer"
          target="_blank"
        >
          {strings.about}
        </a>
      </div>
    </footer>
  );
}
