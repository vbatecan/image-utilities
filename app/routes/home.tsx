import { Link } from "react-router";

export const meta = () => [
  { title: "Image Utilities" },
  {
    name: "description",
    content: "Fast image tools for compressing, resizing, and converting.",
  },
];

export default function Home() {
  return (
    <div>
      <h1>Image Utilities</h1>
      <p>
        Fast, private tools for compressing, resizing, and converting images in
        your browser.
      </p>
      <ul>
        <li>
          <Link to="/image/compress">Compress images</Link>
        </li>
        <li>
          <Link to="/image/resize">Resize images</Link>
        </li>
        <li>
          <Link to="/image/convert">Convert images</Link>
        </li>
      </ul>
    </div>
  );
}
