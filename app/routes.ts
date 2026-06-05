import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/_layout.tsx", [
    index("routes/home.tsx"),
    route("image/compress", "routes/image.compress.tsx"),
    route("image/resize", "routes/image.resize.tsx"),
    route("image/convert", "routes/image.convert.tsx"),
  ]),
] satisfies RouteConfig;
