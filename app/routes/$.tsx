import { json } from "@remix-run/node";
import { Template } from "~/components";

export const loader = () => {
  return json(null, { status: 404 });
};

export default function NotFound() {
  return (
    <Template>
      <div className="text-center grid gap-3 py-12">
        <h1 className="text-9xl font-bold">404</h1>
        <p>Page not found</p>
      </div>
    </Template>
  );
}
