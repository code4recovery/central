export default function Index() {
  return (
    <div className="max-w-3xl mx-auto my-5">
      <h1 className="font-black text-3xl mb-3">Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
            className="text-blue-700 underline"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
            className="text-blue-700 underline"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/docs"
            rel="noreferrer"
            className="text-blue-700 underline"
          >
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
