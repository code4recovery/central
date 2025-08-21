import { config } from "~/helpers";
import { useTranslation } from "~/hooks";

export function Footer() {
  const strings = useTranslation();
  return (
    <footer>
      <div className="mx-auto max-w-7xl px-6 pb-16 text-center lg:px-8">
        <a
          className="text-sm leading-5 text-neutral-500 underline"
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
