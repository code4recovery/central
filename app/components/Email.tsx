import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { config, formatClasses as cx } from "~/helpers";

type EmailProps = {
  buttonLink: string;
  buttonText: string;
  footer: string;
  headline: string;
  imageHeight: number;
  imageSrc: string;
  imageWidth: number;
  instructions: string;
  subject: string;
};

export const Email = ({
  buttonLink,
  buttonText,
  footer,
  headline,
  imageHeight,
  imageSrc,
  imageWidth,
  instructions,
  subject,
}: EmailProps) => {
  const { background, backgroundHover } = config.theme;
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>{headline}</Preview>
        <Body className="bg-neutral-100 font-sans mx-auto my-auto py-4 text-center">
          <Container className="bg-white border border-neutral-200 rounded p-5">
            <Section className="mt-5">
              <Img
                alt="Central"
                className="block mx-auto my-0"
                height={imageHeight}
                src={imageSrc}
                width={imageWidth}
              />
            </Section>
            <Heading className="text-neutral-800 text-xl font-bold text-center p-0 my-3 mx-0">
              {subject}
            </Heading>
            <Text className="text-neutral-800 text-base">{headline}</Text>
            <Text className="text-neutral-800 text-base">{instructions}</Text>
            <Section className="text-center mt-5 mb-3">
              <Button
                pX={20}
                pY={12}
                className={cx(
                  "rounded text-white font-semibold no-underline text-center text-base",
                  background,
                  backgroundHover
                )}
                href={buttonLink}
              >
                {buttonText}
              </Button>
            </Section>
          </Container>
          <Container className="px-5">
            <Text className="text-neutral-500 text-sm">{footer}</Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};
