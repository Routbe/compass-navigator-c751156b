import { describe, expect, it } from "vitest";
import { isAllowedProxyUrl, proxied, profileImageSrc } from "./image-proxy-rules";

describe("image proxy allowlist", () => {
  it("allows a known image host over https", () => expect(isAllowedProxyUrl("https://i.ytimg.com/vi/x/mqdefault.jpg")).not.toBeNull());
  it("refuses plain http", () => expect(isAllowedProxyUrl("http://i.ytimg.com/a.jpg")).toBeNull());
  it("refuses unknown hosts", () => expect(isAllowedProxyUrl("https://evil.example/a.jpg")).toBeNull());
  it("refuses internal IPs", () => expect(isAllowedProxyUrl("https://169.254.169.254/latest")).toBeNull());
  it("refuses credentials in the URL", () => expect(isAllowedProxyUrl("https://a:b@i.ytimg.com/x.jpg")).toBeNull());
  it("drops unknown images instead of loading them directly", () => expect(proxied("https://tracker.example/p.gif")).toBeNull());
  it("keeps stored first-party avatars", () => expect(profileImageSrc("/api/public/avatar?path=abc/file.webp")).toBe("/api/public/avatar?path=abc/file.webp"));
  it("routes remote avatars through the privacy proxy", () => expect(profileImageSrc("https://cdn.bsky.app/avatar.jpg")).toBe("/api/public/proxy-image?url=https%3A%2F%2Fcdn.bsky.app%2Favatar.jpg"));
  it("never loads protocol-relative remote avatars", () => expect(profileImageSrc("//tracker.example/p.gif")).toBeNull());
});
